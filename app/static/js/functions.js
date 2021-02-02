function flashMessage(el,icon,msg) {
    el.children().html(icon+msg);
    el.slideDown("slow");
    setTimeout(function () {
        el.slideUp("slow");
    },3000);
}