$(function () {
    var check_icon='<i class="bi bi-check-circle-fill"></i>';
    var alt=$('#alert');
    if (msg[0]!==undefined){flashMessage(alt,check_icon,msg[0]);}
    var profileFrame=$(".profile-frame");
    profileFrame.on('load',function () {
        var frameBody=profileFrame.contents().find("body")[0];
        var ro = new ResizeObserver( entries => {
            var resizeHeight=entries[0].contentRect.height+45;
            $(this).css("height",resizeHeight);
        });
        ro.observe(frameBody);
    })
})