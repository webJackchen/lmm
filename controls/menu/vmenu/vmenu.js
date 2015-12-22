$(function () {
    $("ul.menu-nav>li").mouseenter(function () {
        if ($(this).find("ul").length > 0) {
            $(this).children("ul").show();
            $(this).addClass("active").siblings().removeClass("active");
        }
    });
    $("ul.menu-nav>li").mouseleave(function () {
        $("ul.menu-nav li ul").hide();
        $("ul.menu-nav li").removeClass("active");
    });

    var panelId = "_panelId_";
    var $el = $("#" + panelId);
    var _pathname = location.pathname;
    var _search = window.location.search;
    $el.find("ul.menu-nav li").each(function () {
        var _href = $(this).children("a").attr("href");
        if (_href === _pathname) {
            if ($(this).parent().hasClass("children-menu")) {
                $(this).parent().parent().addClass("links");
            } else {
                $(this).addClass("links");
            }
        }
        
        console.log(_href.indexOf("?"))
        _href = _href + _search;
        $(this).children("a").attr("href", _href);
    });
});