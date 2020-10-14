$(function () {
    $('#login-btn').click(function () {
        var mainFrame=$("#mainframe");
        mainFrame.attr("src","/login");
        // mainFrame加载完毕后执行
        mainFrame.on('load',function () {
            var toRegister=mainFrame.contents().find("#to-register");
            toRegister.click(function () {
                mainFrame.css("height", Math.round(screen.height*0.59));
            });
            var frameBody=mainFrame.contents().find("body")[0];
            var ro = new ResizeObserver( entries => {
                resizeHeight=Math.round(entries[0].contentRect.height+72);
                mainFrame.css("height",resizeHeight);
            });
            ro.observe(frameBody);
        })
    });
});