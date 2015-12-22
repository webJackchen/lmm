$("input#orderDate").daterangepicker({
    "autoApply": true,
    "startDate": new Date(),
    "endDate": new Date(),
    "locale": {
        "format": "YYYY/MM/DD"
    }
});

/*添加默认选中*/
if ($("#orderState").val() != "") {
    var $html = '<s class="active"><i></i></s>';
    $(".order ul.nav-tabs li").each(function () {
        var _this = $(this),
           _state = _this.attr("data-value");
        if (parseInt(_state) == parseInt($("#orderState").val())) {
            _this.addClass("active").siblings().removeClass("active");
            _this.children("a").append($html);
        }
    });
}

var orderStatus = $("#orderState").val() ? $("#orderState").val() : "", orderDate = "", orderKey = "";

var refreshList = function () {
    var $params = [];
    if (orderStatus != "-2" && orderStatus != "-1") {
        $params.push("order_state=" + orderStatus);
    }
    if (orderStatus == "0") {
        $params.push("isexamine=1");
        $params.push("order_paymenttype=1");
    }
    if (orderDate != "" && orderDate != "输入选择时间") {
        var $array = orderDate.split("-");

        $params.push("st=" + $array[0].substring(0, $array[0].length - 1));
        $params.push("et=" + $array[1].substring(1, $array[1].length));
    }
    if (orderStatus == "-1") {
        $params.push("isexamine=-1");
    }
    $.getJSON("/action/sorderlist?type=json&m=goods&" + $params.join("&"), function ($result) {
        var item = [];
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;

            var html = "";
            $("#tbody_data").html("");

            if (item.length > 0) {
                $.each(item, function (idx, template) {
                    html += '<tr style="height: 15px; min-height: 15px;"></tr>';
                    html += '<tr style="background: #F3F3F3; margin-top: 15px;"><td colspan="5" class="text-left">' +
                                     '<span>交易编号：' + template.title.text + '</span><span class="ml20 mr20">时间：' + template.pubdate.text + '</span>' +
                                 '</td></tr>';

                    html += '<tr class="ordergoos-list-tr">';
                    //商品信息
                    html += '<td class="text-left">';
                    if (template.items != null) {
                        if (template.items.item.length > 0) {
                            $.each(template.items.item, function (idx1, item1) {
                                html += '<dl class="dl-horizontal">' +
                                                '<dt><img alt="" src="/70_70_1' + (item1.image != null ? item1.image.text : "") + '" /></dt>' +
                                                '<dd>' + (item1.title != null ? item1.title.text : "") + '</dd></dl>';
                            });
                        } else {
                            html += '<dl class="dl-horizontal">' +
                                            '<dt><img alt="" src="/70_70_1' + (template.items.item.image != null ? template.items.item.image.text : "") + '" /></dt>' +
                                            '<dd>' + (template.items.item.title != null ? template.items.item.title.text : "") + '</dd></dl>';
                        }
                    } else {
                        html += '<dl class="dl-horizontal"><dt><img alt="" src="/70_70_1/#" /></dt><dd></dd></dl>';
                    }
                    html += '</td>';

                    //收货人
                    html += '<td>' + (template.receive_name != null ? template.receive_name.text : "") + '</td>';
                    //总计价格
                    html += '<td>' + template.total.text + '</td>';

                    //订单状态
                    html += '<td>';
                    if (template.isexamine.text == '-1') {
                        html += '<span class="highlight_red">交易关闭</span>';
                    } else if (template.state.text == '0') {
                        if (template.payment_type.text == '货到付款' || template.payment_type.text == '0') {
                            html += '<span class="highlight_red">待确认</span>';
                        } else {
                            html += '<span class="highlight_red">待付款</span>';
                        }
                    } else if (template.state.text == '1') {
                        html += '<span class="highlight_green"> 待发货</span>';
                    } else if (template.state.text == '2') {
                        html += '<span class="highlight_green">已发货 </span>';
                    } else if (template.state.text == '4' || template.state.text == '5') {
                        html += '<span class="highlight_green">交易完成</span>';
                    }
                    html += '</td>';

                    //操作按钮
                    html += '<td>';
                    if (template.state.text == '0' && template.isexamine.text != '-1') {
                        if (template.payment_type.text == '货到付款' || template.payment_type.text == '0') {
                        } else {
                            html += '<div><a class="btn  btn-default " href="javascript:;" onclick="doSubmitPay(' + template.link.text + ',\'' + template.title.text + '\',' + template.items.item.total.text + ')">付款</a></div>';
                        }
                        html += '<div><a class="orderCancel"  href="javascript:;" onclick="actionOrder(' + template.link.text + ',-1)">取消订单</a></div>';
                    } else if (template.state.text == '2') {
                        html += '<a class="btn  btn-default "  href="javascript:;" onclick="actionOrder(' + template.link.text + ',4)">确认收货</a>';
                    } else if (template.state.text == '4') {
                        html += '<a class="btn  btn-default "  href="javascript:;" onclick="doAddComment(' + template.items.item.itemId.text + ',' + template.link.text + ')">评价</a>';
                    }
                    html += '</td>';
                    html += '</tr>';
                });
            } else {
                html += '<tr style="height: 15px; min-height: 15px;"></tr>';
                html += '<tr style="background: #F3F3F3; margin-top: 15px;"><td colspan="5" class="text-left">' +
                                 '<span>交易编号：' + item.title.text + '</span><span class="ml20 mr20">时间：' + item.pubdate.text + '</span>' +
                             '</td></tr>';

                html += '<tr class="ordergoos-list-tr">';
                //商品信息
                html += '<td class="text-left">';
                if (item.items != null) {
                    if (item.items.item.length > 0) {
                        $.each(item.items.item, function (idx1, item1) {
                            html += '<dl class="dl-horizontal">' +
                                            '<dt><img alt="" src="/70_70_1' + (item1.image != null ? item1.image.text : "") + '" /></dt>' +
                                            '<dd>' + (item1.title != null ? item1.title.text : "") + '</dd></dl>';
                        });
                    } else {
                        html += '<dl class="dl-horizontal">' +
                                        '<dt><img alt="" src="/70_70_1' + (item.items.item.image != null ? item.items.item.image.text : "") + '" /></dt>' +
                                        '<dd>' + (item.items.item.title != null ? item.items.item.title.text : "") + '</dd></dl>';
                    }
                } else {
                    html += '<dl class="dl-horizontal"><dt><img alt="" src="/70_70_1/#" /></dt><dd></dd></dl>';
                }
                html += '</td>';

                //收货人
                html += '<td>' + (item.receive_name != null ? item.receive_name.text : "") + '</td>';
                //总计价格
                html += '<td>' + item.total.text + '</td>';

                //订单状态
                html += '<td>';
                if (item.isexamine.text == '-1') {
                    html += '<span class="highlight_red">交易关闭</span>';
                } else if (item.state.text == '0') {
                    if (item.payment_type.text == '货到付款' || item.payment_type.text == '0') {
                        html += '<span class="highlight_red">待确认</span>';
                    } else {
                        html += '<span class="highlight_red">待付款</span>';
                    }
                } else if (item.state.text == '1') {
                    html += '<span class="highlight_green"> 待发货</span>';
                } else if (item.state.text == '2') {
                    html += '<span class="highlight_green">已发货 </span>';
                } else if (item.state.text == '4' || template.state.text == '5') {
                    html += '<span class="highlight_green">交易完成</span>';
                }
                html += '</td>';

                //操作按钮
                html += '<td>';
                if (item.state.text == '0' && item.isexamine.text != '-1') {
                    if (item.payment_type.text == '货到付款' || item.payment_type.text == '0') {
                    } else {
                        html += '<div><a class="btn  btn-default " href="javascript:;" onclick="doSubmitPay(' + item.link.text + ',\'' + item.title.text + '\',' + item.items.item.total.text + ')">付款</a></div>';
                    }
                    html += '<div><a class="orderCancel"  href="javascript:;" onclick="actionOrder(' + item.link.text + ',-1)">取消订单</a></div>';
                } else if (item.state.text == '2') {
                    html += '<a class="btn  btn-default "  href="javascript:;" onclick="actionOrder(' + item.link.text + ',4)">确认收货</a>';
                } else if (item.state.text == '4') {
                    html += '<a class="btn  btn-default "  href="javascript:;" onclick="doAddComment(' + item.items.item.itemId.text + ',' + item.link.text + ')">评价</a>';
                }
                html += '</td>';
                html += '</tr>';
            }
            $("#tbody_data").append(html);
        } else {
            $("#tbody_data").html("");
        }
    });
}




$(".nav li").each(function () {
    $(this).click(function () {
        switchStatue($(this), $(this).attr("data-value"));
        cleanInput();
    });
});

var switchStatue = function ($event, statue) {
    var $html = '<s class="active"><i></i></s>';
    orderStatus = statue;

    $($event).addClass("active").siblings().removeClass("active");
    $($event).parent().find("s.active").remove();
    $($event).find("a").append($html);

    if (statue != -2) {
        $("#orderStatus").parent().hide();
    } else {
        $("#orderStatus").parent().show();
    }

    refreshList();
}

$("button.btn-primary").click(function () {
    orderDate = $("#orderDate").val();
    orderStatus = $("#orderStatus").val();
    $(".nav li").each(function () {
        if ($(this).attr("class") == "active" && $(this).attr("data-value") != "-2") {
            orderStatus = $(this).attr("data-value");
        }
    })
    orderKey = $("#orderKey").val();
    refreshList();
});

function cleanInput() {
    $("#orderStatus").val("-2");
    $("#orderStatus option[value='请选择订单状态']").attr("selected", true);
    $("#orderDate").val("");
    $("#orderKey").val("");
}

refreshList();
function doAddComment(goodsLink, orderLink) {
    $(".dialog").html("");
    Kplus.message("评价", $('#addMessage').html().replace("@goodsLink", goodsLink).replace("@orderLink", orderLink));
}

function doSubmitPay(goodsLink, goodsNum, goodsPrice) {
    var url = "/payment/web/alipayescow/" + goodsLink + "?title=" + goodsNum + "&total=" + goodsPrice;
    window.location = url;
}