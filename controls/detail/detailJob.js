var newsLink = "";
if (!window.lanh) {
    var url = window.location.pathname;
    newsLink = url.split('/')[url.split('/').length - 1].split('.')[0];
}


var initControlState = function () {
    var panelId = "_panelId_";
    var hasMemberSystem = $(document.body).data('turnedsmembersystem');
    var turnedJobApplication;
    $("#" + panelId).find('#btnApply').hide();
    if (hasMemberSystem) {
        var timer = setInterval(function () {
            turnedJobApplication = $(document.body).data('turnedjobapplication');
            if (turnedJobApplication !== undefined) {
                if (turnedJobApplication) {
                    $("#" + panelId).find('#btnApply').show();
                } else {
                    $("#" + panelId).find('#btnApply').hide();
                }
                clearInterval(timer);
            }
        }, 200)
    }
};
initControlState();



function doSubmitJob() {

    var _fileUrl = "";
    var _name = $(".ui-dialog #name").val(),
        _phone = $(".ui-dialog #phone").val(),
        _file = $(".ui-dialog #file").val();

    if (_name == "") {
        $(".ui-dialog #nameVerify").text("姓名不能为空");
        $(".ui-dialog #nameVerify").show();
    }
    if (!/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(_phone)) {
        $(".ui-dialog #phoneVerify").show();
        $(".ui-dialog #phoneVerify").html("请填写正确手机");
        return;
    }
    if (_phone == "") {
        $(".ui-dialog #phoneVerify").text("手机不能为空");
        $(".ui-dialog #phoneVerify").show();
    }
    if (_file == "") {
        $(".ui-dialog #fileVerify").text("简历不能为空");
        $(".ui-dialog #fileVerify").show();
        return;
    } else {
        var _fileEx = _file.split('.')[_file.split('.').length - 1];
        if (_fileEx != "doc" && _fileEx != "docx" && _fileEx != "rar" && _fileEx != "zip" && _fileEx != "7z") {
            $(".ui-dialog #fileVerify").text("简历格式为doc、docx、rar、zip、7z");
            $(".ui-dialog #fileVerify").show();
            return;
        }
        //var file = new File();
        //file.url = _file;
        //if (file.fileSize > 1024) {
        //    $(".ui-dialog #fileVerify").text("简历文件大小应小于10M");
        //    $(".ui-dialog #fileVerify").show();
        //    return;
        //}

        $.ajaxFileUpload({
            url: "/action/file_up/?type=enclosure&outtype=json",
            secureuri: true,
            fileElementId: 'fileInput',
            success: function (data) {
                var _data = JSON.parse(data.body.textContent);
                _fileUrl = _data.url;
                if (_fileUrl == "" || _fileUrl == undefined) {
                    return;
                }
                var url = "/action/ItemReplyEdit?m=job";

                var data = "<form><reply><![CDATA[" + newsLink + "]]></reply>" +
                    "<title><![CDATA[" + _name + "]]></title>" +
                    "<mobilephone><![CDATA[" + _phone + "]]></mobilephone>" +
                    "<enclosure><![CDATA[/" + _fileUrl + "]]></enclosure></form>";

                $.ajax({
                    url: url,
                    type: "POST",
                    data: data,
                    processData: false,
                    async: false,
                    dataType: "text",
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    beforeSend: function () {
                        $(".ui-dialog  .job-apply-content .btn-resume").addClass("disabled");
                    },
                    success: function (data) {
                        var state = $(data).find("item").find("return").text();
                        var msg = $(data).find("item").find("message").text();
                        if (state == "success") {
                            $(".ui-dialog #fileVerify").text("简历提交成功");
                            $(".ui-dialog #fileVerify").show();
                            setTimeout(function () {
                                //$(".ui-dialog-titlebar-close").click();
                                window.location.reload();
                            }, 1000);
                        } else if (state == "fail") {
                            $(".ui-dialog #fileVerify").text(msg);
                            $(".ui-dialog #fileVerify").show();
                        }
                        else {
                            $(".ui-dialog #fileVerify").text(msg);
                            $(".ui-dialog #fileVerify").show();
                        }
                        $(".ui-dialog .job-apply-content .btn-resume").removeClass("disabled");
                    },
                    error: function (data) {
                        $(".ui-dialog #textVerify").text("服务器繁忙，请稍后重试！");
                        $(".ui-dialog #textVerify").show();
                        $(".ui-dialog .job-apply-content .btn-resume").removeClass("disabled");
                        return false;
                    }
                });
            }, error: function (data, status, e) {
                return;
            }
        });
    }



};

function jobDialog() {
    if (!$.cookie("user.info")) {
        $(".ui-dialog").modal('hide');
        $(".ui-dialog").find(".loginContainer").dialog('open');
        return;
    }

    $(".ui-dialog").html("");
    $('#job-apply').dialog({ height: 280, width: 390, title: '职位申请', modal: true });
    $(".ui-dialog-titlebar-close > button").remove();
    var newBtn = $('<button type="button" style="background:#fff;border:0;" '
        + 'class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" '
        + 'role="button" title="Close">'
        + '<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">关闭</span>'
        + '</button>');
    $(".ui-dialog-titlebar").append(newBtn);

    newBtn.on('click', function () {
        $('#job-apply').dialog('close');
    });
}

function promptHide(prompt) {
    $(".ui-dialog #" + prompt).hide();
}

function fileInputChange() {
    $(".ui-dialog #file").val($(".ui-dialog #fileInput").val());

    if ($(".ui-dialog #file").val() != "") {
        promptHide("fileVerify");
    }
}
