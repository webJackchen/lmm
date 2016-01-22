(function () {
    var panelId = "_panelId_";
    var hasInputError = false;
    var hasMemberSystem = $(document.body).data('turnedsmembersystem');

    var turnedOrder;
    $("#" + panelId).find('#btnOrder').css({ 'display': 'none' });
    if (hasMemberSystem) {
        var timer = setInterval(function () {
            turnedOrder = $(document.body).data('turnedorder');
            if (turnedOrder !== undefined) {
                if (turnedOrder) {
                    $("#" + panelId).find('#btnOrder').css({ 'display': 'inline-block' });
                } else {
                    $("#" + panelId).find('#btnOrder').css({ 'display': 'none' });
                }
                clearInterval(timer);
            }
        }, 200)
    } else {
        $("#" + panelId).find('#btnOrder').css({ 'display': 'none' });
    }


    $("#" + panelId).find('#btnOrder').click(function () {
        if (hasMemberSystem) {
            orderProcessForMember();
        } else {
            alert('没有会员系统，无法订购！');
            //orderProcess();
        }
    });

    /*没有自定义属性则隐藏*/
    if ($("#" + panelId).find(".detail-attribute .attribute").text() == "") {
        $("#" + panelId).find(".detail-attribute#attribute").hide();
    }

    /*增加数量*/
    $("#" + panelId).find("#addStock").click(function () {
        var _value = parseInt($("#" + panelId).find(".detail-attribute input.stock").val());
        _value = ++_value;
        $("#" + panelId).find(".detail-attribute input.stock").val(_value);
    });

    /*减少数量*/
    $("#" + panelId).find("#reduceStock").click(function () {
        var _value = parseInt($("#" + panelId).find(".detail-attribute input.stock").val());
        if (_value > 1) {
            _value = --_value;
        }
        $("#" + panelId).find(".detail-attribute input.stock").val(_value);
    });

    /*是否是会员*/
    if (parseInt($("#" + panelId).find("#isvip").val()) === 0) {
        $("#" + panelId).find("div.VIP-price").hide();
        $("#" + panelId).find("div.VIP-price").siblings("span.shop-price").addClass("text-decoratio");
    }

    var orderProcess = function () {
        $("#orderModal").modal('show');
    }

    var orderProcessForMember = function () {
        var userinfo = $.cookie("user.info");
        var isLogin = userinfo && userinfo !== "";
        if (!isLogin) {
            $(".ui-dialog").find(".loginContainer").dialog('open');
            return;
        }
        $("#confirmOrderModal").modal('show');
    }

    /*无会员---点击提交订单*/
    $("#" + panelId).find('#btnSubmitOrder').click(function () {
        var data = getOrderFormData();
        if (hasInputError) {
            alert('输入的信息不正确！');
            return;
        }
        callOrderApi(data);
    });

    /*无会员---获取输入订单信息*/
    var getOrderFormData = function () {
        hasInputError = false
        var data = { itemid: $('#link').val() };
        data.name = $("#orderModal").find("#txtordername").val();
        if (data.name && data.name !== "") {
            hasSuccessStyle($("#orderModal").find("#txtordername").parent().parent());
        }
        else {
            hasErrorStyle($("#orderModal").find("#txtordername").parent().parent());
        }

        data.phone = $("#orderModal").find("#txtorderphone").val();
        if (data.phone && data.phone !== "") {
            hasSuccessStyle($("#orderModal").find("#txtorderphone").parent().parent());
        }
        else {
            hasErrorStyle($("#orderModal").find("#txtorderphone").parent().parent());
        }

        data.email = $("#orderModal").find("#txtorderemail").val();
        if (data.email && data.email !== "") {
            hasSuccessStyle($("#orderModal").find("#txtorderemail").parent().parent());
        }
        else {
            hasErrorStyle($("#orderModal").find("#txtorderemail").parent().parent());
        }

        data.address = $("#orderModal").find("#txtorderaddress").val();
        if (data.address && data.address !== "") {
            hasSuccessStyle($("#orderModal").find("#txtorderaddress").parent().parent());
        }
        else {
            hasErrorStyle($("#orderModal").find("#txtorderaddress").parent().parent());
        }

        data.itemid = $('#link').val(),
        data.count = $('#count').val();
        data.description = $("#orderModal").find("#txtorderdescription").val();

        return data;
    }

    /*无会员---添加错误提示*/
    var hasErrorStyle = function (obj) {
        obj.removeClass('has-success');
        obj.addClass('has-error');
        hasInputError = true;
    }

    /*无会员---添加正确提示*/
    var hasSuccessStyle = function (obj) {
        obj.removeClass('has-error');
        obj.addClass('has-success');
        hasInputError = false;
    }

    /*调用k+订购API*/
    var callOrderApi = function (data) {
        if (!data) {
            alert('订购失败，非法参数！');
            return;
        }

        var formdata = "<form>";
        for (var p in data) {
            if (typeof (data[p]) !== " function " && p !== 'href') {
                formdata += "<" + p + "><![CDATA[" + data[p] + "]]></" + p + ">";
            }
        }
        formdata += "</form>";

        $.ajax({
            type: "POST",
            url: "http://" + window.location.host + "/action/sorderinsertedit?m=product&type=json",
            data: formdata,
            dataType: "text",
            success: function (result) {
                var resultObj = JSON.parse(result);
                if (resultObj && resultObj.root) {
                    if (resultObj.root.state === 'success') {
                        alert('订购成功！');
                        if (data.href) {
                            window.open(data.href);
                        }
                    }
                    else {
                        alert('订购失败！' + unescape(resultObj.root.message));
                    }
                }
                else {
                    alert('订购失败！');
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("系统错误，订购失败！");
            },
            complete: function (xhr, ts) {
                $("#orderModal").modal('hide');
            }
        });
    }

    /*会员---确认订购*/
    $("#" + panelId).find('#btnConfirmOrder').click(function () {
        $.ajax({
            url: "/action/Saddresslist?type=json",
            type: "GET",
            data: "",
            processData: false,
            async: false,
            dataType: "text",
            success: function (data) {
                var result = JSON.parse(data);
                if (result && result.channel && result.channel.item) {
                    var info = result.channel.item;
                    if (Object.prototype.toString.call(result.channel.item) === '[object Array]' && result.channel.item.length > 0) {
                        info = $.grep(result.channel.item, function (obj, index) {
                            return obj.state.text === "1";
                        });
                        if (info && info.length === 0) {
                            info = result.channel.item[0];
                        }
                        else {
                            info = info[0];
                        }
                    }

                    if (info) {
                        callOrderApi({
                            itemid: $('#link').val(),
                            count: $('#count').val(),
                            phone: info.mobile.text,
                            name: info.name.text,
                            email: info.email.text,
                            address: info.address.text,
                            description: $('#txtorderdescriptionformember').val(),
                            href: "http://" + window.location.host + "/web/member/index?jump=order"
                        });
                    }
                    else {
                        alert('没有默认地址！');
                    }
                } else {
                    alert('请完善收货地址！');
                    window.open("http://" + window.location.host + "/web/member/index?jump=address");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("系统错误，订购失败！");
            },
            complete: function (xhr, ts) {
                $("#confirmOrderModal").modal('hide');
            }
        });
    });

    /*务必将模态框的 HTML 代码放在文档的最高层级内（也就是说，尽量作为 body 标签的直接子元素），以避免其他组件影响模态框的展现和/或功能。*/
    $('body').append($('#orderModal'));
    $('body').append($('#confirmOrderModal'));
    $("#orderModal").find('.modal-content').css({ 'width': '480px' });
})();