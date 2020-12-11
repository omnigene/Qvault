$(function () {
    var [alert,account,pwd,submit]=[$('#alert'),$('#account'),$('#input_password'),$('#submit')]
    var icon_str='<i class="fas fa-check"></i>';
    if (msg[0]!==undefined) {
        alert.children().html(icon_str+msg[0]);
        alert.slideDown("slow");
        setTimeout(function () {
            alert.slideUp("slow");
        },3000);
    }
    errors={
        'account':'请输入用户名、手机号或邮箱地址！',
        'input_password':'请输入密码！'
    };
    $('#account,#input_password').on({
        focus:  function () {
            $(this).siblings().last().removeClass("errors-icon").empty();
            $(this).css({"border-color":"#0052e6","box-shadow":"0 0 15px rgba(0,91,255,0.3)"});
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
    submit.click(function () {
        $("input").focus();
        if ($("p").hasClass("errors-icon")){
            return false;
        }
    });
});