$(function () {
    $("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
    /* 表单验证 */
    $("form#dataForm").validate({
        debug: true,
        rules: {
            txtPhone: {
                required: true,
                mobile: true
            },
            txtPhoneCode: {
                required: true,
                number: true
            },
            txtVerifyCode: "required"
        },
        messages: {
            txtPhone: {
                required: "手机号码不能为空",
                mobile: "手机号码输入错误"
            },
            txtPhoneCode: {
                required: "手机效验码不能为空",
                number: "手机效验码输入错误"
            },
            txtVerifyCode: "验证码不能为空"
        }
    });
    $("a.btn-default").click(function () {
        var phone = $("#txtPhone").val(), $this = $(this);
        if (Kplus.isNullOrEmpty(phone)) {
            Kplus.prompt("请输入手机号码！", "warning");
            $("#txtPhone").focus();
            return false;
        }

        $.ajax({
            url: "/action/sendemail",
            type: "POST",
            data: "<form><sendtype>getverifyphone</sendtype><phone><![CDATA[" + phone + "]]></phone></form>",
            beforeSend: function () {
                Kplus.config.isLoading = true;
                $("#shade").addClass("loading");
                $(".btn-default").addClass("disabled");
            },
            success: function (_data) {
                $this.html("重新获取效验码");
            },
            error: function () {
                return false;
            },
            complete: function () {
                $("#shade").removeClass("loading");
                Kplus.config.isLoading = false;
                $(".btn-default").removeClass("disabled");
            }
        });
    });
    $("a.aVerifyCode").click(function () {
        $("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
    });
    $("button.btn-primary").click(function () {
        /* 提交验证 */
        if ($("#dataForm").valid()) {
            var phone = $("#txtPhone").val(), code = $("#txtPhoneCode").val(), verify = $("#txtVerifyCode").val();

            $.ajax({
                url: "/action/sendemail",
                type: "POST",
                data: "<form><sendtype>verifyphone</sendtype><phone><![CDATA[" + phone + "]]></phone><code><![CDATA[" + code + "]]></code><verify><![CDATA[" + verify + "]]></verify></form>",
                dataType: "xml",
                beforeSend: function () {
                    Kplus.config.isLoading = true;
                    $("#shade").addClass("loading");
                    $(".btn-primary").addClass("disabled");
                },
                success: function ($result) {
                    var $state, $message;
                    $($result).find("item").each(function () {
                        var $field = $(this);
                        $state = $field.find("return").text(); /* 状态 */
                        $message = $field.find("message").text(); /* 消息 */
                    });
                    if ($state == "success") {
                        $(".progress-bar").css("width", "100%");
                        $("#background_2").text("");
                        $("#background_2").removeClass("background_h");
                        $("#background_2").addClass("background_ok");
                        $("#health_descript_1").addClass("hidden");
                        $("#health_descript_2").removeClass("hidden");
                        setTimeout(function () {
                            $("#health_descript_2 a.alink").click();
                        }, 5000);
                    } else {
                        Kplus.prompt($message, "danger");
                    }
                },
                error: function () {
                    Kplus.prompt("服务器繁忙，请稍后重试！", "danger");
                    return false;
                },
                complete: function () {
                    $("#shade").removeClass("loading");
                    Kplus.config.isLoading = false;
                    $(".btn-primary").removeClass("disabled");
                }
            });
        }
    });
});