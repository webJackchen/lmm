$(function () {
    var panelId = "_panelId_";
    var $el = $("#" + panelId);
    var dialog = $("<div id=dialog-"+panelId+"></div>").append($el.find("div.job-apply-content"));
    $el.find("a.job-apply").on("click", function () {
        dialog.dialog({
            title: "设置",
            resizable: false,
            width: "auto",
            modal: true,
            maxHeight: 680,
            open: function () {
                $("#dialog-" + panelId).find("button.btn-resume").off("click.dialog").on("click.dialog", function () {
                    dialog.dialog("close");
                });
            }
        });
    });
});