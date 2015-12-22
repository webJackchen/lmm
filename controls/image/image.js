$(function () {
    setInterval(function () {
        $("#_panelId_ img").css({
            "border-radius": $("#_panelId_").css("border-radius")
        });
    }, 500);
})