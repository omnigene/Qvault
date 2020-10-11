$(function () {
    $('#login-btn').click(function () {
        var mainFrame=$("#mainframe");
        mainFrame.attr("src","/login");
        // mainFrame加载完毕后执行
        mainFrame.on('load',function () {
            var toRegister=mainFrame.contents().find("#to-register");
            toRegister.click(function () {
                mainFrame.attr("height","480px");
            });
            var frameBody=mainFrame.contents().find("body")[0];
            var ro = new ResizeObserver( entries => {
                resizeHeight=entries[0].contentRect.height+66;
                $(this).attr("height",resizeHeight);
            });
            ro.observe(frameBody);
        })

        // mainFrame[0].onload=function () {
        //     var toRegister=mainFrame[0].contentDocument.getElementById("to-register");
        //     console.log(toRegister);
        //     var i=$("#to-register")[0];
        //     console.log(i);
        //     // var frameBody=mainFrame[0].contentDocument.body;
        //     // var ro = new ResizeObserver( entries => {
        //     //     resizeHeight=entries[0].contentRect.height+65;
        //     //     $(this).attr("height",resizeHeight);
        //     // });
        //     // ro.observe(frameBody);
        // };
    });
});