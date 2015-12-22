$(function () {
    //var panelId = "_panelId_",
    //    createContentList = function () {
    //        var $el = $("#" + panelId),
    //                ctrlObj = $el.children(".contentList"),
    //                colHeight = $el.height();
    //        if (!ctrlObj.find("div.content-page").is(":hidden")) {
    //            var pageHeight = ctrlObj.find("div.content-page").height();
    //            colHeight = colHeight - pageHeight - 10;
    //        }
    //        if (ctrlObj.find("h4.product-list-maibnTitle").text() != "") {
    //            var h4Height = ctrlObj.find("h4.product-list-maibnTitle").outerHeight();
    //            colHeight = colHeight - h4Height;
    //        }
    //        colHeight = parseInt(colHeight / ctrlObj.data("row")) - 10 * ctrlObj.data("row");
    //        ctrlObj.find("li.product-images").height(colHeight);

           
    //    };
    //setTimeout(createContentList, 1000);

    var panelId = "_panelId_",
       $el = $("#" + panelId),
       ctrlObj = $el.children(".contentList"),
       page = ctrlObj.data("page");
    ctrlObj.find("ul.news li").eq(ctrlObj.find("ul.news li").length - 1).css("border-bottom", "1px solid #ddd");


    var _pathname = location.pathname;
    var _search = window.location.search;
    $el.find("ul.content-list li").each(function () {
        var _href = $(this).children("a").attr("href");
        _href = _href + _search;
        $(this).children("a").attr("href", _href);
    });

});
