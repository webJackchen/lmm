$(function () {
    var panelId = "_panelId_",
        createGrid = function () {
            var $el = $("#" + panelId),
                    ctrlObj = $el.children(".grid-container"),
                    colHeight = $el.height() / ctrlObj.data("row");
            ctrlObj.find("div.grid-image-item").height(colHeight);
        };
    setTimeout(createGrid, 100);    
});
