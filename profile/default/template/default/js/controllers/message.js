/* 状态 */
var pageSize = 10
, pageTotal = 1;

/*--------数据列表  start--------*/
var refreshMessageList = function () {
    $.getJSON("/action/itemlist?m=message&type=json&isauthor=true&isShowContent=true&p=" + pageIndex+"&count=" + pageSize, function ($result) {
        var item = [];
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;
            if (item.length > 0) {
                $("tbody").html("");
                $.each(item, function (i, message) {
                    $("tbody").append('<tr>' +
                        '<th><input type="checkbox"  name="select_item" value="' + message.link.text + '"></th>' +
                        '<td  style="width:25%;">' + message.buildDate + '</td>' +
                        '<td  style="width:50%;">' + message.content.text.substring(0, 20) + '</td>' +
                        '<td><span class="showInfo"><a href="javascript:;" onclick="MessageInfo(' + message.link.text + ')">查看</a></span><span><a href="javascript:;" onclick="doDeleteMessage(' + message.link.text + ')">删除</a></span></td>' +
                    '</tr>');
                })
            }
            else {
                $("tbody").append('<tr>' +
                       '<th><input type="checkbox"  name="select_item" value="' + item.link.text + '"></th>' +
                       '<td  style="width:25%;">' + item.buildDate + '</td>' +
                       '<td style="width:50%;">' + item.content.text.substring(0, 20) + '</td>' +
                       '<td><span class="showInfo"><a href="javascript:;" onclick="MessageInfo(' + item.link.text + ')">查看</a></span><span><a href="javascript:;" onclick="doDeleteMessage(' + item.link.text + ')">删除</a></span></td>' +
                   '</tr>');
            }
            /* 加载分页数据 */
            LoadPage($result.channel.page, $("#page"));
        }
    })
}
refreshMessageList();
/*--------数据列表  end--------*/
/* 分页查询 */
var LoadData = function ($page) {
    pageIndex = $page;
    refreshMessageList();
}
/*--------单条数据查看  start--------*/
function MessageInfo(link) {
    $.getJSON("/action/itemlist?m=message&type=json&isauthor=true&isShowContent=true&i=" + link, function ($result) {
        var item = [], replayHtml = "";
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            $('#showMessageInfo').html("");
            if (!!item.description) {
                replayHtml = '<div  class="messageDialog">' +
                                                    '<div><label>管理员回复：</label></div>' +
                                                    '<div>' + item.description.text + '</div>' +
                                                    '<div  class="pull-right">' + item.lasteditdate.text + '</div>' +
                                                '</div>';
            }
            $('#showMessageInfo').append('<div>' +
                                    '<div class="messageDialog messageDialogFirst">' +
                                        '<div>' +
                                            '<label>您对管理员说：</label>' +
                                        '</div>' +
                                        '<div>' + item.content.text + '</div>' +
                                        '<div class="pull-right">' + item.lastexaminedate.text + '</div>' +
                                    '</div>' +
                                    replayHtml +
                                '</div>');
            Kplus.message("留言详情", $('#showMessageInfo').html());
        }
    })

    //$('#showMessageInfo').dialog({ height: 300, width: 600, title: '留言详情', modal: true });
    //$(".ui-dialog-titlebar-close > button").remove();
    //var newBtn = $('<button type="button" style="background:#fff;border:0;" '
    //    + 'class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" '
    //    + 'role="button" title="Close">'
    //    + '<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">关闭</span>'
    //    + '</button>');
    //$(".ui-dialog-titlebar").append(newBtn);

    //newBtn.on('click', function () {
    //    $('#showMessageInfo').dialog('close');
    //});
}
/*--------单条数据查看  end--------*/

/*--------批量删除  start--------*/
function doBatchDeleteMessages() {
    var $item = $("input[name='select_item']"), links = "";

    for (var i = 0; i < $item.length; i++) {
        if ($item[i].checked) {
            links += $item[i].value + ",";
        }
    }
    links = links.substring(0, links.length - 1);

    if (links == "") {
        Kplus.alert("温馨提示", "请先选中需要删除的数据！");
        return false;
    }

    doDeleteMessage(links);
}
/*--------批量删除  end--------*/

/*--------删除  start--------*/
function doDeleteMessage(links) {
    Kplus.alert("温馨提示", "确认删除选中数据吗？", function () {
        $.ajax({
            url: "/action/itemlist?m=message",
            type: "POST",
            data: "<form><system_delete>" + links + "</system_delete><isnext>false</isnext></form>",
            processData: false,
            async: false,
            dataType: "text",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (data) {
                var state = $(data).find("item").find("return").text();
                var msg = $(data).find("item").find("message").text();
                if (state == "success") {
                    $("#messageChoose").click();
                    $(".btn-default").click();
                    return true;
                } else if (state == "fail") {
                    return true;
                }
            },
            error: function (data) {
                Kplus.alert("服务器繁忙，请稍后重试！");
                return false;
            }
        });
    });
};
/*--------删除  end--------*/

/*--------留言弹出框  end--------*/
function doAddMessage() {
    //$('#addMessage').dialog({ height: 350, width: 600, title: '留言', modal: true });
    //$(".ui-dialog-titlebar-close > button").remove();
    //var newBtn = $('<button type="button" style="background:#fff;border:0;" '
    //    + 'class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" '
    //    + 'role="button" title="Close">'
    //    + '<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">关闭</span>'
    //    + '</button>');
    //$(".ui-dialog-titlebar").append(newBtn);

    //newBtn.on('click', function () {
    //    $('#addMessage').dialog('close');
    //});
    $(".dialog").html("");
    Kplus.message("留言", $('#addMessage').html());
}
/*--------留言弹出框  end--------*/

