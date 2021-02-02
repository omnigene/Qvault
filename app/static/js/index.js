$(function () {
    var alt=$('#alert');
    var login_icon='<i class="bi bi-box-arrow-in-right"></i>';
    var logout_icon='<i class="bi bi-box-arrow-left"></i>';
    if (msg[0]!==undefined){
        msg[0].includes('退出')?icon=logout_icon:icon=login_icon;
        flashMessage(alt,icon,msg[0]);
    }
});