$("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());

function verifyCode() {
    $(".modal-dialog #imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
}

/*--------验证并保存数据  start--------*/
$(".modal-dialog #messageDataForm").validate({
    rules: {
        messageContent: {
            required: true
        },
        person: {
            required: true
        },
        telephone: {
            required: true,
            mobile: true
        },
        txtVerifyCode: "required"
    },
    messages: {
        messageContent: {
            required: '请输入留言内容'
        },
        person: {
            required: '请输入姓名'
        },
        telephone: {
            required: '请输入手机号码',
            mobile: '请输入正确的手机号码'
        },
        txtVerifyCode: "验证码不能为空"
    },
    submitHandler: function () {
        doSubmitMessage();
    }
});
/*--------验证并保存数据  end--------*/

/*--------保存数据  start--------*/
function doSubmitMessage() {
    var _person = $(".modal-dialog #person").val(),
        _content = $(".modal-dialog #messageContent").val(),
        _telephone = $(".modal-dialog #telephone").val(),
        _verify = $(".modal-dialog #txtVerifyCode").val();

    if (_content == "") { $(".modal-dialog #contentVerify").show(); }
    if (_person == "") { $(".modal-dialog #personVerify").show(); }
    if (_telephone == "") { $(".modal-dialog #telephoneVerify").show(); $(".modal-dialog #telephoneVerify").html("手机不能为空"); }
    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(_telephone)) {
        $(".modal-dialog #telephoneVerify").show();
        $(".modal-dialog #telephoneVerify").html("请填写正确手机号");
        return;
    }

    var data = "<form><title><![CDATA[我的留言]]></title><person><![CDATA[" + _person +
           "]]></person><content><![CDATA[" + _content +
           "]]></content><telephone><![CDATA[" + _telephone +
           "]]></telephone><category><![CDATA[1192204630]]></category>" +
           "<verify><![CDATA[" + _verify + "]]></verify></form>";

    $.ajax({
        url: "/action/iteminsertedit?m=message",
        type: "POST",
        data: data,
        processData: false,
        async: false,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: function () {
            $(".btn-primary").addClass("disabled");
        },
        success: function (data) {
            var state = $(data).find("item").find("return").text();
            var msg = $(data).find("item").find("message").text();
            if (state == "success") {
                $(".btn-primary").removeClass("disabled");
                $(".dialog").modal('hide');
                $("#messageChoose").click();
            } else if (state == "fail") {
                $(".modal-dialog #codeVerify").show();
                $(".modal-dialog #codeVerify").html(msg);
                $(".btn-primary").removeClass("disabled");
                return;
            }
        },
        error: function (data) {
            Kplus.alert("服务器繁忙，请稍后重试！");
            $(".btn-primary").removeClass("disabled");
            return false;
        }
    });
};
/*--------保存数据  start--------*/

function promptHide(prompt) {
    $(".modal-dialog #" + prompt).hide();
}