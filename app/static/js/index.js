$(function () {
    var mainFrame=$("#mainframe");
    $('#login-btn').click(function () {
        mainFrame.attr("src","/login");
        // mainFrame加载完毕后执行
        mainFrame.on('load',function () {
            var frameBody=mainFrame.contents().find("body")[0];
            var ro = new ResizeObserver( entries => {
                var resizeHeight=entries[0].contentRect.height+72;
                $(this).css("height",resizeHeight);
            });
            ro.observe(frameBody);
        })
    });
});