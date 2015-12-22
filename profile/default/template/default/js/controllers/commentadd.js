/*--------验证码显示  start--------*/
$("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());

function verifyCode() {
    $(".modal-dialog #imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
}
/*--------验证码显示  end--------*/

function doSubmitComment(goodsLink,orderLink) {
    var _content = $(".modal-dialog #commentContent").val(),
    _verify = $(".modal-dialog #txtVerifyCode").val();
    if (_content == "") {
        $(".modal-dialog #contentVerify").show();
        return;
    }

    var url = "/action/ItemReplyEdit?m=goods";

    var data = "<form><reply><![CDATA[" + goodsLink + "]]></reply>" +
        "<content><![CDATA[" + _content + "]]></content>" +
        "<verify><![CDATA[" + _verify + "]]></verify></form>";

    $.ajax({
        url: url,
        type: "POST",
        data: data,
        processData: false,
        async: false,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: function () {
            $(".modal-dialog .btn-primary").addClass("disabled");
        },
        success: function (data) {
            var state = $(data).find("item").find("return").text();
            var msg = $(data).find("item").find("message").text();
            if (state == "success") {
                //$("#textVerify").text("评价成功");
                //$("#textVerify").show();
                //setTimeout(function () {
                //    window.location.reload();
                //}, 1000);

                //修改订单状态
                actionOrder(orderLink, "5");
            } else if (state == "fail") {
                $(".modal-dialog #codeVerify").text(msg);
                $(".modal-dialog #codeVerify").show();
            }
            else {
                $(".modal-dialog #codeVerify").text(msg);
                $(".modal-dialog #codeVerify").show();
            }
            $(".modal-dialog .btn-primary").removeClass("disabled");
        },
        error: function (data) {
            //Kplus.alert("服务器繁忙，请稍后重试！");
            $(".modal-dialog #codeVerify").text("服务器繁忙，请稍后重试！");
            $(".modal-dialog #codeVerify").show();
            $(".modal-dialog .btn-primary").removeClass("disabled");
            return false;
        }
    });
};


function promptHide(prompt) {
    $(".modal-dialog #" + prompt).hide();
}

function words_deal() {
    var curLength = $(".modal-dialog #commentContent").val().length, count = 0;
    if (curLength > 150) {
        var content = $(".modal-dialog #commentContent").val().substr(0, 150);
        $(".modal-dialog  #commentContent").val(content);
    }
    else {
        count = 150 - $(".modal-dialog #commentContent").val().length;
        $(".modal-dialog  #wordVerify").text("(" + count + "/150)");
    }
}
