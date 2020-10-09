$(document).ready(function () {
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
        'password':/^[\w]{6,18}$/,
    };
    function addPassedInfo(el) {
        el.siblings().last().removeClass("errors-icon").empty();
        el.addClass("check-icon");
        el.css({"border-color":"green","box-shadow":"0 0 15px rgba(0,128,0,0.3)"});
    }
    function addFailedInfo(el,n) {
        el.removeClass("check-icon");
        el.siblings().last().attr("class","errors").addClass("errors-icon").html(errors[el.attr('id')][parseInt(n)]);
        el.css({"border-color":"red","box-shadow":"0 0 15px rgba(255,0,0,0.3)"});
    }
    function checkRegistered(el){
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
    var mobile_check;
    var checkInput=function (){
        if ($(this).val()==='') {
            addFailedInfo($(this),0);
            if (this.id==='mobile' || this.id==='email'){
                code.removeAttr("style").val("").removeClass("check-icon").siblings().last().removeClass("errors-icon").empty();
                $("#code,#send").attr("disabled","true");
            }
            if (this.id==='password' && password1.val()!==''){
                password1.val("");
                password1.removeClass("check-icon").removeAttr("style");
            }
        }
        else if (this.id==='password1'? $(this).val()!==password.val():!(patterns[this.id].test($(this).val()))) {
            addFailedInfo($(this),1);
            if(this.id==='mobile' || this.id==='email'){
                code.removeAttr("style").val("").removeClass("check-icon").siblings().last().removeClass("errors-icon").empty();
                $("#code,#send").attr("disabled","true");
            }
            if (this.id==='password' && password1.val()!==''){
                password1.val("");
                password1.removeClass("check-icon").removeAttr("style");
            }
        }
        else {
            addPassedInfo($(this));
            if (this.id==='mobile'||this.id==='email') {
                 $("#code,#send").removeAttr("disabled");
                if (code.hasClass("check-icon") && $(this).val()!==mobile_check){
                    addFailedInfo(code,1);
                }
                if (patterns["code"].test(code.val()) && $(this).val()===mobile_check){
                    addPassedInfo(code);
                }
            }
            if (this.id==='password' && password1.val()!==''){
                if ($(this).val()!==password1.val()) {
                    addFailedInfo(password1,1);
                }
                else {
                    addPassedInfo(password1);
                }
            }
        }
    };
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
    $("#send").click(function () {
        if (checkRegistered(mobile)) {
            var captcha1 = new TencentCaptcha('2037396490', function (res) {
                if (res.ret === 0) {
                    code.focus();
                    var count = 60;
                    var send = $("#send");
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
                    var mobile_data = JSON.stringify({"mobile": mobile.val()});
                    var alert=$("#alert");
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
                            mobile_check = verify_data['mobile'];
                            console.log(mobile_check);
                        }
                    });
                }
            });
            captcha1.show();
        }
    });
    var activePanel=($('.tab-pane.active'));
    $("#next").click(function () {
        activePanel.find("input").focus();
        // checkRegistered(username);
        if (activePanel.find('p').hasClass("errors-icon")){
            return false;
        }
        else {
            $("#pre").css('display','inline-block');
            $("#submit").css('display','block');
            $(this).css('display','none');
        }
    });
    $("#pre").click(function () {
        $("#pre,#submit").css('display','none');
        $("#next").css('display','block')
    });
    $("#submit").click(function () {
        $("input").focus();
        checkRegistered(mobile);
        checkRegistered(email);
        // $(".tab-pane.active").siblings().children(":first").children("input").val('').blur().focus();
        if ($("p").hasClass("errors-icon")){
            return false;
        }
    });
    $("input[type='checkbox'].switch").change(function () {
        if ($("input[type='checkbox'].switch").is(":checked")===false){
            $(".mobile-tag").css("color","#0052e6");
            $(".email-tag").css("color","lightgray");
            $(".input-wrap.email").css('display','none');
            $(".input-wrap.mobile").css('display','');
        }
        else{
            $(".mobile-tag").css("color","lightgray");
            $(".email-tag").css("color","black");
            $(".input-wrap.mobile").css('display','none');
            $(".input-wrap.email").css('display','block');
        }
    });

});