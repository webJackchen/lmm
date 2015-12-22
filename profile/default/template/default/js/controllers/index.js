var orderType = "1", pageIndex = 1, pageSize = 5;


var LoadHandle = function () {
    $.getJSON("/action/remindstatistics", function ($result) {
        if ($result.state == "fail") {
            return;
        }
        if ($result.data) {
            $.each($result.data, function (_idx, _item) {
                _item.buycount = Kplus.isNullOrEmpty(_item.buycount) ? 0 : _item.buycount;
                _item.messagecount = Kplus.isNullOrEmpty(_item.messagecount) ? 0 : _item.messagecount;

                _item.ordercount = Kplus.isNullOrEmpty(_item.ordercount) ? 0 : _item.ordercount;
                _item.replycount = Kplus.isNullOrEmpty(_item.replycount) ? 0 : _item.replycount;

                $(".handle-confirm span").html(_item.buycount);
                $(".handle-message span").html(_item.messagecount);

                $(".handle-evaluate span").html("0");
                $(".handle-reply span").html("0");
            });
        }
    });
    $.getJSON("/action/orderstatistics?i=" + lanh.userID, function ($result) {
        if ($result.state == "fail") {
            return;
        }
        if ($result.data) {
            $.each($result.data, function (_idx, _item) {
                _item.ordercount = Kplus.isNullOrEmpty(_item.ordercount) ? 0 : _item.ordercount;
                _item.paycount = Kplus.isNullOrEmpty(_item.paycount) ? 0 : _item.paycount;

                $(".handle-payment span").html(_item.ordercount);
                $(".handle-deliver span").html(_item.paycount);
            });
        }
    });
}
var LoadIndent = function () {
    var $data = {
        pageIndex: pageIndex,
        pageSize: pageSize,

        orderType: orderType
    }
    var $params = [];
    $params.push("p=" + $data.pageIndex);
    $params.push("count=" + $data.pageSize);
    $params.push("isexamine=" + $data.orderType);

    Kplus.config.isLoading = true;
    $("#shade").addClass("loading");
    $.getJSON("/action/sorderlist?type=json&m=product&" + $params.join("&"), function ($result) {
        var item = [];
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;

            if (item.length > 0) {
                $("#tbody_data").html("");
                $.each(item, function (idx, template) {
                    $("#tbody_data").append('<tr style="height: 15px; min-height: 15px;"></tr>' +
                        '<tr style="background: #F3F3F3; margin-top: 15px;">' +
                            '<td colspan="5" class="text-left">' +
                                '<span>交易编号：' + template.title.text + '</span>' +
                                '<span class="ml20 mr20">时间：' + template.pubdate.text + '</span>' +
                                '<span>共计：' + template.count.text + '个商品</span>' +
                            '</td>' +
                        '</tr>' +
                        '<tr>' +
                            '<td class="text-left">' +
                                '<dl class="dl-horizontal">' +
                                    '<dt>' +
                                        '<img alt="" src="/70_70_1' + (template.items != null ? template.items.item.image.text : "/#") + '" />' +
                                    '</dt>' +
                                    '<dd>' + (template.items != null ? template.items.item.title.text : "") + '</dd>' +
                                '</dl>' +
                            '</td>' +
                            '<td>' + (template.receive_name != null ? template.receive_name.text : "") + '</td>' +
                            '<td>' + template.total.text + '</td>' +
                            '<td>' +
                                '<span>' + (template.isdelete.text == 1 ? "已取消" : (template.isexamine.text == 1 ? "已确认" : "待确认")) + '</span></td>' +
                            '<td>' + (template.isdelete.text == 1 ? "已取消" : '<a class="icon-cancel-pro" href="javascript:void(0);" data-id="' + template.link.text + '">取消订单</a>') + '</td>' +
                        '</tr>');
                });
            } else {
                $("#tbody_data").html("");
                $("#tbody_data").append('<tr style="height: 15px; min-height: 15px;"></tr>' +
                    '<tr style="background: #F3F3F3; margin-top: 15px;">' +
                        '<td colspan="5" class="text-left">' +
                            '<span>交易编号：' + item.title.text + '</span>' +
                            '<span class="ml20 mr20">时间：' + item.pubdate.text + '</span>' +
                            '<span>共计：' + item.count.text + '个商品</span>' +
                        '</td>' +
                    '</tr>' +
                    '<tr>' +
                        '<td class="text-left">' +
                            '<dl class="dl-horizontal">' +
                                '<dt>' +
                                    '<img alt="" src="/70_70_1' + (item.items != null ? item.items.item.image.text : "/#") + '" />' +
                                '</dt>' +
                                '<dd>' + (item.items != null ? item.items.item.title.text : "") + '</dd>' +
                            '</dl>' +
                        '</td>' +
                        '<td>' + (item.receive_name != null ? item.receive_name.text : "") + '</td>' +
                        '<td>' + item.total.text + '</td>' +
                        '<td>' +
                            '<span>' + (template.isdelete.text == 1 ? "已取消" : (template.isexamine.text == 1 ? "已确认" : "待确认")) + '</span></td>' +
                        '<td>' + (template.isdelete.text == 1 ? "已取消" : '<a class="icon-cancel-pro" href="javascript:void(0);" data-id="' + template.link.text + '">取消订单</a>') + '</td>' +
                    '</tr>');
            }
        }
        $("#shade").removeClass("loading");
        Kplus.config.isLoading = false;
    });
}
var LoadOrder = function () {
    var $data = {
        pageIndex: pageIndex,
        pageSize: pageSize,

        orderType: orderType
    }
    var $params = [];
    $params.push("p=" + $data.pageIndex);
    $params.push("count=" + $data.pageSize);
    $params.push("isexamine=" + $data.orderType);

    $.getJSON("/action/sorderlist?type=json&m=goods&" + $params.join("&"), function ($result) {
        var item = [];
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;

            var html = "";
            $("#tbody_data1").html("");

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
                            html += '<div><a class="btn  btn-default " href="javascript:;" onclick="doSubmitPay(' + template.items.item.itemId.text + ',\'' + template.title.text + '\',' + template.items.item.total.text + ')">付款</a></div>';
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
                        html += '<div><a class="btn  btn-default " href="javascript:;" onclick="doSubmitPay(' + item.items.item.itemId.text + ',\'' + item.title.text + '\',' + item.items.item.total.text + ')">付款</a></div>';
                    }
                    html += '<div><a class="orderCancel"  href="javascript:;" onclick="actionOrder(' + template.link.text + ',-1)">取消订单</a></div>';
                } else if (item.state.text == '2') {
                    html += '<a class="btn  btn-default "  href="javascript:;" onclick="actionOrder(' + item.link.text + ',4)">确认收货</a>';
                } else if (item.state.text == '4') {
                    html += '<a class="btn  btn-default "  href="javascript:;" onclick="doAddComment(' + item.items.item.itemId.text + ',' + item.link.text + ')">评价</a>';
                }
                html += '</td>';
                html += '</tr>';
            }
            $("#tbody_data1").append(html);
        } else {
            $("#tbody_data1").html("");
        }
    });
}

var LoadOrderAccount = function () {
    /*待付款*/
    $.getJSON("/action/sorderlist?m=goods&order_state=0&order_paymenttype=1&type=json", function (result) {
        if (!!result && !!result.channel) {
            var account = result.channel.allcount;
            $("#index-account").find(".handle-payment span").text(account);
        }
    });
    /*待收货*/
    $.getJSON("/action/sorderlist?m=goods&order_state=2&type=json", function (result) {
        if (!!result && !!result.channel) {
            var account = result.channel.allcount;
            $("#index-account").find(".handle-deliver span").text(account);
        }
    });
    /*待评价*/
    $.getJSON("/action/sorderlist?m=goods&order_state=4&type=json", function (result) {
        if (!!result && !!result.channel) {
            var account = result.channel.allcount;
            $("#index-account").find(".handle-evaluate span").text(account);
        }
    });
}

$(function () {
    //LoadHandle();
    LoadIndent();
    LoadOrder();
    LoadOrderAccount();

    $(document).on("click", ".icon-cancel-pro").each(function () {
        $(this).click(function () {
            console.log(0);
            var _id = $(this).attr("data-id");
            var $xml = "<form><order_delete>" + _id + "</order_delete><isnext>false</isnext></form>";
            var $url = "/action/sorderlist?m=product";

            $.ajax({
                url: $url,
                type: "POST",
                data: $xml,
                dataType: "xml",
                beforeSend: function () {
                    Kplus.config.isLoading = true;
                    $("#shade").addClass("loading");
                },
                success: function ($result) {
                    var $state, $message;
                    $($result).find("item").each(function () {
                        var $field = $(this);
                        $state = $field.find("return").text(); /* 状态 */
                        $message = $field.find("message").text(); /* 消息 */
                    });
                    if ($state == "success") {
                        Kplus.prompt("取消成功！", "success");
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
                }
            });
        });
    });

    //$(document).on("click", ".icon-cancel-gds").each(function () {
    //    $(this).click(function () {
    //        var _id = $(this).attr("data-id");
    //        var $xml = "<form><order_examine>" + _id + "</order_examine><order_type>-1</order_type><isnext>false</isnext></form>";
    //        var $url = "/action/sorderlist?m=goods";

    //        $.ajax({
    //            url: $url,
    //            type: "POST",
    //            data: $xml,
    //            dataType: "xml",
    //            success: function ($result) {
    //                var $state, $message;
    //                $($result).find("item").each(function () {
    //                    var $field = $(this);
    //                    $state = $field.find("return").text(); /* 状态 */
    //                    $message = $field.find("message").text(); /* 消息 */
    //                });
    //                if ($state == "success") {
    //                    Kplus.prompt("取消成功！", "success");
    //                } else {
    //                    Kplus.prompt($message, "danger");
    //                }
    //            },
    //            error: function () {
    //                Kplus.prompt("服务器繁忙，请稍后重试！", "danger");
    //                return false;
    //            }
    //        });
    //    });
    //});
});

