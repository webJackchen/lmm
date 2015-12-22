function doSubmitPay(goodsLink, goodsNum, goodsPrice) {
    var url = "/payment/web/alipayescow/" + goodsLink + "?title=" + goodsNum + "&total=" + goodsPrice;
    window.location = url;
}


/*--------修改订单状态  start--------*/
function actionOrder(orderLink, orderStatus) {
    var data = "";
    var url = "/action/sorderlist?order_update=" + orderLink + "&order_type=" + orderStatus + "&isnext=false";
    if (orderStatus == "-1") {
        url = "/action/sorderlist?order_examine=" + orderLink + "&isnext=false";
    }
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        processData: false,
        async: false,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: function () {
            $(".btn-cancel").addClass("disabled");
        },
        success: function (data) {
            var state = $(data).find("item").find("return").text();
            var msg = $(data).find("item").find("message").text();
            if (state == "success") {
                Kplus.prompt("操作成功！", "success");
                $(".dialog").modal('hide');
                $(".order .nav .active").click();
            } else if (state == "fail") {
                Kplus.alert(msg);
            }
            else {
                Kplus.alert(data);
            }
            $(".btn-cancel").removeClass("disabled");
        },
        error: function (data) {
            Kplus.alert("服务器繁忙，请稍后重试！");
            $(".btn-cancel").removeClass("disabled");
            return false;
        }
    });
}
/*--------修改订单状态  end--------*/

