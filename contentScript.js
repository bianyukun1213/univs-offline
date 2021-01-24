function capture() {
    chrome.runtime.sendMessage({
        msg: 'capture_started'
    }, function (response) {
        if (response.msg == 'screen_adjusted') {
            var node = document.getElementsByClassName('mobile mobile-3')[0];
            domtoimage.toJpeg(node, {
                width: node.offsetWidth,
                height: node.offsetHeight
            }).then(function (dataUrl) {
                var a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'pic.jpg';
                a.click();
                chrome.runtime.sendMessage({
                    msg: 'capture_done'
                });
            });
        }
    });
};
var link = document.head.querySelector('link');
link.href = chrome.extension.getURL('icon_48.png');
document.title = '中国大学生掉线';
var div = document.createElement('div');
div.style = 'position:fixed;bottom:50px;right:50px;';
var button = document.createElement('button');
button.innerText = '长截图';
button.style = 'font-size:28px;border:none;border-radius:4px;text-align:center;cursor:pointer;padding:20px;background-color:#008080;color:#FFFFFF;box-shadow:10px 10px 10px rgba(0,0,0,0.5);';
button.onclick = this.capture;
div.appendChild(button);
document.getElementById('app').appendChild(div);
window.onload = function () {
    var iconDiv = document.getElementsByClassName('col-left')[0];
    var sharingDiv = document.getElementsByClassName('share')[0];
    var goBackDiv = document.getElementsByClassName('mode_back')[0];
    var rulesDiv = document.getElementsByClassName('activity_wrap_order')[0];
    iconDiv.style = 'pointer-events:none;cursor:default;';
    sharingDiv.style = 'pointer-events:none;cursor:default;';
    goBackDiv.style = 'pointer-events:none;cursor:default;';
    rulesDiv.style = 'pointer-events:none;cursor:default;';
};