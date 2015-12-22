/*--------数据列表  start--------*/
$.getJSON("/action/ItemListReply?m=goods&channel=0&type=json&isauthor=true&isShowContent=true", function ($result) {
    var item = [];
    if (!!$result && !!$result.channel && !!$result.channel.item) {
        item = $result.channel.item;
        pageTotal = $result.channel.page.allPageCount;

        if (item.length > 0) {
            $("tbody").html("");
            $.each(item, function (i, comment) {
                $("tbody").append('<tr>' +
                    '<td  style="width:15%;">' + comment.buildDate.split(' ')[0] + '</td>' +
                    '<td  style="width:10%;"> <img alt="" src="/80_80_1' + comment.replyImage.text.split('|')[0] + '" /></td>' +
                    '<td  style="width:30%;line-height: 25px !important;text-align: left;"><span>' + comment.replyTitle.text.substring(0, 40) + '</span></td>' +
                    '<td  style="width:35%;">' + comment.content.text.substring(0, 20) + '</td>' +
                    '<td><span class="showInfo"><a href="javascript:;" onclick="MessageInfo(\'' + escape(comment.description.text) + '\',\'' + comment.authorEdit.dateTime.split(' ')[0] + '\',\'' + escape(comment.content.text) + '\',\'' + comment.buildDate.split(' ')[0] + '\')">查看</a></span></td>' +
                '</tr>');
            })
        }
        else {
            $("tbody").append('<tr>' +
                   '<td  style="width:15%;">' + item.buildDate.split(' ')[0] + '</td>' +
                    '<td  style="width:10%;"> <img alt="" src="/80_80_1' + item.replyImage.text.split('|')[0] + '" /></td>' +
                    '<td  style="width:30%;"line-height: 25px !important;text-align: left;><span>' + item.replyTitle.text.substring(0, 40) + '</span></td>' +
                    '<td  style="width:35%;">' + item.content.text.substring(0, 20) + '</td>' +
                    '<td><span class="showInfo"><a href="javascript:;" onclick="MessageInfo(\'' + escape(item.description.text) + '\',\'' + item.authorEdit.dateTime.split(' ')[0] + '\',\'' + escape(item.content.text) + '\',\'' + item.buildDate.split(' ')[0] + '\')">查看</a></span></td>' +
               '</tr>');
        }
    }
})
/*--------数据列表  end--------*/

/*--------单条数据查看  start--------*/
//function MessageInfo(link) {
//    $.getJSON("/action/ItemListReply?m=goods&type=json&isauthor=true&isShowContent=true&i=" + link, function ($result) {
//        var item = [], replayHtml = "";
//        if (!!$result && !!$result.channel && !!$result.channel.item) {
//            item = $result.channel.item;
//            $('#showCommentInfo').html("");
//            if (!!item.description) {
//                replayHtml = '<div  class="messageDialog">' +
//                                                    '<div><label>管理员回复：</label></div>' +
//                                                    '<div>' + item.description.text + '</div>' +
//                                                    '<div  class="pull-right">' + item.lasteditdate.text.split(' ')[0].replace("/", "-").replace("/", "-") + '</div>' +
//                                                '</div>';
//            }
//            $('#showCommentInfo').append('<div>' +
//                                    '<div class="messageDialog messageDialogFirst">' +
//                                        '<div>' +
//                                            '<label>您对管理员说：</label>' +
//                                        '</div>' +
//                                        '<div>' + item.content.text + '</div>' +
//                                        '<div class="pull-right">' + item.pubdate.text + '</div>' +
//                                    '</div>' +
//                                    replayHtml +
//                                '</div>');
//            Kplus.message("评价详情", $('#showCommentInfo').html());
//        }
//    })
//}
function MessageInfo(_description, _lasteditdate, _content, _pubdate) {
    var replayHtml = "";
    $('#showCommentInfo').html("");
    if (_description != "") {
        replayHtml = '<div  class="messageDialog">' +
                                            '<div><label>管理员回复：</label></div>' +
                                            '<div>' + _description + '</div>' +
                                            '<div  class="pull-right">' + _lasteditdate + '</div>' +
                                        '</div>';
    }
    $('#showCommentInfo').append('<div>' +
                            '<div class="messageDialog messageDialogFirst">' +
                                '<div>' +
                                    '<label>您对管理员说：</label>' +
                                '</div>' +
                                '<div>' + _content + '</div>' +
                                '<div class="pull-right">' + _pubdate + '</div>' +
                            '</div>' +
                            replayHtml +
                        '</div>');
    Kplus.message("评价详情", unescape($('#showCommentInfo').html()));
}
/*--------单条数据查看  end--------*/



