// 阻止按回车键提交表单
$(document).keydown(function (event) {
    if (event.which === 13) {
        return false;
    }
});

$(document).ready(function () {
    var [username,pwd,pwd1]=[$('#username'),$('#password'),$('#password1')];
    var [mobile,email,code]=[$('#mobile'),$('#email'),$('#code')];
    // 错误提示与格式规范字典
    var errors={
        'mobile':['您还未填写手机号码。','请输入11位有效手机号码，不支持虚拟运营商号段。','该手机号已注册！'],
        'code':['请输入6位注册验证码。','验证码错误！'],
        'email':['您还未填写邮箱地址。','请检查邮箱地址是否填写正确。','该邮箱已注册！'],
        'username':['您还未填写用户名。','用户名长度2-16位，仅支持点、下划线及短连接线，但不能作为开头和结尾。','该用户名已注册！'],
        'password':['您还未设置密码。','密码长度6-18位，支持数字、字母（区分大小写）及下划线的组合。'],
        'password1':['您还未确认密码。','两次密码输入不一致。']
    };
    var patterns={
        'mobile':'^[1][3-9][0-9]{9}$',
        'code':'^$',
        'email':'^[a-zA-Z\\d\\._-]+@[a-zA-Z\\d._-]+\\.[a-zA-Z]+$',
        'username':'^(?![._-])[\\w\\u4E00-\\u9FA5._-]{1,15}[a-zA-Z\\d\\u4E00-\\u9FA5]{1}$',
        'password':'^[\\w]{6,18}$'
    };
    // 添加检查通过样式
    function addPassedInfo(el) {
        el.siblings().last().removeClass("errors-icon").empty();
        el.addClass("check-icon");
        el.css({"border-color":"green","box-shadow":"0 0 15px rgba(0,128,0,0.3)"});
    }
    // 添加检查未通过样式
    function addFailedInfo(el,n) {
        el.removeClass("check-icon");
        el.siblings().last().attr("class","errors").addClass("errors-icon").html(errors[el.attr('id')][parseInt(n)]);
        el.css({"border-color":"red","box-shadow":"0 0 15px rgba(255,0,0,0.3)"});
    }
    // 启用与禁用验证码输入框及发送按钮
    function switchSend(el){
        if (checkPatterns(el) && checkRegister(el)){
            addPassedInfo(el);
            $('#send, #code').removeAttr('disabled');
        } else {
            code.removeAttr("style").val("").removeClass("check-icon").siblings().last().removeClass("errors-icon").empty();
            $("#code,#send").attr("disabled", "true");
        }
    }
    // 格式输入检查是否合法
    function checkPatterns(el) {
        if (el.val()===''){
            addFailedInfo(el,0);
            return false;
        }
        else if (!(RegExp(patterns[el[0].id]).test(el.val()))){
            addFailedInfo(el,1);
            return false;
        }
        else {return true;}
    }
    // 密码一致性检查`
    function checkPassword() {
        if (checkPatterns(pwd)){
            addPassedInfo(pwd);
            if (pwd1.val()!==''&&pwd1.val()!==pwd.val()){
                addFailedInfo(pwd1,1);
            }
        }else{
            if (pwd1.val()!=='' && pwd1.val()!==pwd.val()){
                addFailedInfo(pwd1,1);
            }
        }
        if (pwd1.val()==='' && pwd1.is(':focus')){
            addFailedInfo(pwd1,0);
        }
        if (pwd.val()!==''&&pwd1.val()===pwd.val()){
            addPassedInfo(pwd1);
        }
    }
    // 检查输入值在数据库中是否已存在
    function checkRegister(el){
        var data= JSON.stringify({[el.attr('id')]: el.val()});
        var verify_tof=false;
        $.ajax({
            url: "/check",
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: data,
            async: false,
            success: tof=> {
                if (tof==='false'){
                    addFailedInfo(el,2);
                }
                else {verify_tof=true}
            }
        });
        return verify_tof;
    }
    // 验证码与手机号或邮箱地址一致性检查
    function checkCode(el){
        if ( el.hasClass('check-icon') && code.hasClass('check-icon') && el.val()!==check_str){
            addFailedInfo(code,1);
        } else if (el.val()===check_str && checkPatterns(code)){
            addPassedInfo(code);
        }
    }
    // 输入框检查功能
    var checkInput=function (){
        if (this.id==='username' && checkPatterns(username) && checkRegister(username)){
            addPassedInfo(username);
        } else if (this.id==='password' || this.id==='password1'){
            checkPassword();
        } else if (this.id==='mobile'){
            switchSend(mobile);
            checkCode(mobile);
        } else if (this.id==='email'){
            switchSend(email);
            checkCode(email);
        } else if (this.id==='code' && checkPatterns(code)){
            addPassedInfo(code);
        }
    };
    // 绑定输入框事件
    $("#username,#password,#password1,#email,#mobile,#code").on({
        focus: function () {
            if ($(this).val()==='') {
                $(this).siblings().last().removeClass("errors-icon").empty();
                $(this).css({"border-color":"#0052e6","box-shadow":"0 0 15px rgba(0,91,255,0.3)"});
            }
        },
        blur: checkInput,
        input: checkInput
    });
    // 分步注册切换
    var activePanel=$('.tab-pane.active');
    var [next,pre,submit]=[$('#next'),$('#pre'),$('#submit')];
    next.click(function () {
        activePanel.find("input").focus().blur();
        if (activePanel.find('p').hasClass("errors-icon")){
            return false;
        }
        else {
            $("#pre,#send,#submit").css('display','block');
            $(this).css('display','none');
        }
    });
    pre.click(function () {
        $("#pre,#send,#submit").css('display','none');
        next.css('display','block')
    });
    // 发送验证码功能
    var [send,alert]=[$("#send"),$("#alert")];
    var check_str;
    function sendCode(el){
        countdown(60);
        var el_data=JSON.stringify({[el.attr('id')]: el.val(),'code':patterns['code']});
        var url=(el[0].id==='mobile')?"/sms":"/email";
        var icon_str=(el[0].id==='mobile')?'<i class="bi bi-chat-dots"></i>':'<i class="bi bi-envelope"></i>';
        $.ajax({
            url: url,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            data: el_data,
            async:false,
            success: function (verify_data) {
                alert.children().html(icon_str+verify_data['msg']);
                alert.slideDown("slow");
                setTimeout(function () {
                    alert.slideUp("slow");
                },3000);  // 弹出验证发已发送的信息提示
                check_str= verify_data['mobile'] || verify_data['email'];
                patterns['code']=verify_data['code'];
                setTimeout(function () {
                    patterns['code']='^$';
                    code.blur().focus();
                },600*1000);  // 设置验证码十分钟后失效
            }
        });
    }
    // 倒计时功能
    function countdown(sec) {
        var interval=setInterval(function f() {
            send.attr("disabled", true);
            send.text(sec + " 秒");
            if (sec === 0) {
                clearInterval(interval);
                send.text("重 发").removeAttr("disabled");
            }
            sec--;
            return f
        }(), 1000);
    }
    // 图形滑块验证功能
    function slideCaptcha(el){
        var captcha1 = new TencentCaptcha('2037396490', function (res) {
            if (res.ret === 0) {
                code.focus();
                countdown(60);
                sendCode(el);
            }
        });
        captcha1.show();
    }
    // 发送按钮点击事件
    send.click(function () {
        if ($(".input-wrap.mobile").css('display')==='block') {
            slideCaptcha(mobile);}
        else{
            sendCode(email);}
    });
    // 切换验证方式
    function switchEvent(display,hidden,color){
        $(".tag."+display[0].id).css("color",color);
        $(".input-wrap."+display[0].id).css("display","block");
        $(".tag."+hidden[0].id).css("color","lightgray");
        $(".input-wrap."+hidden[0].id).css("display","none");
        switchSend(display);
    }
    $("input[type='checkbox'].switch").change(function () {
        if ($("input[type='checkbox'].switch").is(":checked")===false){
            switchEvent(mobile,email,"#0052e6");
        }
        else{
            switchEvent(email,mobile,"black");
        }
    });
    submit.click(function () {
        $("input").focus();
        activePanel.siblings().children(":first").children("input").val('').blur().focus();
        if ($("p").hasClass("errors-icon")){
            return false;
        }
    });
});