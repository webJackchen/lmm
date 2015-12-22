/* 状态 */
var orderStatus = ""
/* 状态 */
, orderType = ""
/* 时间 */
, orderDate = ""
/* 订单号 */
, orderKey = ""
, pageIndex = 1
, pageSize = 10
, pageTotal = 1;
/* 清值 */
var removeDate = function () {
    $("#orderType").val("0");
    $("#orderDate").val("");
    $("#orderKey").val("");
}
var switchStatue = function ($event, statue) {
    var $html = '<s class="active"><i></i></s>';
    orderType = statue;
    orderDate = "";
    orderKey = "";

    orderStatus = statue;

    $($event).addClass("active").siblings().removeClass("active");
    $($event).parent().find("s.active").remove();
    $($event).find("a").append($html);

    refreshList();
}
var refreshList = function () {
    var $data = {};
    $data = {
        pageIndex: pageIndex,
        pageSize: pageSize,

        orderType: orderType,
        orderDate: orderDate,
        keyWord: orderKey
    }
    var $params = [];
    $params.push("p=" + $data.pageIndex);
    $params.push("count=" + $data.pageSize);

    if ($data.orderType != 0) {
        $params.push("isexamine=" + $data.orderType);
    }
    if ($data.orderDate != "" && $data.orderDate != "输入选择时间") {
        var $array = $data.orderDate.split("-");

        $params.push("st=" + $array[0].substring(0, $array[0].length - 1));
        $params.push("et=" + $array[1].substring(1, $array[1].length));
    }
    if ($data.keyWord != "" && $data.keyWord != "输入订单编号") {
        $params.push("orderId=" + $data.keyWord);
    }
    Kplus.config.isLoading = true;
    $("#shade").addClass("loading");
    $.getJSON("/action/sorderlist?type=json&m=product&" + $params.join("&"), function ($result) {
        var item = [];
        $("#tbody_data").html("");
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;

            if (item.length > 0) {
                $.each(item, function (idx, template) {
                    $("#tbody_data").append('<tr style="height: 15px; min-height: 15px;"></tr>' +
                        '<tr style="background: #F3F3F3; margin-top: 15px;">' +
                            '<td colspan="5" class="text-left">' +
                                '<span>订单编号：' + template.title.text + '</span>' +
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
                                '<span>' + (template.isexamine.text == 1 ? "已确认" : "待确认") + '</span></td>' +
                            '<td>' + template.description.text + '</td>' +
                        '</tr>');
                });
            } else {
                $("#tbody_data").html("");
                $("#tbody_data").append('<tr style="height: 15px; min-height: 15px;"></tr>' +
                    '<tr style="background: #F3F3F3; margin-top: 15px;">' +
                        '<td colspan="5" class="text-left">' +
                            '<span>订单编号：' + item.title.text + '</span>' +
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
                            '<span>' + (item.isexamine.text == 1 ? "已确认" : "待确认") + '</span></td>' +
                        '<td>' + item.description.text + '</td>' +
                    '</tr>');
            }
            /* 加载分页数据 */
            LoadPage($result.channel.page, $("#page"));
        }
        $("#shade").removeClass("loading");
        Kplus.config.isLoading = false;
    });
}
/* 分页查询 */
var LoadData = function ($page) {
    pageIndex = $page;
    refreshList();
}
$(function () {
    $("input#orderDate").daterangepicker({
        "autoApply": true,
        "startDate": new Date(),
        "endDate": new Date(),
        "locale": {
            "format": "YYYY/MM/DD"
        }
    });
    /* 删除 */
    $(".nav li").each(function () {
        $(this).click(function () {
            switchStatue($(this), $(this).attr("data-value"));
        });
    });
    /* 搜索 */
    $("button.btn-primary").click(function () {
        pageIndex = 1;
        orderDate = $("#orderDate").val();
        orderType = $("#orderType").val();
        orderKey = $("#orderKey").val();
        refreshList();
    });
    /* 清除 */
    $("button.btn-default").click(function () {
        removeDate();
    });

    refreshList();
});