$(window).scroll(function() {
    var scroll = $(window).scrollTop();


    if (scroll >= 275 && $(window).width() > 767 ) {
        $(".topbar").addClass("scrolling");
        $("img.logo").attr("src", "images/logoy.png");

    } else {
        $(".topbar").removeClass("scrolling");
        $("img.logo").attr("src", "images/logow.png");
    }
});