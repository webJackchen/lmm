var addressLink = "";//当前地址link

function isGovernmentCity(val) {
    switch (val) {
        case "北京":
            return true;
        case "上海":
            return true;
        case "重庆":
            return true;
        case "天津":
            return true;
        case "香港":
            return true;
        case "澳门":
            return true;
        case "台湾":
            return true;
        case "":
            return false;
    }
}

/*--------地区选择显示  start--------*/
function changeData(val, select) {
    if (select == "province") {
        $("#labProvince").text(val);
        $("#labCity").text("");
        if (isGovernmentCity(val)) {
            $("#labCity").text(val);
        }
        $("#labDistrict").text("");

        $("#select_city").show();
        $("#district").show();

    } else if (select == "city") {
        if (isGovernmentCity($("#labProvince").text())) {
            $("#labDistrict").text(val);
        } else {
            $("#labCity").text(val);
            $("#labDistrict").text("");
        }
    } else if (select == "district") {
        $("#labDistrict").text(val);
    }

    $("#addressHeadDiv").show();
    $("#addressDiv").css({ "margin-left": "5px" });
}
/*--------地区选择显示  end--------*/

/*--------读取数据显示  start--------*/
$(function () {
    $.ajax({
        url: "/action/Saddresslist?state=1",
        type: "GET",
        data: "",
        processData: false,
        async: false,
        dataType: "xml",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        success: function (data) {
            if ($(data).find("channel").find("item").length == 1) {
                addressLink = $(data).find("channel").find("item").find("link").text();

                var _name = $(data).find("channel").find("item").find("name").text();
                var _province = $(data).find("channel").find("item").find("province").text();
                var _city = $(data).find("channel").find("item").find("city").text();
                var _district = $(data).find("channel").find("item").find("district").text();
                var _address = $(data).find("channel").find("item").find("address").text();
                var _mobile = $(data).find("channel").find("item").find("mobile").text();
                var _phone = $(data).find("channel").find("item").find("phone").text();
                var _mail = $(data).find("channel").find("item").find("email").text();

                $("#name").val(_name);
                setTimeout(function () {
                    $("#province option[value='" + _province + "']").attr("selected", true);
                    $("#select_city option[value='" + _city + "']").attr("selected", true);
                    $("#district option[value='" + _district + "']").attr("selected", true);
                }, 1000);

                $("#labProvince").text(_province);
                $("#labCity").text(_city);
                $("#labDistrict").text(_district);
                $("#addressHeadDiv").show();
                var _addressHead = _province + _city + _district;
                $("#address").val(_address.substring(_addressHead.length));
                $("#mobile").val(_mobile);
                $("#phone").val(_phone);
                $("#mail").val(_mail);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        }
    });
})
/*--------读取数据显示  end--------*/

/*--------验证并保存数据  start--------*/
$("#addressDataForm").validate({
    rules: {
        name: {
            required: true
        },
        mail: {
            email: true
        },
        mobile: {
            mobile: true
        },
        phone: {
            phone: true
        },
        address: {
            required: true
        }
    },
    messages: {
        name: {
            required: '收货人不能为空'
        },
        mail: {
            mail: '请输入正确的邮箱地址'
        },
        mobile: {
            mobile: '请输入正确的手机号码'
        },
        phone: {
            phone: '请输入正确的电话号码'
        },
        address: {
            required: '详细地址不能为空'
        }
    },
    submitHandler: function () {
        doSubmitaddress();
    }
});
/*--------验证并保存数据  end--------*/

/*--------保存数据  start--------*/
function doSubmitaddress() {
    var _name = $("#name").val(),
        //_province = $("#province").val(),
        //_city = $("#select_city").val(),
        //_district = $("#district").val(),
       _province = $("#labProvince").text(),
        _city = $("#labCity").text(),
        _district = $("#labDistrict").text(),
        _address = $("#address").val(),
        _mail = $("#mail").val(),
        _mobile = $("#mobile").val(),
    _phone = $("#phone").val();

    if (_mobile == "") _phone = $("#phone").val();
    if (_province == null) _province = "";
    if (_city == null) _city = "";
    if (_district == null) _district = "";

    if (_mobile == "" && _phone == "") {
        $("#mobile").focus();
        $("#phoneVerify").show();
        return;
    }

    var url = "/action/SAddressInsertEdit?i=" + addressLink;
    if (!!!addressLink) {
        url = "/action/SAddressInsertEdit";
    }

    var data = "<form><name><![CDATA[" + _name +
           "]]></name><province><![CDATA[" + _province +
            "]]></province><city><![CDATA[" + _city +
             "]]></city><district><![CDATA[" + _district +
              "]]></district><address><![CDATA[" + _province + _city + _district + _address +
               "]]></address><email><![CDATA[" + _mail +
           "]]></email><mobile><![CDATA[" + _mobile +
           "]]></mobile><phone><![CDATA[" + _phone +
           "]]></phone><state><![CDATA[1]]></state></form>";

    $.ajax({
        url: url,
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
                $("#addressChoose").click();
            } else if (state == "fail") {
                Kplus.alert(msg);
            }
            else {
                Kplus.alert(data);
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

function promptHide(prompt) {
    $("#" + prompt).hide();
}