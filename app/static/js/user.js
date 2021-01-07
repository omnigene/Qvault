$(function () {
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