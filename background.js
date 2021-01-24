var currentTabId;
var join_times;
var integral;
var badges;
var t_title;
var t_join_times;
var t_integral;
var accuracy_1;
var accuracy_2;
var accuracy_3;
var accuracy_4;

function onWindowCreate(tabId) {
    currentTabId = tabId;
    chrome.debugger.attach({
        tabId: tabId
    }, '1.3', onAttach.bind(null, currentTabId));
}

function onAttach(tabId) {
    chrome.debugger.sendCommand({
        tabId: tabId
    }, 'Emulation.setDeviceMetricsOverride', {
        mobile: true,
        deviceScaleFactor: 0,
        width: 500,
        height: 0
    });
    chrome.debugger.sendCommand({
        tabId: tabId
    }, 'Emulation.setUserAgentOverride', {
        userAgent: 'Mozilla/5.0 (Linux; U; Android 9; zh-cn; MI CC 9e Build/PKQ1.190416.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.141 Mobile Safari/537.36 XiaoMi/MiuiBrowser/11.8.12',
        platform: 'Android'
    });
    chrome.debugger.sendCommand({
        tabId: tabId
    }, 'Fetch.enable', {
        patterns: [{
            requestStage: 'Response',
            urlPattern: 'https://ssxx.univs.cn/cgi-bin/race/grade/?t=*&activity_id=5f71e934bcdbf3a8c3ba5061'
        }, {
            requestStage: 'Response',
            urlPattern: 'https://ssxx.univs.cn/cgi-bin/user/race/fight/accuracy/?t=*&activity_id=5f71e934bcdbf3a8c3ba5061'
        }]
    });
    chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {
    if (currentTabId != debuggeeId.tabId)
        return;
    if (message == 'Fetch.requestPaused') {
        chrome.debugger.sendCommand({
            tabId: debuggeeId.tabId
        }, 'Fetch.getResponseBody', {
            requestId: params.requestId
        }, function (response) {
            var match = false;
            var resBody = JSON.parse(Base64.decode(response.body))
            var url = params.request.url;
            var gradePattern = /https:\/\/ssxx.univs.cn\/cgi-bin\/race\/grade\/\?t=.+&activity_id=5f71e934bcdbf3a8c3ba5061/;
            var accuracyPattern = /https:\/\/ssxx.univs.cn\/cgi-bin\/user\/race\/fight\/accuracy\/\?t=.+&activity_id=5f71e934bcdbf3a8c3ba5061/;
            if (gradePattern.test(url)) {
                match = true;
                resBody.data.join_times = join_times;
                resBody.data.integral = integral;
                resBody.data.badges = badges;
                resBody.data.t_title = t_title;
                resBody.data.t_join_times = t_join_times;
                resBody.data.t_integral = t_integral;
                var resStr = Base64.encode(JSON.stringify(resBody));
                chrome.debugger.sendCommand({
                    tabId: debuggeeId.tabId
                }, 'Fetch.fulfillRequest', {
                    requestId: params.requestId,
                    responseCode: 200,
                    body: resStr
                });
            } else if (accuracyPattern.test(url)) {
                match = true;
                for (var key in resBody.data) {
                    if (resBody.data[key].title == '英雄篇')
                        resBody.data[key].accuracy = accuracy_1;
                    else if (resBody.data[key].title == '复兴篇')
                        resBody.data[key].accuracy = accuracy_2;
                    else if (resBody.data[key].title == '创新篇')
                        resBody.data[key].accuracy = accuracy_3;
                    else if (resBody.data[key].title == '信念篇')
                        resBody.data[key].accuracy = accuracy_4;
                }
                var resStr = Base64.encode(JSON.stringify(resBody));
                chrome.debugger.sendCommand({
                    tabId: debuggeeId.tabId
                }, 'Fetch.fulfillRequest', {
                    requestId: params.requestId,
                    responseCode: 200,
                    body: resStr
                });
            }
        });
    }
}
chrome.runtime.onMessage.addListener(function (receivedMsg, sender, sendResponse) {
    if (receivedMsg.msg == 'capture_started') {
        chrome.debugger.sendCommand({
            tabId: currentTabId
        }, 'Emulation.setDeviceMetricsOverride', {
            mobile: true,
            deviceScaleFactor: 0,
            width: 500,
            height: 1500
        });
        sendResponse({
            msg: 'screen_adjusted'
        });
    } else if (receivedMsg.msg == 'capture_done') {
        chrome.debugger.sendCommand({
            tabId: currentTabId
        }, 'Emulation.setDeviceMetricsOverride', {
            mobile: true,
            deviceScaleFactor: 0,
            width: 500,
            height: 0
        });
    }
});
chrome.debugger.onDetach.addListener(function () {
    chrome.tabs.query({}, function (tabs) {
        for (var key in tabs) {
            if (tabs[key].id == currentTabId)
                chrome.tabs.remove(currentTabId);
        }
    });
});
chrome.windows.onRemoved.addListener(function (windowId) {
    if (windowId == currentTabId)
        chrome.debugger.detach();
});