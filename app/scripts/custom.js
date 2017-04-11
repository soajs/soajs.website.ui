$(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 275) {
        $(".topbar").addClass("scrolling");
        $("img.logo").attr("src", "images/logoo.png");

    } else {
        $(".topbar").removeClass("scrolling");
        $("img.logo").attr("src", "images/logow.png");
    }
});