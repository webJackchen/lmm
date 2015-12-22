$(function () {
    $("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
    /* 表单验证 */
    $("#dataForm").validate({
        debug: true,
        rules: {
            txtPhone: {
                required: true,
                mobile: true
            },
            txtVerifyCode: "required"
        },
        messages: {
            txtPhone: {
                required: "邮箱地址不能为空",
                mobile: "邮箱地址输入错误"
            },
            txtVerifyCode: "验证码不能为空"
        }
    });
    $("a.aVerifyCode").click(function () {
        $("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
    });
    $(".btn-primary1").click(function () {
        /* 提交验证 */
        if ($("#dataForm").valid()) {
            var email = $("#txtEmail").val(), verify = $("#txtVerifyCode").val();

            $.ajax({
                url: "/action/sendemail",
                type: "POST",
                data: "<form><sendtype>getverifyemail</sendtype><email><![CDATA[" + email + "]]></email><verify><![CDATA[" + verify + "]]></verify></form>",
                dataType: "xml",
                beforeSend: function () {
                    Kplus.config.isLoading = true;
                    $("#shade").addClass("loading");
                    $(".btn-primary1").addClass("disabled");
                },
                success: function ($result) {
                    var $state, $message;
                    $($result).find("item").each(function () {
                        var $field = $(this);
                        $state = $field.find("return").text(); /* 状态 */
                        $message = $field.find("message").text(); /* 消息 */
                    });
                    if ($state == "success") {
                        $(".progress-bar").css("width", "66.67%");
                        $("#background_2").text("");
                        $("#background_2").removeClass("background_h");
                        $("#background_2").addClass("background_ok");
                        $("#health_descript_1").addClass("hidden");
                        $("#health_descript_2").removeClass("hidden");

                        $(".verifysec strong").html("已发送验证邮件至：" + email);
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
                    $(".btn-primary1").removeClass("disabled");
                }
            });
        }
    });
    $(".btn-primary2").click(function () {
        var email = $("#txtEmail").val();

        email = gotoEmail(email);
        if (!Kplus.isNullOrEmpty(email)) {
            $(this).attr("href", "http://" + email);
            $(this).click();
        } else {
            Kplus.prompt("抱歉！未找到对应的邮箱登录地址，请自己登录邮箱查看邮件！", "warning");
            return false;
        }
    });

    //功能：根据用户输入的Email跳转到相应的电子邮箱首页
    function gotoEmail($mail) {
        $t = $mail.split('@')[1];
        $t = $t.toLowerCase();
        if ($t == '163.com') {
            return 'mail.163.com';
        } else if ($t == 'vip.163.com') {
            return 'vip.163.com';
        } else if ($t == '126.com') {
            return 'mail.126.com';
        } else if ($t == 'qq.com' || $t == 'vip.qq.com' || $t == 'foxmail.com') {
            return 'mail.qq.com';
        } else if ($t == 'gmail.com') {
            return 'mail.google.com';
        } else if ($t == 'sohu.com') {
            return 'mail.sohu.com';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'vip.sina.com') {
            return 'vip.sina.com';
        } else if ($t == 'sina.com.cn' || $t == 'sina.com') {
            return 'mail.sina.com.cn';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'yahoo.com.cn' || $t == 'yahoo.cn') {
            return 'mail.cn.yahoo.com';
        } else if ($t == 'tom.com') {
            return 'mail.tom.com';
        } else if ($t == 'yeah.net') {
            return 'www.yeah.net';
        } else if ($t == '21cn.com') {
            return 'mail.21cn.com';
        } else if ($t == 'hotmail.com') {
            return 'www.hotmail.com';
        } else if ($t == 'sogou.com') {
            return 'mail.sogou.com';
        } else if ($t == '188.com') {
            return 'www.188.com';
        } else if ($t == '139.com') {
            return 'mail.10086.cn';
        } else if ($t == '189.cn') {
            return 'webmail15.189.cn/webmail';
        } else if ($t == 'wo.com.cn') {
            return 'mail.wo.com.cn/smsmail';
        } else if ($t == '139.com') {
            return 'mail.10086.cn';
        } else {
            return '';
        }
    }
});