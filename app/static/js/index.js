$(function () {
    var mainframe=$("#mainframe");
    $('#login-btn').click(function () {
        mainframe.attr("src","/login");
        var i=document.getElementById("mainframe");
        i.onload=function(){
            console.log(i.contentDocument);
            console.log(i.contentDocument.getElementById("wrapform").scrollHeight);
        };
    });
});