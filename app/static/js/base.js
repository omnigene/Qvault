$(function () {
    var loginFrame=$(".login-frame");
    function showLoginModal(){
        loginFrame.attr("src","/login");
        // mainFrame加载完毕后执行
        loginFrame.on('load',function () {
            var frameBody=loginFrame.contents().find("body")[0];
            var ro = new ResizeObserver( entries => {
                var resizeHeight=entries[0].contentRect.height+72;
                $(this).css("height",resizeHeight);
            });
            ro.observe(frameBody);
        })
    }
    $('#login-btn').click(function () {
        showLoginModal();
    });
    $('#switch-account').click(function () {
        $('#authModal').modal('show');
        showLoginModal();
    })
    // 实现头像按钮旋转效果
    var [avatarButton, avatarMenu]=[$('#nav-avatar'),$('.dropdown-content')];
    var clicked=false;
    function slideOut(el){
        el.css("animation","clockwiseRotate 0.3s linear");
        avatarMenu.css({"opacity":"1","margin-left":"-100px","animation":"rightOut 0.3s ease forwards"});
        clicked=false;
    }
    avatarButton.click(function (e) {
        let avatar=$('#nav-avatar').children('.block');
        e.stopPropagation();
        if (!clicked) {
            avatar.css("animation","anti-clockwiseRotate 0.3s linear");
            avatarMenu.css({"user-select":"none","margin-left":"120px","animation":"leftIn 0.3s ease forwards"});
            $('img').css("user-select","none");
            clicked = true;
        } else{
            slideOut(avatar)
            clicked=false;
        }
    })
    $(document).on('click',':not(avatarMenu)',function () {
        let avatar=$('#nav-avatar').children('.block');
        if (clicked){slideOut(avatar)}
    })
    avatarMenu.click(function (e) {
        e.stopPropagation();
    })
    $('.menu-item.user-page').click(function () {
        window.open("/user","_self");
    })
});