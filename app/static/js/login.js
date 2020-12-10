$(function () {
    var alert=$('#alert');
    var icon_str='<i class="fas fa-check"></i>';
    if (msg[0]!==undefined) {
        alert.children().html(icon_str+msg[0]);
        alert.slideDown("slow");
        setTimeout(function () {
            alert.slideUp("slow");
        },3000);
    }
});