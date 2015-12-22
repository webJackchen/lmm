(function () {
    var randstr = function (length) {
        var key = {

            str: [
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                'o', 'p', 'q', 'r', 's', 't', 'x', 'u', 'v', 'y', 'z', 'w', 'n',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
            ],

            randint: function (n, m) {
                var c = m - n + 1;
                var num = Math.random() * c + n;
                return Math.floor(num);
            },

            randStr: function () {
                var _this = this;
                var leng = _this.str.length - 1;
                var randkey = _this.randint(0, leng);
                return _this.str[randkey];
            },

            create: function (len) {
                var _this = this;
                var l = len || 10;
                var str = '';

                for (var i = 0 ; i < l ; i++) {
                    str += _this.randStr();
                }

                return str;
            }

        };

        length = length ? length : 10;

        return key.create(length);
    };

    var randint = function (n, m) {
        var c = m - n + 1;
        var num = Math.random() * c + n;
        return Math.floor(num);
    };

    var vCode = function (dom, options) {
        this.codeDoms = [];
        this.lineDoms = [];
        this.initOptions(options);
        this.dom = dom;
        this.init();
        this.addEvent();
        this.update();
        this.mask();
    };

    vCode.prototype.init = function () {
        this.dom.style.position = "relative";
        this.dom.style.overflow = "hidden";
        this.dom.style.cursor = "pointer";
        this.dom.title = "点击更换验证码";
        this.dom.style.background = this.options.bgColor;
        this.w = this.dom.clientWidth;
        this.h = this.dom.clientHeight;
        this.uW = this.w / this.options.len;
    };

    vCode.prototype.mask = function () {
        var dom = document.createElement("div");
        dom.style.cssText = [
            "width: 100%",
            "height: 100%",
            "left: 0",
            "top: 0",
            "position: absolute",
            "cursor: pointer",
            "z-index: 9999999"
        ].join(";");

        dom.title = "点击更换验证码";

        this.dom.appendChild(dom);
    };

    vCode.prototype.addEvent = function () {
        var _this = this;
        _this.dom.addEventListener("click", function () {
            _this.update.call(_this);
        });
    };

    vCode.prototype.initOptions = function (options) {

        var f = function () {
            this.len = 4;
            this.fontSizeMin = 20;
            this.fontSizeMax = 30;
            this.colors = [
                "green",
                "red",
                "blue",
                "#53da33",
                "#AA0000",
                "#FFBB00"
            ];
            this.bgColor = "#FFF";
            this.fonts = [
                "Times New Roman",
                "Georgia",
                "Serif",
                "sans-serif",
                "arial",
                "tahoma",
                "Hiragino Sans GB"
            ];
            this.lines = 8;
            this.lineColors = [
                "#888888",
                "#FF7744",
                "#888800",
                "#008888"
            ];

            this.lineHeightMin = 1;
            this.lineHeightMax = 3;
            this.lineWidthMin = 1;
            this.lineWidthMax = 60;
        };

        this.options = new f();

        if (typeof options === "object") {
            for (i in options) {
                this.options[i] = options[i];
            }
        }
    };

    vCode.prototype.update = function () {
        for (var i = 0; i < this.codeDoms.length; i++) {
            this.dom.removeChild(this.codeDoms[i]);
        }
        for (var i = 0; i < this.lineDoms.length; i++) {
            this.dom.removeChild(this.lineDoms[i]);
        }
        this.createCode();
        this.draw();
    };

    vCode.prototype.createCode = function () {
        this.code = randstr(this.options.len);
    };

    vCode.prototype.verify = function (code) {
        return this.code === code;
    };

    vCode.prototype.draw = function () {
        this.codeDoms = [];
        for (var i = 0; i < this.code.length; i++) {
            this.codeDoms.push(this.drawCode(this.code[i], i));
        }

        this.drawLines();
    };

    vCode.prototype.drawCode = function (code, index) {
        var dom = document.createElement("span");

        dom.style.cssText = [
            "font-size:" + randint(this.options.fontSizeMin, this.options.fontSizeMax) + "px",
            "color:" + this.options.colors[randint(0, this.options.colors.length - 1)],
            "position: absolute",
            "left:" + randint(this.uW * index, this.uW * index + this.uW - 10) + "px",
            "top:" + randint(0, this.h - 30) + "px",
            "transform:rotate(" + randint(-30, 30) + "deg)",
            "-ms-transform:rotate(" + randint(-30, 30) + "deg)",
            "-moz-transform:rotate(" + randint(-30, 30) + "deg)",
            "-webkit-transform:rotate(" + randint(-30, 30) + "deg)",
            "-o-transform:rotate(" + randint(-30, 30) + "deg)",
            "font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
            "font-weight:" + randint(400, 900)
        ].join(";");

        dom.innerHTML = code;
        this.dom.appendChild(dom);

        return dom;
    };

    vCode.prototype.drawLines = function () {
        this.lineDoms = [];
        for (var i = 0; i < this.options.lines; i++) {
            var dom = document.createElement("div");

            dom.style.cssText = [
                "position: absolute",
                "opacity: " + randint(3, 8) / 10,
                "width:" + randint(this.options.lineWidthMin, this.options.lineWidthMax) + "px",
                "height:" + randint(this.options.lineHeightMin, this.options.lineHeightMax) + "px",
                "background: " + this.options.lineColors[randint(0, this.options.lineColors.length - 1)],
                "left:" + randint(0, this.w - 20) + "px",
                "top:" + randint(0, this.h) + "px",
                "transform:rotate(" + randint(-30, 30) + "deg)",
                "-ms-transform:rotate(" + randint(-30, 30) + "deg)",
                "-moz-transform:rotate(" + randint(-30, 30) + "deg)",
                "-webkit-transform:rotate(" + randint(-30, 30) + "deg)",
                "-o-transform:rotate(" + randint(-30, 30) + "deg)",
                "font-family:" + this.options.fonts[randint(0, this.options.fonts.length - 1)],
                "font-weight:" + randint(400, 900)
            ].join(";");
            this.dom.appendChild(dom);

            this.lineDoms.push(dom);
        }
    };

    this.vCode = vCode;

}).call(this);


(function () {
    if (window.lanh) return false;


    var panelId = "_panelId_";
    var txtLoginName;
    var txtPassWord;
    var ckbKeep;
    var validCodDive;
    var validCode;
    var kidReg = /\d+\./.exec(window.location.host), kid;
    if (kidReg) kid = kidReg[0].replace(/\./, "");

    /*添加会员系统标识*/
    $(document.body).data('turnedsmembersystem', true);

    var setDialogStyle = function () {
        $(".ui-dialog").css({ "border-radius": "8px", "border": "0" });
        $(".ui-dialog-titlebar").remove();
    }

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

    var callLoginApi = function () {
        $.ajax({
            type: "POST",
            url: "http://" + window.location.host + "/action/memberlogin",
            data: "<form><userName><![CDATA[" + txtLoginName.val() + "]]></userName><userPassword><![CDATA[" + txtPassWord.val() + "]]></userPassword><isKeep>" + (ckbKeep.is(':checked') ? "true" : "false") + "</isKeep></form>",
            dataType: "text",
            success: function (result) {
                if (typeof result == 'string' && result.indexOf("$session") > 0) {
                    setLoginView();
                }
                else {
                    alert("账号或密码错误！");
                }
            },
            complete: function (xhr, ts) {
                loginDialog.dialog("close");
            }
        });
    }

    /*获取验证注册数据*/
    var getUniqueFieldkey = function (arr) {
        var hash = {},
            len = arr.length,
            result = [];
        $.each(arr, function (i, v) {
            var obj = $(v);
            if (!hash[obj.attr("fieldkey")]) {
                hash[obj.attr("fieldkey")] = true;
                result.push(obj.attr("fieldkey"));
            }
        });
        return result;
    }

    var getRegisterData = function () {
        var errorInfo = { failed: false, msg: "" };

        var data = "<form>";
        /*获取text*/
        var texts = $(".ui-dialog").find(".registerContainer").find("input[type='text']");
        if (texts && texts.length > 0) {
            $.each(texts, function (index, obj) {
                var text = $(obj);
                if (text.attr("id") !== "txtValidCode") {
                    data += "<" + text.attr("fieldkey") + "><![CDATA[" + text.val() + "]]></" + text.attr("fieldkey") + ">";
                }
            });
        }
        if (errorInfo.failed) {
            alert(errorInfo.msg);
            return null;
        }

        /*获取password*/
        var passwords = $(".ui-dialog").find(".registerContainer").find("input[type='password']");
        if (passwords && passwords.length > 0) {
            $.each(passwords, function (index, obj) {
                var password = $(obj);
                if (password.attr("excludefield") !== "true")
                    data += "<" + password.attr("fieldkey") + "><![CDATA[" + password.val() + "]]></" + password.attr("fieldkey") + ">";
            });
        }

        /*获取radio*/
        radios = null;
        radios = $(".ui-dialog").find(".registerContainer").find("input[type='radio']:checked");
        if (radios && radios.length > 0) {
            $.each(radios, function (index, obj) {
                var radio = $(obj);
                data += "<" + radio.attr("fieldkey") + "><![CDATA[" + radio.val() + "]]></" + radio.attr("fieldkey") + ">";
            });
        }

        /*获取checkboxes*/
        checkboxes = null;
        checkboxes = $(".ui-dialog").find(".registerContainer").find("input[type='checkbox']:checked");
        if (checkboxes && checkboxes.length > 0) {
            var keys = getUniqueFieldkey(checkboxes);
            if (keys) {
                $.each(keys, function (i, p) {
                    var vs = $.grep(checkboxes, function (obj, index) {
                        return $(obj).attr("fieldkey") == p;
                    });
                    if (vs && vs.length > 0) {
                        var value = "";
                        $.each(vs, function (index, obj) {
                            value += "," + $(obj).val();
                        });
                        data += "<" + p + "><![CDATA[" + value.slice(1) + "]]></" + p + ">";
                    }
                });
            }
        }

        data += "</form>";
        return data;
    }

    var verifyQQ = function (qq) {
        return RegExp(/^[1-9][0-9]{4,9}$/).test(qq);
    }

    var verifyUserName = function (username) {
        return RegExp(/^[1-9a-zA-Z_]{4,20}$/).test(username);
    }

    var verifyPassWord = function (password) {
        return RegExp(/^[1-9a-zA-Z]{4,}$/).test(password);
    }

    var verifyCardid = function (cardid) {
        return RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(cardid);
    }

    var verifyEmail = function (mail) {
        return RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(mail);
    }

    function verifyMobilePhone(mobilephone) {
        return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/).test(mobilephone);
    }

    var verifyRegisterData = function () {
        var errorInfo = { failed: false, msg: "" };

        var fields = $(".ui-dialog").find(".registerContainer").find("input[fieldkey]");
        if (fields && fields.length > 0) {
            $.each(fields, function (i, obj) {
                var control = $(obj);

                /*text*/
                if (control.attr("type") === "text" && control.attr("requiredfield") === "True" && control.val() === "") {
                    errorInfo.failed = true;
                    errorInfo.msg = "请输入" + control.attr("fieldtitle");
                    return false;
                }

                /*password*/
                if (control.attr("type") === "password" && control.attr("requiredfield") === "True") {
                    if (control.val() === "") {
                        errorInfo.failed = true;
                        errorInfo.msg = "请输入" + control.attr("fieldtitle");
                        return false;
                    }
                    else {
                        var passwords = $(".ui-dialog").find(".registerContainer").find("input[type='password']");
                        if (passwords && passwords.length > 0) {
                            if (passwords[0].value !== passwords[1].value) {
                                errorInfo.failed = true;
                                errorInfo.msg = "两次密码输入不一致！";
                                return false;
                            }
                        }
                    }
                }

                /*date*/
                if (control.attr("type") === "date" && control.attr("requiredfield") === "True" && control.val() === "") {
                    errorInfo.failed = true;
                    errorInfo.msg = "请输入" + control.attr("fieldtitle");
                    return false;
                }

                /*radio*/
                if (control.attr("type") === "radio" && control.attr("requiredfield") === "True") {
                    if (!control.is(':checked')) {
                        var checkedRadio = $(".ui-dialog").find(".registerContainer").find("input[type='radio'][requiredfield='True'][fieldkey='" + control.attr("fieldkey") + "']:checked");
                        if (!!!checkedRadio || checkedRadio.length <= 0) {
                            errorInfo.failed = true;
                            errorInfo.msg = "请选择" + control.attr("fieldtitle");
                            return false;
                        }
                    }
                }

                /*checkbox*/
                if (control.attr("type") === "checkbox" && control.attr("requiredfield") === "True") {
                    if (!control.is(':checked')) {
                        var checkedRadio = $(".ui-dialog").find(".registerContainer").find("input[type='checkbox'][requiredfield='True'][fieldkey='" + control.attr("fieldkey") + "']:checked");
                        if (!!!checkedRadio || checkedRadio.length <= 0) {
                            errorInfo.failed = true;
                            errorInfo.msg = "请选择" + control.attr("fieldtitle");
                            return false;
                        }
                    }
                }

                /*QQ号码验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "contact_qq") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyQQ(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "QQ号码格式不正确！";
                            return false;
                        }
                    }
                }

                /*帐号验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "username") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyUserName(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "帐号格式不正确！";
                            return false;
                        }
                    }
                }

                /*密码验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "password") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyPassWord(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "密码格式不正确！";
                            return false;
                        }
                    }
                }

                /*手机验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "mobilephone") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyMobilePhone(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "手机格式不正确！";
                            return false;
                        }
                    }
                }

                /*邮箱验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "mail") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyEmail(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "邮箱格式不正确！";
                            return false;
                        }
                    }
                }

                /*身份证验证*/
                if (!errorInfo.failed && control.attr("fieldkey") === "cardid") {
                    if (control.attr("requiredfield") === "True" || control.val() !== "") {
                        if (!verifyCardid(control.val())) {
                            errorInfo.failed = true;
                            errorInfo.msg = "身份证格式不正确！";
                            return false;
                        }
                    }
                }
            });
        }

        if (!errorInfo.failed) {
            /*验证码*/
            var txtValidCode = $(".ui-dialog").find("#txtValidCode");
            if (txtValidCode.length > 0) {
                var inputValidCode = txtValidCode.val();
                if (inputValidCode === "") {
                    errorInfo.failed = true;
                    errorInfo.msg = "请输入验证码！";
                } else if (!validCode.verify(inputValidCode)) {
                    errorInfo.failed = true;
                    errorInfo.msg = "验证码输入错误！";
                }
            }
        }

        return errorInfo;
    }

    var callRegisterApi = function () {
        var errorInfo = verifyRegisterData();
        if (errorInfo.failed) {
            alert(errorInfo.msg);
            return null;
        }
        var data = getRegisterData();
        if (data) {
            $.ajax({
                type: "POST",
                url: "http://" + window.location.host + "/action/memberregister?type=json",
                data: data,
                dataType: "text",
                success: function (result) {
                    if (result && result.indexOf("success") > 0) {
                        alert("注册成功！");
                        txtLoginName.val($(".ui-dialog").find(".registerContainer").find("input[type='text'][fieldkey='username']").val());
                        txtPassWord.val($(".ui-dialog").find(".registerContainer").find("input[type='password'][fieldkey='password']").val());
                        callLoginApi();
                    }
                    else {
                        alert("注册失败！");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("注册失败！")
                },
                complete: function (xhr, ts) {
                    registerDialog.dialog("close");
                }
            });
        }
    }

    var cleanRegisterDialog = function () {
        /*设置日期控件*/
        var dateFields = $("input[fieldType='date']");
        dateFields.daterangepicker({
            "singleDatePicker": true,
            "autoApply": true,
            "locale": {
                "format": "YYYY.MM.DD"
            }
        });
        dateFields.val("");
    }

    var setLoginView = function () {
        var loginName = "";
        var userinfo = getCookie("user.info");
        var isLogin = !!userinfo && userinfo !== "";
        if (isLogin) {
            loginName = decodeURI(userinfo.split("$")[1]);
            if (loginName === "" || loginName === "Guest") {
                loginName = decodeURI(userinfo.split("$")[2]);
            }
        }

        $("#" + panelId).find("#loginName").html(isLogin ? loginName : "");
        $("#" + panelId).find("#welcome").css("display", isLogin ? "none" : "inline-block");
        $("#" + panelId).find("#login").css("display", isLogin ? "none" : "inline-block");
        $("#" + panelId).find("#register").css("display", isLogin ? "none" : "inline-block");
        $("#" + panelId).find("#userinfo").css("display", isLogin ? "inline-block" : "none");
        $("#" + panelId).find("#logout").css("display", isLogin ? "inline-block" : "none");
        $("#" + panelId).find("#hello").css("display", isLogin ? "inline-block" : "none");
    }

    var logoutClick = function () {
        $.ajax({
            type: "GET",
            url: "http://" + window.location.host + "/action/memberlogout",
            data: null,
            dataType: "text",
            success: function (result) {
                console.log(result);
                setLoginView();
            },
            complete: function (xhr, ts) {
                loginDialog.dialog("close");
            }
        });

        $.cookie("user.info", "", { path: '/' });
        window.location = "http://" + window.location.host + "/web/default.html";
    }

    /*初始登录弹窗*/
    var loginDialog = $("#" + panelId).find(".loginContainer").dialog({
        autoOpen: false,
        title: "会员登录",
        modal: true,
        resizable: false,
        open: function (event, ui) {
            setDialogStyle();
            $(".ui-dialog").css({ "width": "370px", "height": "300px;" });

            if (!!txtLoginName)
                txtLoginName[0].value = "";
            if (!!txtPassWord)
                txtPassWord[0].value = "";
            if (!!ckbKeep)
                ckbKeep.removeAttr("checked");

            /*关闭登录弹窗*/
            $(".ui-dialog").find("#closeLogin").unbind("click");
            $(".ui-dialog").find("#closeLogin").click(function () {
                loginDialog.dialog("close");
            });

            /*点击登录*/
            $(".ui-dialog").find("#btnLogin").unbind("click");
            $(".ui-dialog").find("#btnLogin").click(function () {
                if (txtLoginName.val() === "") {
                    alert("请输入用户名！");
                    return;
                }
                if (txtPassWord.val() === "") {
                    alert("请输入密码！");
                    return;
                }

                callLoginApi();
            });

            /*登录界面点击注册*/
            $(".ui-dialog").find("#loginContainerRegister").unbind("click");
            $(".ui-dialog").find("#loginContainerRegister").click(function () {
                loginDialog.dialog("close");
                registerDialog.dialog("open");
            });
        }
    });

    /*初始注册弹窗*/
    var registerDialog = $("#" + panelId).find(".registerContainer").dialog({
        autoOpen: false,
        title: "会员注册",
        modal: true,
        resizable: false,
        open: function (event, ui) {
            setDialogStyle();
            $(".ui-dialog").css({ "min-width": "500px" });
            if (!validCodDive) {
                validCodDive = $(".ui-dialog").find('#validCode');
                if (validCodDive.length)
                    validCode = new vCode(validCodDive.get(0));
            }

            cleanRegisterDialog();
            /*关闭弹窗*/
            $(".ui-dialog").find("#closeRegister").click(function () {
                registerDialog.dialog("close");
            });

            /*点击注册*/
            $(".ui-dialog").find("#btnRegister").unbind("click");
            $(".ui-dialog").find("#btnRegister").click(function () {
                callRegisterApi();
            });

            /*绑定上传控件*/
            $(".ui-dialog").find("input[type='file']").unbind("change");
            $(".ui-dialog").find("input[type='file']").change(function () { });
        }
    });

    /*弹出登录*/
    $("#" + panelId).find("#login").click(function () {
        loginDialog.dialog("open");
    });

    /*弹出注册*/
    $("#" + panelId).find("#register").click(function () {
        registerDialog.dialog("open");
    });

    /*点击退出*/
    $("#" + panelId).find("#logout").click(function () {
        logoutClick();
    });

    /*初始化登录控件对象*/
    if (!!!txtLoginName) {
        txtLoginName = $(".ui-dialog").find("#txtLoginName");
    }
    if (!!!txtPassWord) {
        txtPassWord = $(".ui-dialog").find("#txtPassWord");
    }
    if (!!!ckbKeep) {
        ckbKeep = $(".ui-dialog").find("#ckbKeep");
    }

    setLoginView();
})();