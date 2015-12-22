$(function () {
    var panelId = "_panelId_",
        createLinksList = function () {
            var $el = $("#" + panelId),
                    ctrlObj = $el.children(".linksContent"),
                    colHeight = $el.height();
            colHeight = parseInt(colHeight / ctrlObj.data("row"));
            ctrlObj.find("li").css("height", colHeight + "px");
            ctrlObj.find("li a").css("line-height", ctrlObj.find("li a").height() + "px");
        };
    setTimeout(createLinksList, 100);
});