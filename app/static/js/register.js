$(document).ready(function () {
    // 错误提示字典
    var errors={
        'mobile':['您还未填写手机号码。','请输入11位有效手机号码，不支持虚拟运营商号段。','该手机号已注册！'],
        'code':['请输入6位注册验证码。','验证码错误！'],
        'email':['您还未填写邮箱地址。','请检查邮箱地址是否填写正确。','该邮箱已注册！'],
        'username':['您还未填写用户名。','用户名长度2-16位，仅支持点、下划线及短连接线，但不能作为开头和结尾。','该用户名已注册！'],
        'password':['您还未设置密码。','密码长度6-18位，支持数字、字母（区分大小写）及下划线的组合。'],
        'password1':['您还未确认密码。','两次密码输入不一致。']
    };
    // 格式验证规则字典
    var patterns={
        'mobile':/^[1][3-9][0-9]{9}$/,
        'code':/^$/,
        'email':/^[a-zA-Z\d\\._-]+@[a-zA-Z\d._-]+\.[a-zA-Z]+$/,
        'username':/^(?![._-])[\w\u4E00-\u9FA5._-]{1,15}[a-zA-Z\d\u4E00-\u9FA5]{1}$/,
        'password':/^[\w]{6,18}$/,
    };
    // 设置通过验证的输入框样式
    function addPassedInfo(el) {
        el.siblings().last().removeClass("errors-icon").empty();
        el.addClass("check-icon");
        el.css({"border-color":"green","box-shadow":"0 0 15px rgba(0,128,0,0.3)"});
    }
    // 设置未通过验证的输入框样式
    function addFailedInfo(el,n) {
        el.removeClass("check-icon");
        el.siblings().last().attr("class","errors").addClass("errors-icon").html(errors[el.attr('id')][parseInt(n)]);
        el.css({"border-color":"red","box-shadow":"0 0 15px rgba(255,0,0,0.3)"});
    }
    // 检查是否已注册（将数据传递到后台，并通过通过路由'/check'调用视图函数'check()'检查数据库）
    function checkRegistered(el){
        // 检查手机号是否已注册
        if (el.hasClass("check-icon")) {
            var data= JSON.stringify({[el.attr('id')]: el.val()});
            var register_tof;
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
                    else { register_tof=true }
                }
            });
            return register_tof;
        }
    }
    var [email,mobile,code,username,password,password1]=[$('#email'),$('#mobile'),$('#code'),$('#username'),$('#password'),$('#password1')];
    // 声明mobile_check变量，记录后台返回的接受验证码的手机号，用于验证码与手机号的匹配检查
    var mobile_check;
    // 定义检查输入情况的函数
    var checkInput=function (){
        // 情形一：输入为空
        if ($(this).val()==='') {
            addFailedInfo($(this),0);
            // 当手机号框处于未输入状态时，将验证码框及获取验证码按钮重设为禁用状态
            if (this.id==='mobile'){
                code.removeAttr("style").val("").removeClass("check-icon").siblings().last().removeClass("errors-icon").empty();
                $("#code,#send").attr("disabled","true");
            }
            // 当密码设置框处于验证未通过状态时，清除密码确认框样式及输入值
            if (this.id==='password' && password1.val()!==''){
                password1.val("");
                password1.removeClass("check-icon").removeAttr("style");
            }
        }
        // 情形二：输入未通过规则验证（若为密码确认框，则验证输入值是否与密码设置框一致）
        else if (this.id==='password1'? $(this).val()!==password.val():!(patterns[this.id].test($(this).val()))) {
            addFailedInfo($(this),1);
            // 当手机号框处于未通过规则验证状态时，将验证码框及获取验证码按钮重设为禁用状态
            if(this.id==='mobile'){
                code.removeAttr("style").val("").removeClass("check-icon").siblings().last().removeClass("errors-icon").empty();
                $("#code,#send").attr("disabled","true");
            }
            // 当密码设置框处于未通过规则验证状态且密码确认框不为空时，清除密码确认框样式及输入值
            if (this.id==='password' && password1.val()!==''){
                password1.val("");
                password1.removeClass("check-icon").removeAttr("style");
            }
        }
        // 情形三：输入通过规则验证
        else {
            addPassedInfo($(this));
            // 当手机号框处于通过规则验证状态时，解除验证码框与获取验证码按钮的禁用状态
            if (this.id==='mobile') {
                 $("#code,#send").removeAttr("disabled");
                //当验证码框处于通过验证状态但手机号框中输入值与后台返回值不匹配时，将验证码框设置为未通过验证的样式（防止发送短信后更改手机号）
                if (code.hasClass("check-icon") && $(this).val()!==mobile_check){
                    addFailedInfo(code,1);
                }
                // 当验证码框处于验证通过状态且手机号框中输入值与后台返回值一致时，将验证码框恢复为通过验证的样式（防止验证码状态与样式不一致）
                if (patterns["code"].test(code.val()) && $(this).val()===mobile_check){
                    addPassedInfo(code);
                }
            }
            // 在密码设置框处于通过规则验证且密码确认框不为空的状态下（反向检查密码设置框的值是否与密码确认框的值一致）
            if (this.id==='password' && password1.val()!==''){
                // 如果密码设置框与密码确认框的值不一致，将密码确认框设置为未通过验证的样式
                if ($(this).val()!==password1.val()) {
                    addFailedInfo(password1,1);
                }
                // 如果一致，将密码确认框恢复为通过验证的样式
                else {
                    addPassedInfo(password1);
                }
            }
        }
    };
    // 为各输入框绑定需监测的事件
    $("#email,#mobile,#code,#username,#password,#password1").on({
        focus: function () {
            if ($(this).val()==='') {
                $(this).siblings().last().removeClass("errors-icon").empty();
                $(this).css({"border-color":"#0052e6","box-shadow":"0 0 15px rgba(0,91,255,0.3)"});
            }
        },
        blur: checkInput,
        input: checkInput
    });
    // 进行人机验证及发送短信验证码
    $("#send").click(function () {
        if (checkRegistered(mobile)) {
            // 调用腾讯验证码应用，需在腾讯云中新建验证码应用并生成应用ID（第一个参数）
            var captcha1 = new TencentCaptcha('2037396490', function (res) {
                // 检查是否通过人机验证，若通过则发送短信
                if (res.ret === 0) {
                    code.focus();
                    var count = 60;
                    var send = $("#send");
                    // 发送短信后禁用获取验证码按钮并开始60秒倒计时
                    var interval = setInterval(function f() {
                        send.attr("disabled", true);
                        send.text("重发(" + count + "s)");
                        if (count === 0) {
                            clearInterval(interval);
                            send.text("获取验证码").removeAttr("disabled");
                        }
                        count--;
                        return f
                    }(), 1000);
                    // 将手机号的值传递给后台，并通过路由'/sms'调用视图函数'send_message()'发送短信
                    var mobile_data = JSON.stringify({"mobile": mobile.val()});
                    var alert=$("#alert");
                    $.ajax({
                        url: "/sms",
                        type: "POST",
                        contentType: "application/json;charset=UTF-8",
                        data: mobile_data,
                        async:false,
                        success: function (verify_data) {
                            // 显示成功发送短信的信息提示框
                            alert.children().html('<i class="fas fa-sms"></i>'+verify_data['msg']);
                            alert.slideDown("slow");
                            setTimeout(function () {
                                alert.slideUp("slow");
                            },5000);
                            // 将后台返回的验证码设置为验证码框的验证规则
                            patterns['code'] = RegExp('^' + verify_data['code'] + '$');
                            // 将后台返回的手机号赋值给前端变量，用于手机号与验证码的匹配检查
                            mobile_check = verify_data['mobile'];
                        }
                    });
                }
            });
            captcha1.show();
        }
    });
    // 提交表单前进行验证
    $("#submit").click(function () {
        $("input").focus();
        checkRegistered(mobile);
        checkRegistered(email);
        checkRegistered(username);
        // 清除未激活选项卡中输入框的值（防止因未激活选项卡中存在未通过验证的输入框而无法提交表单）
        $(".tab-pane.active").siblings().children(":first").children("input").val('').blur().focus();
        if ($("p").hasClass("errors-icon")){
            return false;
        }
    });
});