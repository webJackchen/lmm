$(function () {
    var panelId = "_panelId_";
    var $el = $("#" + panelId);

    $el.find("#downloadFile").on("click", function () {
        var url = $(this).attr("data-url");
        if (url != "" && url != null) {
            location.href = url;
        } else {
            alert("文件不存在！");
        }
    });
});