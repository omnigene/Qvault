$(function () {
    var errors={
        'account':'请输入用户名、手机号或邮箱地址！',
        'input_password':'请输入密码！'
    };
    $('#account,#input_password').on({
        focus:  function () {
            $(this).siblings().last().removeClass("errors-icon").empty();
            $(this).css({"border-color":"#004aed","box-shadow":"0 0 15px rgba(0,91,255,0.3)"});
        },
        blur: function () {
            if ($(this).val()===''){
                $(this).siblings().last().attr("class","errors").addClass("errors-icon").html(errors[$(this).attr('id')]);
                $(this).css({"border-color":"red","box-shadow":"0 0 15px rgba(255,0,0,0.3)"});
            } else {
                $(this).siblings().last().removeClass("errors-icon").empty();
                $(this).removeAttr('style');
            }
        }
    })
    var [acct,pwd,alt,submit]=[$('#account'),$('#input_password'),$('#alert'),$('#submit')];
    var times_icon='<i class="bi bi-exclamation-diamond"></i>';
    var check_icon='<i class="bi bi-check-circle-fill"></i>';
    if (msg[0]!==undefined) {
        showMessage(check_icon,msg[0])
    }
    function showMessage(icon,msg) {
        alt.children().html(icon+msg);
        alt.slideDown("slow");
        setTimeout(function () {
            alt.slideUp("slow");
        },3000);
    }
    function loginCheck(acct,pwd) {
        var tof=true;
        $.ajax({
            url: "/login-check",
            type: "POST",
            async: false,
            data: JSON.stringify({[acct.attr('id')]: acct.val(),[pwd.attr('id')]:pwd.val()}),
            success: function (data) {
                if (data==='false'){
                    tof=false;
                    alt.css("background-color","black");
                    showMessage(times_icon,"账号或密码错误！")
                }
            }
        });
        return tof
    }
    submit.click(function () {
        $("input").focus();
        if ($("p").hasClass("errors-icon") || !loginCheck(acct,pwd)){
            return false;
        }
    });
});