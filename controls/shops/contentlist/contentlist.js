$(function () {
    var panelId = "_panelId_",
       $el = $("#" + panelId),
       ctrlObj = $el.children(".contentList"),
       page = ctrlObj.data("page");
    ctrlObj.find("ul.news li").eq(ctrlObj.find("ul.news li").length - 1).css("border-bottom", "1px solid #ddd");

    ctrlObj.find("ul.img-perview li img").click(function (event) {
        event.stopPropagation();
        event.preventDefault(); 
        $(this).parent().addClass("active").siblings().removeClass("active");
        $(this).closest("ul.img-perview").siblings("img.preview").attr("src", $(this).attr("src"));
    });

    var _pathname = location.pathname;
    var _search = window.location.search;
    $el.find("ul.content-list li").each(function () {
        var _href = $(this).children("a").attr("href");
        _href = _href + _search;
        $(this).children("a").attr("href", _href);
    });

    if (ctrlObj.find("#vipprice").val() === "1") {
        ctrlObj.find("div.VIP-price").show();
        ctrlObj.find("span.title").css("margin-bottom","0")
    } else {
        ctrlObj.find("div.VIP-price").hide();
        ctrlObj.find("span.title").css("margin-bottom","27px")
    }
});
