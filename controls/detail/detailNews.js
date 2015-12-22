$("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());

function verifyCode() {
    $("#imgVerifyCode").attr("src", "/action/Verify?st=" + Math.random());
}

$(function () {
    if (!window.lanh) {
        var panelId = "_panelId_";
        $("#" + panelId).css({ position: 'relative' });
        initControlState(panelId);
    }
});

var initControlState = function (panelId) {
    var hasMemberSystem = $(document.body).data('turnedsmembersystem');
    var turnedArticleComments;
    $("#" + panelId).find('#commentDiv').hide();
    if (hasMemberSystem) {
        var timer = setInterval(function () {
            turnedArticleComments = $(document.body).data('turnedarticlecomments');
            if (turnedArticleComments !== undefined) {
                if (turnedArticleComments) {
                    $("#" + panelId).find('#commentDiv').show();
                    $("#" + panelId).find('#commentDiv .common').show();
                } else {
                    $("#" + panelId).find('#commentDiv').hide();
                    $("#" + panelId).find('#commentDiv .common').hide();
                }
                clearInterval(timer);
            }
        }, 200);
    }
};


var newsLink = "";
if (!window.lanh) {
    var url = window.location.pathname;
    newsLink = url.split('/')[url.split('/').length - 1].split('.')[0];
    $.getJSON("/action/ItemListReply?m=news&channel=0&type=json&isShowContent=true&i=" + newsLink, function ($result) {
        var item = [];
        if (!!$result && !!$result.channel && !!$result.channel.item) {
            item = $result.channel.item;
            pageTotal = $result.channel.page.allPageCount;
            $(".common-content").html("");
            if (item.length > 0) {
                $.each(item, function (i, comment) {
                    if (comment.special.isExamine == 1) {
                        return;
                    }
                    var author = "";
                    if (comment.moduleInfo.nickname.text != "") {
                        author = comment.moduleInfo.nickname.text;
                    } else if (comment.moduleInfo.nickname.text == "" && comment.moduleInfo.username.text != "") {
                        author = comment.moduleInfo.username.text;
                    }
                    $(".common-content").append('<li>' +
                            '<div class="common-border">' +
                             '<div>' + author + '：</div>' +
                            '<span>' + comment.content.text + '</span>' +
                            '</div><div class="common-replydiv">' +
                            '<span class="common-reply"><label>管理员回复：</label>' + comment.description.text + '</span>' +
                            '</div>' +
                        '</li>');
                })
            }
            else {
                if (item.special.isExamine == 1) {
                    return;
                }
                var author = "";
                if (item.moduleInfo.nickname.text != "") {
                    author = item.moduleInfo.nickname.text;
                } else if (item.moduleInfo.nickname.text == "" && item.moduleInfo.username.text != "") {
                    author = item.moduleInfo.username.text;
                }
                $(".common-content").append('<li>' +
                           '<div class="common-border">' +
                           '<div>' + author + '：</div>' +
                            '<span>' + item.content.text + '</span>' +
                           '</div><div class="common-replydiv">' +
                           '<span class="common-reply"><label>管理员回复：</label>' + item.description.text + '</span>' +
                           '</div>' +
                       '</li>');
            }
        }
    })
}


function doSubmitComment() {
    if (!$.cookie("user.info")) {
        $(".ui-dialog").find(".loginContainer").dialog('open');
        return;
    }

    var _content = $(".add-common-content textarea").val(),
          _verify = $("#txtVerifyCode").val();

    if (_content == "") {
        $("#textVerify").text("评论内容不能为空");
        $("#textVerify").show();
        return;
    }

    var url = "/action/ItemReplyEdit?m=news";

    var data = "<form><reply><![CDATA[" + newsLink + "]]></reply><content><![CDATA[" + _content + "]]></content><verify><![CDATA[" + _verify + "]]></verify></form>";

    $.ajax({
        url: url,
        type: "POST",
        data: data,
        processData: false,
        async: false,
        dataType: "text",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        beforeSend: function () {
            $(".add-common-content-button a:first-child").addClass("disabled");
        },
        success: function (data) {
            var state = $(data).find("item").find("return").text();
            var msg = $(data).find("item").find("message").text();
            if (state == "success") {
                $("#textVerify").text("评论成功");
                $("#textVerify").show();
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            } else if (state == "fail") {
                $("#textVerify").text(msg);
                $("#textVerify").show();
            }
            else {
                $("#textVerify").text(msg);
                $("#textVerify").show();
            }
            $(".add-common-content-button a:first-child").removeClass("disabled");
        },
        error: function (data) {
            //Kplus.alert("服务器繁忙，请稍后重试！");
            $("#textVerify").text("服务器繁忙，请稍后重试！");
            $("#textVerify").show();
            $(".add-common-content-button a:first-child").removeClass("disabled");
            return false;
        }
    });
};

function clearText() {
    $(".add-common-content textarea").val("");
}

function promptHide() {
    $("#textVerify").hide();
}

function words_deal() {
    var curLength = $(".add-common-content textarea").val().length, count = 0;
    if (curLength > 150) {
        var content = $(".add-common-content textarea").val().substr(0, 150);
        $(".add-common-content textarea").val(content);
    }
    else {
        count = 150 - $(".add-common-content textarea").val().length;
        $("#wordVerify").text("(" + count + "/150)");
    }
}
