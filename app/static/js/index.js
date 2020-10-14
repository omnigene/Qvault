$(function () {
    $('#login-btn').click(function () {
        var mainFrame=$("#mainframe");
        mainFrame.attr("src","/login");
        // mainFrame加载完毕后执行
        mainFrame.on('load',function () {
            var toRegister=mainFrame.contents().find("#to-register");
            toRegister.click(function () {
                mainFrame.css("height","550px");
            });
            var frameBody=mainFrame.contents().find("body")[0];
            var ro = new ResizeObserver( entries => {
                resizeHeight=entries[0].contentRect.height+72;
                $(this).css("height",resizeHeight);
            });
            ro.observe(frameBody);
        })
    });
});