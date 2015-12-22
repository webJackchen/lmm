(function ($) {
    /*判断是否跳转，以后如果需要根据参数调整其他页面，可以修改此代码，获取jump的值*/
    var isJump = /jump=[a-z]+($|&)/.exec(window.location.search);
    var initView = 'index';
    if (isJump) {
        initView = isJump[0].split('=')[1];
    }

    var Kplus = {
        config: {
            iCont: $("#content").eq(0).size() > 0 ? $("#content").eq(0) : null /* 内容容器 入口标识：alink */

            , initURL: "views/" + initView /* 配置初始加载页面 */
            , complete: function () { } /* 页面请求成功的回调函数 */
            , isLoading: false /* 页面的加载状态 */
            , iActivePage: null /* 当前活动页面URL */

            , HostUrl: "http://" + window.location.host /* 域名地址 */
            , KID: $("#KID").val() /* 企业ID */
            , UID: $("#UID").val() /* 用户ID */
            , UName: $("#UName").val() /* 用户名 */
        }
        , init: function () {
            var that = this,
                $iCont = that.config.iCont,
                url = that.config.initURL;

            if (!that.isNullOrEmpty(that.getUrlParam(document.location.search, "url")) && !that.isNullOrEmpty(that.getUrlParam(document.location.search, "email")) && !that.isNullOrEmpty(that.getUrlParam(document.location.search, "code"))) {
                url = that.getUrlParam(document.location.search, "url");
            }
            that.loadPage(url, $iCont, true);

            /* 标签点击跳转 */
            $(document).on("click", ".alink", function (ev) {
                /* 阻止默认跳转事件 */
                ev.preventDefault();
                /* 判断是否正在加载 加载中则返回 */
                if (that.config.isLoading) {
                    return false;
                }
                var tg = ev.srcElement ? ev.srcElement : ev.target, type;

                tg = $(tg).closest("a")[0] || tg;
                if (tg == null) {
                    return false;
                }
                if ($(tg).attr("class").indexOf("alink") != -1) {
                    type = "alink";
                } else {
                    Kplus.prompt("标记错误！");
                    return false;
                }
                url = $(tg).attr("href") || $(tg).attr("data-href");

                Kplus.assemblyPara(url, tg, type);
            });
            /* 输入页码跳转 */
            $(document).on("change", ".page-skip", function (ev) {
                /* 判断是否正在加载 加载中则返回 */
                if (that.config.isLoading) {
                    return false;
                }
                var tg = ev.srcElement ? ev.srcElement : ev.target, type, nowpage, totalpage;

                if (tg == null) {
                    return false;
                }
                type = $(tg).attr("data-skip");
                nowpage = $(tg).val();
                totalpage = $(tg).attr("data-page");
                if (type == "alink") {
                } else {
                    Kplus.prompt("标记错误！");
                    return false;
                }
                /* 页码错误、小于1、大于总页数时不跳转 */
                if (Kplus.isNullOrEmpty(nowpage) || parseInt(nowpage) < 1 || parseInt(nowpage) > parseInt(totalpage)) {
                    return;
                }
                url = $(tg).attr("data-href")
                url = url + "&p=" + nowpage;

                Kplus.assemblyPara(url, tg, type);
            });
        }
        , assemblyPara: function (url, tg, type) {
            var that = this;
            /* 加上随机数 */
            var ts = Math.random();
            if (url.indexOf("?") != -1) {
                url += "&ts=" + ts;
            } else {
                url += "?ts=" + ts;
            }
            /* 处理查询 */
            if (url.indexOf("titleKey") != -1) {
                if (url.indexOf("/goods/order_list") != -1) {
                    var _time = $("#txt_Time"),
                        _orderId = $("#orderId"),
                        _isExamine = $("#isExamine").val(),
                        _target = $("#target").val(),
                        _where = "";

                    if (!Kplus.isNullOrEmpty(_time.val()) && _time.val() != _time.attr("placeholder")) {
                        var _array = _time.val().split("-");

                        _where += "&st=" + _array[0].substring(0, _array[0].length - 1) + "&et=" + _array[1].substring(1, _array[1].length);
                    }
                    if (!Kplus.isNullOrEmpty(_isExamine)) {
                        _where += "&isexamine=" + _isExamine;
                    }
                    if (!Kplus.isNullOrEmpty(_target)) {
                        _where += "&target=" + _target;
                    }
                    if (!Kplus.isNullOrEmpty($.trim(_orderId.val())) && $.trim(_orderId.val()) != _orderId.attr("placeholder")) {
                        _where += "&orderId=" + $.trim(_orderId.val());
                    }
                    url = url.replace("titleKey=", "1=1" + _where);
                } else {
                    var _title = $("#titleKey");
                    if (Kplus.isNullOrEmpty($.trim(_title.val())) || $.trim(_title.val()) == _title.attr("placeholder")) {
                        url = url.replace("titleKey=", "1=1");
                    } else {
                        url = url.replace("titleKey=", "titleKey=" + encodeURI($.trim(_title.val())));
                    }
                }
            }
            url = url.replace("1=1&", "");
            switch (type) {
                case "alink":
                    that.loadPage(url, that.config.iCont, true, null);
                    break;
                default:
                    break;
            }
        }
        , loadPage: function (url, $obj, sv, fn) {
            var that = this,
                $iCont = $obj,
                callback = that.config.complete,
                suc = fn

            $.ajax({
                url: url,
                beforeSend: function () {
                    that.config.isLoading = true;
                    $("#shade").addClass("loading");
                },
                success: function (html) {
                    if (html.indexOf("<!DOCTYPE HTML PUBLIC") != -1) {
                        Kplus.prompt("页面加载失败！");
                        return false;
                    }
                    if (url == "views/index") {
                        $iCont.addClass("nopadding").removeClass("content-body");
                    } else if (!$iCont.hasClass("content-body")) {
                        $iCont.addClass("content-body").removeClass("nopadding");
                    }
                    $iCont.html(html);

                    if (suc && typeof suc == "function") {
                        suc();
                    }
                    /* 保存当前URL 用于返回 */
                    if (sv) {
                        that.config.iActivePage = url;
                    }
                    if (!Kplus.isNullOrEmpty(Kplus.getUrlParam(url, "phone"))) {
                        $("#txtPhone").val(Kplus.getUrlParam(url, "phone"));
                    }
                    if (!Kplus.isNullOrEmpty(Kplus.getUrlParam(url, "mail"))) {
                        $("#txtEmail").val(Kplus.getUrlParam(url, "mail"));
                    }

                    if (!that.isNullOrEmpty(that.getUrlParam(document.location.search, "url")) && !that.isNullOrEmpty(that.getUrlParam(document.location.search, "email")) && !that.isNullOrEmpty(that.getUrlParam(document.location.search, "code"))) {
                        var email = that.getUrlParam(document.location.search, "email"), code = that.getUrlParam(document.location.search, "code");

                        $(".progress-bar").css("width", "66.67%");
                        $("#background_2").text("");
                        $("#background_2").removeClass("background_h");
                        $("#background_2").addClass("background_ok");
                        $("#health_descript_1").addClass("hidden");
                        $("#health_descript_2").removeClass("hidden");

                        $(".verifysec strong").html("已发送验证邮件至：" + email);
                        $.ajax({
                            url: "/action/sendemail",
                            type: "POST",
                            data: "<form><sendtype>verifyemail</sendtype><email><![CDATA[" + email + "]]></email><code><![CDATA[" + code + "]]></code></form>",
                            dataType: "xml",
                            success: function ($result) {
                                var $state, $message;
                                $($result).find("item").each(function () {
                                    var $field = $(this);
                                    $state = $field.find("return").text(); /* 状态 */
                                    $message = $field.find("message").text(); /* 消息 */
                                });
                                if ($state == "success") {
                                    $(".progress-bar").css("width", "100%");
                                    $("#background_2").text("");
                                    $("#background_2").removeClass("background_h");
                                    $("#background_2").addClass("background_ok");
                                    $("#health_descript_2").addClass("hidden");
                                    $("#health_descript_3").removeClass("hidden");
                                    setTimeout(function () {
                                        $("#health_descript_3 a.alink").click();
                                    }, 5000);
                                } else {
                                    Kplus.prompt($message, "danger");
                                }
                            },
                            error: function () {
                                Kplus.prompt("服务器繁忙，请稍后重试！", "danger");
                                return false;
                            }
                        });
                    }
                },
                error: function () {
                    Kplus.prompt("页面加载失败！");
                    $("#shade").removeClass("loading");
                    that.config.isLoading = false;
                },
                complete: function () {
                    callback();
                    $("#shade").removeClass("loading");
                    that.config.isLoading = false;
                }
            });
        }
        , loadUrl: function (url, fn) {
            var that = this, suc = fn;

            $.ajax({
                url: url,
                beforeSend: function () {
                    $("#shade").addClass("loading");
                },
                success: function (html) {
                    if (suc && typeof suc == "function") {
                        suc(html);
                    }
                },
                error: function () {
                    Kplus.prompt("页面加载失败！", "danger");
                },
                complete: function () {
                    $("#shade").removeClass("loading");
                }
            });
        }
        /* 判断是否为NULL、空、undefined _val 值 */
        , isNullOrEmpty: function (_val) {
            if (_val == null || $.trim(_val) == "" || _val == undefined || _val == "undefined") {
                return true;
            }
            return false;
        }
        /* 判断是否是数字 _val 值 */
        , isNumber: function (_val) {
            if (_val == null || $.trim(_val) == "" || _val == undefined || _val == "undefined" || !/^\d+$/.test(_val)) {
                return false;
            }
            return true;
        }
        /* 生成一个惟一的ID */
        , random: function (a, b) {
            return Math.random() > 0.5 ? -1 : 1;
        }
        /* 获取一个随机ID */
        , getID: function () {
            return "div-" + ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'q', 'W', 'w', 'E', 'e', 'R', 'r', 'T', 't', 'Y', 'y', 'U', 'u', 'I', 'i', 'O', 'o', 'P', 'p', 'A', 'a', 'S', 's', 'D', 'd', 'F', 'f', 'G', 'g', 'H', 'h', 'J', 'j', 'K', 'k', 'L', 'l', 'Z', 'z', 'X', 'x', 'C', 'c', 'V', 'v', 'B', 'b', 'N', 'n', 'M', 'm'].sort(Kplus.random).join('').substring(5, 20);
        }
        /*
        * 获取URL参数值
        * _url 地址
        * _name 参数名
        */
        , getUrlParam: function (_url, _name) {
            var reg = new RegExp("(^|&)" + _name + "=([^&]*)(&|$)");
            var r = _url.substring(_url.indexOf("?") + 1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }
        /*
        * 弱提示弹窗
        * message 消息内容
        * type 类型 success=成功,info=信息,warning=警告,danger=危险
        */
        , prompt: function (message, type) {
            if (type == "success") {
                var msghtml = '<div class="alert alert-success fade in" role="alert"></div>';
                var $alert = $(msghtml);
                $(".palert").append($alert);
                $alert.html(message);
                $alert.alert();
                setTimeout(function () {
                    $alert.alert("close");
                }, 2000);
            } else if (type == "info") {
                var msghtml = '<div class="alert alert-info fade in" role="alert"></div>';
                var $alert = $(msghtml);
                $(".palert").append($alert);
                $alert.html(message);
                $alert.alert();
                setTimeout(function () {
                    $alert.alert("close");
                }, 2000);
            } else if (type == "warning") {
                var msghtml = '<div class="alert alert-warning fade in" role="alert"></div>';
                var $alert = $(msghtml);
                $(".palert").append($alert);
                $alert.html(message);
                $alert.alert();
                setTimeout(function () {
                    $alert.alert("close");
                }, 2000);
            } else if (type == "danger") {
                var msghtml = '<div class="alert alert-danger fade in" role="alert"></div>';
                var $alert = $(msghtml);
                $(".palert").append($alert);
                $alert.html(message);
                $alert.alert();
                setTimeout(function () {
                    $alert.alert("close");
                }, 2000);
            }
        }
        /*
        * 强提示弹窗
        * title 标题
        * message 消息内容
        * callback 回调函数
        * model 参数
        */
        , alert: function (title, message, callback, model) {
            if (!model) {
                model = {
                    dialogClass: "modal-sm",
                    ok: { text: "确定", classed: "btn-danger" },
                    cancel: { text: "取消", classed: "btn-default" }
                }
            }
            if (arguments.length < 2) {
                message = title || "";
                title = "警告";
            }
            if (Kplus.isNullOrEmpty(title)) {
                title = "警告";
            }

            $('<div class="hidden" id="' + Kplus.getID() + '"></div>').dialog({
                title: title
                , content: '<span class="red alert-jg">' + message + '</span>'
                , dialogClass: model.dialogClass || "modal-sm"
                , onClose: function () {
                    $(this).dialog("destroy");
                }
                , buttons: [{
                    text: model.ok.text || "确定"
                    , classed: model.ok.classed || "btn-danger"
                    , click: function () {
                        if (callback && callback()) {
                            $(this).dialog("destroy");
                        } else {
                            $(this).dialog("destroy");
                        }
                    }
                },
                {
                    text: model.cancel.text || "取消"
                    , classed: model.cancel.classed || "btn-default"
                    , click: function () {
                        $(this).dialog("destroy");
                    }
                }]
            });
        }
        /*
        * 确认提示弹窗
        * title 标题
        * message 消息内容
        * callback 回调函数
        * model 参数
        */
        , confirm: function (title, message, callback, model) {
            if (!model) {
                model = {
                    dialogClass: "modal-md",
                    ok: { text: "确定", classed: "btn-success" },
                    cancel: { text: "取消", classed: "btn-default" }
                }
            }
            $('<div class="hidden" id="' + Kplus.getID() + '"></div>').dialog({
                title: title
              , content: message
              , dialogClass: model.dialogClass || "modal-md"
              , onClose: function () {
                  $(this).dialog("destroy");
              }
              , buttons: [{
                  text: model.ok.text || "确定"
                  , classed: model.ok.classed || "btn-success"
                  , click: function () {
                      if (callback && callback()) {
                          $(this).dialog("destroy");
                      }
                  }
              },
                {
                    text: model.cancel.text || "取消"
                  , classed: model.cancel.classed || "btn-default"
                  , click: function () {
                      $(this).dialog("destroy");
                  }
                }]
            });
        }
         , message: function (title, message, callback) {
             $('<div class="hidden" id="' + Kplus.getID() + '"></div>').dialog({
                 title: title
                 , content: '<span class="red alert-jg">' + message + '</span>'
                 , onClose: function () {
                     $(this).dialog("destroy");
                 }
             });
         }
        , getCookie: function (c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=")
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1
                    c_end = document.cookie.indexOf(";", c_start)
                    if (c_end == -1) { c_end = document.cookie.length; }
                    return document.cookie.substring(c_start, c_end);
                }
            }
            return "";
        }

    } /* end Kplus */
    /* add Kplus to window */
    window.Kplus = Kplus;
})(jQuery);

Kplus.init();