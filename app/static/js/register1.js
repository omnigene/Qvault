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
        'mobile':/^[1][3-9][0-9]{9}$/,
        'code':/^$/,
        'email':/^[a-zA-Z\d\\._-]+@[a-zA-Z\d._-]+\.[a-zA-Z]+$/,
        'username':/^(?![._-])[\w\u4E00-\u9FA5._-]{1,15}[a-zA-Z\d\u4E00-\u9FA5]{1}$/,
        'password':/^[\w]{6,18}$/
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
        else if (!(patterns[el[0].id].test(el.val()))){
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
    // 输入框响应功能
    var checkInput=function (){
        if (this.id==='username' && checkPatterns(username) && checkRegister(username)){
            addPassedInfo(username);
        } else if (this.id==='password' || this.id==='password1'){
            checkPassword();
        } else if (this.id==='mobile'){
            switchSend(mobile);
            // 防止验证码通过后修改手机号码
            if ( mobile.hasClass('check-icon') && code.hasClass('check-icon') && mobile.val()!==mobile_num){
                addFailedInfo(code,1);
            } else if (mobile.val()===mobile_num && checkPatterns(code)){
                addPassedInfo(code);
            }
        } else if (this.id==='email'){
            switchSend(email);
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
    // 发送验证码功能
    var [send,alert]=[$("#send"),$("#alert")];
    var mobile_num;
    send.click(function () {
        if (checkRegister(mobile)) {
            var captcha1 = new TencentCaptcha('2037396490', function (res) {
                if (res.ret === 0) {
                    code.focus();
                    var count = 60;
                    var interval = setInterval(function f() {
                        send.attr("disabled", true);
                        send.text("重发(" + count + "s)");
                        if (count === 0) {
                            clearInterval(interval);
                            send.text("发送").removeAttr("disabled");
                        }
                        count--;
                        return f
                    }(), 1000);
                    var mobile_data = JSON.stringify({"mobile": mobile.val()});
                    $.ajax({
                        url: "/sms",
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        data: mobile_data,
                        async:false,
                        success: function (verify_data) {
                            alert.children().html('<i class="fas fa-sms"></i>'+verify_data['msg']);
                            alert.slideDown("slow");
                            setTimeout(function () {
                                alert.slideUp("slow");
                            },5000);
                            patterns['code'] = RegExp('^' + verify_data['code'] + '$');
                            console.log(patterns['code']);
                            mobile_num = verify_data['mobile'];
                        }
                    });
                }
            });
            captcha1.show();
        }
    });
    // 分步注册功能
    var activePanel=$('.tab-pane.active');
    var [next,pre,submit]=[$('#next'),$('#pre'),$('#submit')];
    next.click(function () {
        activePanel.find("input").focus().blur();
        if (activePanel.find('p').hasClass("errors-icon")){
            return false;
        }
        else {
            pre.css('display','inline-block');
            send.css('display','block');
            submit.css('display','block');
            $(this).css('display','none');
        }
    });
    pre.click(function () {
        $("#pre,#send").css('display','none');
        next.css('display','block')
    });
    submit.click(function () {
        $("input").focus();
        checkRegister(mobile);
        checkRegister(email);
        activePanel.siblings().children(":first").children("input").val('').blur().focus();
        if ($("p").hasClass("errors-icon")){
            return false;
        }
    });
    // 手机或邮箱注册切换功能
    function switchEvent(el) {
        if (el.hasClass("check-icon")){
            $("#code,#send").removeAttr("disabled");
        } else {
            $("#code,#send").attr("disabled","true");
        }
    }
    $("input[type='checkbox'].switch").change(function () {
        if ($("input[type='checkbox'].switch").is(":checked")===false){
            $(".mobile-tag").css("color","#0052e6");
            $(".email-tag").css("color","lightgray");
            $(".input-wrap.email").css('display','none');
            $(".input-wrap.mobile").css('display','');
            switchSend(mobile);
        }
        else{
            $(".mobile-tag").css("color","lightgray");
            $(".email-tag").css("color","black");
            $(".input-wrap.mobile").css('display','none');
            $(".input-wrap.email").css('display','block');
            switchSend(email);
        }
    });
});