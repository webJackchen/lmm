$(function () {
    var panelId = '_panelId_',
        ctrlObj = $('#' + panelId).children(".customer-services"),
        ue = null,
        __xmppIsOpen = false,
        timeLimit = ctrlObj.data('limit'),
        allowPush = ctrlObj.data('allowpush') !== false ? true : false;

    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return document.cookie.substring(c_start, c_end);
            }
        }
        return ""
    }

    var getMessageText = function (html) {
        var matches = html.match(/<[^<>]+>/gm);
        $.each(matches, function (i, m) {
            if (!/<(area|base|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)[^<>]+>/.exec(m))
                html = html.replace(m, '');
        });
        html = html.replace(/[\n]/ig, '');
        return html;
    }

    if (window.lanh) {
        setTimeout(function () {
            ctrlObj.find('.region').hide();
            ctrlObj.parents('div[id*="oper_"]').css({
                left: 'auto',
                'z-index': 9999999,
                right: '-5px'
            });
        }, 200);
        return false;
    }


    var settingFloat = function () {
        ctrlObj.find('.region').hide();
        ctrlObj
            .appendTo('body')
            .css({
                position: 'fixed',
                top: '35%',
                right: 0
            });
        ctrlObj.find('#lnk_toggle')
            .hover(function () {
                if (ctrlObj.find('.region').css('display') === 'none') {
                    ctrlObj.find('.region').show();
                }
                $(document).click(function () {
                    ctrlObj.find('.region').hide();
                });
            });
    }
    settingFloat();

    var showMessageWin = function () {
        if ($('.ui-dialog').length && $('.ui-dialog').find('#msg_region').length) {
            $('#msg_region').dialog('open');
        }
        else {
            $('#msg_region').dialog({ height: 600, width: 650, title: '在线客服', modal: true });
            $(".ui-dialog-titlebar > button").remove();
            var newBtn = $('<button type="button" style="background:#fff;border:0;" '
                + 'class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-dialog-titlebar-close" '
                + 'role="button" title="Close">'
                + '<span class="ui-button-icon-primary ui-icon ui-icon-closethick"></span><span class="ui-button-text">关闭</span>'
                + '</button>');
            $(".ui-dialog-titlebar").append(newBtn);

            newBtn.on('click', function () {
                $('#msg_region').dialog('close');
            });
        }

    }


    ctrlObj.find('#lnk_region').on('click', function () {
        //ctrlObj.find('#msg_region').show();
        showMessageWin();
        //if (!allowPush) {
        //    initObject();
        //}
        init();
    });

    $('#msg_region #btnSend').on('click', function () {
        if (ue) {
            var msgHtml = getMessageText(ue.getContent());
            if (msgHtml) {
                $('#msg_region #txtOldMessage').append($('<p>' + '【您】：' + msgHtml + '</p><hr/>'));
                __doSend('service', msgHtml);
                setSendState(this);
                ue.setContent('');
                settingScroll();
            }
            else {
                alert('不能发送空消息');
                return;
            }
        }
    });

    $('#msg_region #btnClear').on('click', function () {
        var msgText = $('#msg_region #txtOldMessage').html();
        if (msgText && confirm('确定要清空聊天记录？')) {
            $('#msg_region #txtOldMessage').empty();
        }
    });

    var setSendState = function (btnSend) {
        $(btnSend).attr('disabled', true);
        setCounter(function (count) {
            if (count !== undefined) {
                $(btnSend).text(timeLimit - (count + 1) + 's');
            }
            else {
                $(btnSend).attr('disabled', false);
                $(btnSend).text('发送');
            }
        }, timeLimit || 0);
    }


    /*获取Flash对象*/
    function thisMovie() {
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            return document['XmppFlash'][0];
        } else {
            return document['XmppFlash'];
        }
    }

    function settingScroll() {
        var divContainer = $('#msg_region #txtOldMessage'),
            hostoryHeight = divContainer.height();
        divContainer.scrollTop(divContainer.get(0).scrollHeight - 10);
    }

    window.__doShowMessage = function __doShowMessage(user, text) {
        console.log(text);
        if (text) {
            var receivMsg = '【管理员】：' + text;//(user === 'service' ? '【管理员】：' : user + '：') + text;
            showMessageWin();
            $('#msg_region #txtOldMessage').append($('<p>' + receivMsg + '</p><hr/>'));
            settingScroll();
        }
    }

    /*获得连接Xmpp服务器状态由Flash自动调取*/
    window.__doShowXmppSystem = function __doShowXmppSystem(text) {
        console.log(text);
        if ("Login:OK" == text) {
            __xmppIsOpen = true;
        } else {
            if (text.indexOf("conflict") > -1) {
                console.log("您的账号已经登录消息服务器，是否强制登录？");
                return false;
            }
            if (text.indexOf("Error #2002") > -1) {
                console.log("连接超时，是否重新连接？");
                return false;
            }
            if (text.indexOf("errorCode:400") > -1) {
                console.log("连接错误，是否重新连接？");
                return false;
            }
            if (text.indexOf("Login:Closed") > -1) {
                console.log("连接断开，是否重新连接？");
                return false;
            }
            if (text.indexOf("onError:") > -1) {
                return false;
            }
            if (text.indexOf("<properties") > -1) {
                return false;
            }
            //OptionKill();
        }
    }
    function OptionKill() {
        try {
            if (thisMovie() && thisMovie().LoginKill)
                thisMovie().LoginKill();
        } catch (ev) { }
        return true;
    }
    /*发送消息*/
    function __doSend(touser, text) {
        //if (__xmppIsOpen) {
        /*需要重新加载聊天记录*/
        //__reLoadHistory = true;
        if (text && thisMovie() && thisMovie().Send) {
            var sendMsg = thisMovie().Send(touser, text);
            console.warn(sendMsg);
        }
        //if (touser != "all") {
        //    showMessage("m" + Kplus.UID, text);
        //}
        //} else {
        //   console.log("正在连接到服务器，请稍后再试！");
        //}
    }

    var setTrigger = function (callback, delay) {
        var trigger = setTimeout(function () {
            var result = callback && callback();
            if (result === false) clearTimeout(trigger);
        }, delay || 0);
    }

    var setTimer = function (callback, delay) {
        var timer = setInterval(function () {
            var result = callback && callback();
            if (result === false) clearTimeout(timer);
        }, delay || 0);
    }


    var setCounter = function (callback, timeSpan) {
        var count = 0;
        setTimer(function () {
            if ((count + 1) == timeSpan || count == timeSpan) {
                callback && callback();
                return false;
            }
            callback && callback(count);
            count++;
        }, 1000);
    }


    var init = function () {
        ctrlObj.find('#msg_tabs').tabs();
        if (ue) ue.destroy();

        ue = UE.getEditor('msgEditor', {
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: getCookie('user.info') ? [['insertimage', 'emotion']] : [['emotion']],
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: false,
            //关闭elementPath
            elementPathEnabled: false,
            //默认的编辑区域高度
            initialFrameHeight: 80,
            emotionLocalization: true, //是否开启表情本地化，默认关闭。若要开启请确保emotion文件夹下包含官网提供的images表情文件夹
            serverUrl: '',
            imageUrl: "/action/file_up/?type=image&outtype=json",             //图片上传提交地址
            imagePath: "/",
            imageFieldName: "upfile",
            enableAutoSave: false
            //更多其他参数，请参考ueditor.config.js中的配置项
        });

        if (allowPush) {
            initObject();
        }
    },
    initObject = function () {
        var xmppServerUrl = 'qy{kId}.im.kplus.iwanqi.cn';
        if (Kplus.xmppUrl) xmppServerUrl = 'qy{kId}.' + Kplus.xmppUrl;
        xmppServerUrl += '&username={uId}$web&userpass=123456&consumer={kId}';

        if (ctrlObj.find('#XmppFlash').length) {
            ctrlObj.find('#XmppFlash').remove();
        }

        var xmppFlashObj = '<object id="XmppFlash" name="XmppFlash" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
            + 'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" width="1" height="1">'
            + '<param name="movie" value="/js/kdesign/ueditor/third-party/swf/main.swf?server=' + xmppServerUrl + '" />'
            + '<param name="quality" value="high" />'
            + '<param name="loop" value="false" />'
            + '<param name="scale" value="noscale" />'
            + '<param name="menu" value="false" />'
            + '<embed src="/js/kdesign/ueditor/third-party/swf/main.swf?server=' + xmppServerUrl + '" '
            + 'width="1" height="1" loop="false" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" '
            + 'salign="T" scale="noscale" name="XmppFlash" menu="false" />'
            + '</object>';
        var obj = $(xmppFlashObj),
            moviePara = obj.find('param[name="movie"]'),
            embedObj = obj.find('embed'),
            movieVal = moviePara.val(),
            embedSrc = embedObj.attr('src'),
            kid = window.location.host.split('.')[0],
            userInfo = getCookie('user.info'),
            //如果是会员登录就必须加上m前缀
            userId = encodeURIComponent('guest#' + (new Date()).valueOf().toString().substring(0, 10));
        if (!!userInfo) {
            userId = 'm' + userInfo.split("$")[0];
        }
        var newMovieVal = movieVal.replace(new RegExp('{kId}', 'g'), kid).replace('{uId}', userId),
            newEmbedSrc = embedSrc.replace(new RegExp('{kId}', 'g'), kid).replace('{uId}', userId);
        moviePara.attr({
            value: newMovieVal
        });
        embedObj.attr({
            src: newEmbedSrc
        });
        ctrlObj.append(obj);
        //var timer = setInterval(function () {
        //    if (thisMovie().Send) {
        //        obj.hide();
        //        clearInterval(timer);
        //    }
        //});
    };



    init();
});