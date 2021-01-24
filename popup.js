var bg = chrome.extension.getBackgroundPage();

document.addEventListener('DOMContentLoaded', function () {
    var p = /^\d+$/;
    document.getElementById('apply').addEventListener('click', function () {
        var join_times = document.getElementById('join_times').value;
        var integral = document.getElementById('integral').value;
        var badges = document.getElementById('badges').value;
        var t_title = document.getElementById('t_title').value;
        var t_join_times = document.getElementById('t_join_times').value;
        var t_integral = document.getElementById('t_integral').value;
        var accuracy_1 = document.getElementById('accuracy_1').value;
        var accuracy_2 = document.getElementById('accuracy_2').value;
        var accuracy_3 = document.getElementById('accuracy_3').value;
        var accuracy_4 = document.getElementById('accuracy_4').value;
        if (!((p.test(join_times) || join_times == '') && (p.test(integral) || integral == '') && (p.test(badges) || badges == '') && (p.test(t_join_times) || t_join_times == '') && (p.test(t_integral) || t_integral == '') && (p.test(accuracy_1) || accuracy_1 == '') && (p.test(accuracy_2) || accuracy_2 == '') && (p.test(accuracy_3) || accuracy_3 == '') && (p.test(accuracy_4) || accuracy_4 == ''))) {
            alert('数据格式有误！');
            return;
        }
        join_times == '' ? bg.join_times = 0 : bg.join_times = Number(join_times);
        integral == '' ? bg.integral = 0 : bg.integral = Number(integral);
        badges == '' ? bg.badges = 0 : bg.badges = Number(badges);
        t_join_times == '' ? bg.t_join_times = 0 : bg.t_join_times = Number(t_join_times);
        t_integral == '' ? bg.t_integral = 0 : bg.t_integral = Number(t_integral);
        accuracy_1 == '' ? bg.accuracy_1 = 0 : bg.accuracy_1 = Number(accuracy_1);
        accuracy_2 == '' ? bg.accuracy_2 = 0 : bg.accuracy_2 = Number(accuracy_2);
        accuracy_3 == '' ? bg.accuracy_3 = 0 : bg.accuracy_3 = Number(accuracy_3);
        accuracy_4 == '' ? bg.accuracy_4 = 0 : bg.accuracy_4 = Number(accuracy_4);
        t_title == '' ? bg.t_title = null : bg.t_title = t_title;
        chrome.windows.create({
            url: 'https://ssxx.univs.cn/client/detail/5f71e934bcdbf3a8c3ba5061/score#in_extension',
            width: 516,
            height: 1048,
            type: 'popup'
        }, function (window) {
            bg.onWindowCreate(window.tabs[0].id);
        });
    });
    document.getElementById('login').addEventListener('click', function () {
        chrome.tabs.create({
            url: 'https://ssxx.univs.cn/client/detail/5f71e934bcdbf3a8c3ba5061/score'
        });
    });
});