/*--------读取数据显示  start--------*/
$(function () {
    $.ajax({
        url: "/action/memberlist?i=" + lanh.userID,
        type: "GET",
        data: "",
        processData: false,
        async: false,
        dataType: "xml",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            $("#username").text(lanh.userName);
            var _nickname = $(data).find("channel").find("item").find("nickname").text();
            $("#name").val(_nickname);
            var _sex = $(data).find("channel").find("item").find("sex").text();
            if (_sex == "undefined" || _sex == "") {
                $("input[name='sex'][value='保密']").attr("checked", true);
            } else {
                $("input[name='sex'][value=" + _sex + "]").attr("checked", true);
            }
            var _special = $(data).find("channel").find("item").find("special").attr("title");
            $("#special").text(_special);
            var _mail = $(data).find("channel").find("item").find("mail").text();
            $("#mail").val(_mail);
            $(".js_mailUpdate").attr("href", "views/verifyemail?mail=" + _mail + "&" + Math.random());
            $(".js_mailBind").attr("href", "views/verifyemail?mail=" + _mail);
            if(!!_mail){
                var urlStr = window.location.href,
                    codePosition = urlStr.indexOf("&code=");
                if(codePosition!== -1){
                    window.location.href = urlStr.substring(0,codePosition);
                } 
            }

            var _mobilephone = $(data).find("channel").find("item").find("mobilephone").text();
            $("#mobilephone").val(_mobilephone);
            $(".js_phoneUpdate").attr("href", "views/verifyphone?phone=" + _mobilephone);
            $(".js_phoneBind").attr("href", "views/verifyphone?phone=" + _mobilephone);

            var _isverifyphone = $(data).find("channel").find("item").find("isverifyphone").text();
            if (_isverifyphone == "1") {
                $(".js_phoneUpdate").show();
                $(".js_phoneStatus").show();
                $(".js_phoneBind").hide();
                $("#mobilephone").attr("readonly",true);
            }
            var _isverifyemail = $(data).find("channel").find("item").find("isverifyemail").text();
            if (_isverifyemail == "1") {
                $(".js_mailUpdate").show();
                $(".js_mailStatus").show();
                $(".js_mailBind").hide();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
})
/*--------读取数据显示  end--------*/

/*--------验证并保存数据  start--------*/
$("#memberDataForm").validate({
    rules: {
        name: {
            required: true
        },
        mail: {
            email: true
        },
        mobilephone: {
            mobile: true
        }
    },
    messages: {
        name: {
            required: '会员昵称不能为空'
        },
        mail: {
            mail: '请输入正确的邮箱地址'
        },
        mobilephone: {
            mobile: '请输入正确的手机号码'
        }
    },
    submitHandler: function () {
        doSubmitUser();
    }
});
/*--------验证并保存数据  end--------*/

/*--------保存数据  start--------*/
function doSubmitUser() {
    var _nickname = $("#name").val(),
        _sex = $('input[name="sex"]:checked ').val(),
        _mail = $("#mail").val(),
        _mobilephone = $("#mobilephone").val();

    if (_nickname == "") {
        $("#name").focus();
        return;
    }

    var data = "<form><nickname><![CDATA[" + _nickname +
           "]]></nickname><sex><![CDATA[" + _sex +
            "]]></sex><mail><![CDATA[" + _mail +
           "]]></mail><mobilephone><![CDATA[" + _mobilephone +
           "]]></mobilephone></form>";

    $.ajax({
        url: "/action/member_edit?i=" + lanh.userID,
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
                Kplus.prompt("保存成功！", "success");
                $("#userInfoChoose").click();
            } else if (state == "fail") {
                Kplus.alert(msg);
            }
            $(".btn-primary").removeClass("disabled");
        },
        error: function (data) {
            Kplus.alert("服务器繁忙，请稍后重试！");
            $(".btn-primary").removeClass("disabled");
            return false;
        }
    });
};
/*--------保存数据  end--------*/

