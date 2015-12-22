$(function () {
    Kplus.config.isLoading = true;
    $("#shade").addClass("loading");
    $.getJSON("/action/memberlist?type=json&i=" + lanh.userID, function ($result) {
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            if ($result.channel.item.isverifyemail != null && $result.channel.item.isverifyemail.text == "1") {
                if ($result.channel.item.mail != null && !Kplus.isNullOrEmpty($result.channel.item.mail.text)) {
                    $("#useremail").html("您验证的邮箱：" + $result.channel.item.mail.text);
                    $("#sucemail").addClass("icon-ok1").removeClass("icon-excalmatory-mark");
                    $("#sucemail").closest("div.form-group").find("a.alink").attr("href", "views/verifyemail?mail=" + $result.channel.item.mail.text).html("修改");
                }
            }
            if ($result.channel.item.isverifyphone != null && $result.channel.item.isverifyphone.text == "1") {
                if ($result.channel.item.mobilephone != null && !Kplus.isNullOrEmpty($result.channel.item.mobilephone.text)) {
                    $("#userphone").html("您验证的手机：" + $result.channel.item.mobilephone.text + " 若已丢失或停用，请立即更换，避免账户被盗");
                    $("#sucphone").addClass("icon-ok1").removeClass("icon-excalmatory-mark");
                    $("#sucphone").closest("div.form-group").find("a.alink").attr("href", "views/verifyphone?phone=" + $result.channel.item.mobilephone.text).html("修改");
                }
            }
            if ($result.channel.item.isverifyemail != null && $result.channel.item.isverifyemail.text == "1" && $result.channel.item.isverifyphone != null && $result.channel.item.isverifyphone.text == "1") {
                $("#bg1").addClass("bgblack").removeClass("bgred");
                $("#bg3").addClass("bggreen").removeClass("bgblack");
                $("#cl1").addClass("clblack").removeClass("clred");
                $("#cl3").addClass("clgreen").removeClass("clblack");
            } else if (($result.channel.item.isverifyemail != null && $result.channel.item.isverifyemail.text == "1") || ($result.channel.item.isverifyphone != null && $result.channel.item.isverifyphone.text == "1")) {
                $("#bg1").addClass("bgblack").removeClass("bgred");
                $("#bg2").addClass("bgyellow").removeClass("bgblack");
                $("#cl1").addClass("clblack").removeClass("clred");
                $("#cl2").addClass("clyellow").removeClass("clblack");
            }
            $("#shade").removeClass("loading");
            Kplus.config.isLoading = false;
        }
    });
});