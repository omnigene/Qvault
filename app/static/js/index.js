$(function () {
    $('#login-btn').click(function () {
        var mainframe=$("#mainframe");
        mainframe.attr("src","/login");
        mainframe[0].onload=function () {
            var framebody=mainframe[0].contentDocument.body;
            var ro = new ResizeObserver( entries => {
                reheight=entries[0].contentRect.height+65;
                $(this).attr("height",reheight);
            });
            ro.observe(framebody);
        };
    });
});