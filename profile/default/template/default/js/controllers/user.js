var LoadUserInfo = function () {
    Kplus.config.isLoading = true;
    $("#shade").addClass("loading");
    $.getJSON("/action/memberlist?type=json&i=" + lanh.userID, function ($result) {
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            $(".info-account span").html(lanh.userName);
            $(".info-nname span").html($result.channel.item.nickname != null ? $result.channel.item.nickname.text : "");
            $(".info-level span").html($result.channel.item.special != null ? $result.channel.item.special.title : "");
            $(".info-phone span").html($result.channel.item.mobilephone != null ? $result.channel.item.mobilephone.text : "");
            $(".info-mail span").html($result.channel.item.mail != null ? $result.channel.item.mail.text : "");

            if ($result.channel.item.nickname != null) {
                $("#loginUser").html("欢迎您！" + $result.channel.item.nickname.text);
            } else {
                $("#loginUser").html("欢迎您！" + lanh.userName);
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
        }
        $("#shade").removeClass("loading");
        Kplus.config.isLoading = false;
    });
}
LoadUserInfo();
/*退出登录*/
function exitLog() {
    $.ajax({
        type: "GET",
        url: "http://" + window.location.host + "/action/memberlogout",
        data: null,
        dataType: "text",
        success: function (result) {
            console.log(result);
        }
    });
    $.cookie("user.info", "", { path: '/' });
    window.location = "http://" + window.location.host + "/web/default.html";
}