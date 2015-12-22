$(function () {
    var panelId = "_panelId_",
        $el = $("#" + panelId),
        ctrlObj = $el.children("video");
    
    ctrlObj.attr("src", ctrlObj.data("url"));
    ctrlObj.attr('autoplay', ctrlObj.data("autoplay"));
    ctrlObj.attr('poster', ctrlObj.data("poster") || '../../images/no_image_220x220.jpg');
});