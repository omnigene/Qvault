$(function () {
    $('#login-btn').click(function () {
        $('#base-iframe').attr("src","/login");
    });
    // $('#authModal').on('hidden.bs.modal', function () {
    //     $('#base-iframe').contentWindow.location.reload();
    //     // $('#base-iframe').attr("src","");
    // });
});