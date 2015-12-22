$(function () {
    /* 表单验证 */
    $("#dataForm").validate({
        debug: true,
        rules: {
            txtPasswordOld: {
                required: true
            },
            txtPasswordNew: {
                required: true,
                maxlength: 20,
                minlength: 3,
                engNumCheck: true
            },
            txtPasswordOk: {
                required: true,
                equalTo: "#txtPasswordNew"
            }
        },
        messages: {
            txtPasswordOld: {
                required: "旧密码不能为空"
            },
            txtPasswordNew: {
                required: "新密码不能为空",
                maxlength: "只能输入包含英文、数字、下划线等字符，长度为3-20个！",
                minlength: "只能输入包含英文、数字、下划线等字符，长度为3-20个！",
                engNumCheck: "只能输入包含英文、数字、下划线等字符，长度为3-20个！"
            },
            txtPasswordOk: {
                required: "确认密码不能为空",
                equalTo: "两次密码输入不一致！"
            }
        }
    });
    $(".btn-primary").click(function () {
        /* 提交验证 */
        if ($("#dataForm").valid()) {
            var passold = $("#txtPasswordOld").val(), passnew = $("#txtPasswordNew").val(), passok = $("#txtPasswordOk").val();
            if (passold == passnew) {
                Kplus.prompt("新旧密码不能一致！请重新输入。", "warning");
                $("#txtPasswordNew").focus();
                return false;
            }

            var $xml = "<form><password_old><![CDATA[" + passold + "]]></password_old><password_new><![CDATA[" + passnew + "]]></password_new><password_again><![CDATA[" + passok + "]]></password_again></form>";
            var $url = "/action/memberinsertedit?m=member&i=" + lanh.userID;

            $.ajax({
                url: $url,
                type: "POST",
                data: $xml,
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
                        Kplus.prompt("修改成功！", "success");
                        //window.top.location = "/manage/login";
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