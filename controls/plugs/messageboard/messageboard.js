

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
        $("#codeVal").val(this.code);
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

$(function () {
    var $el = $("#_panelId_"),
        validCode = new vCode($el.find('#validCode').get(0));
    var person = /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/;/*中文和英文*/
    var photos = /^1([23578])\d{9}$/;/*数字和横线*/
    var isSubmit = false;

    $el.find("#txtMessage").blur(function () {
        if (!$el.find("#txtMessage").val().trim()) {
            $el.find("#txtMessage").siblings("label").text("内容不能为空").show();
            $el.find("#txtMessage").focus();
            isSubmit = true;
            return false;
        } else if (!stringMaxLength($el.find("#txtMessage").val(), $el.find("#txtMessage"),300)) {
            $el.find("#txtMessage").siblings("label").text("最多输入300个字符").show();
            $el.find("#txtMessage").focus();
            isSubmit = true;
            return false;
        } else {
            isSubmit = false;
            $el.find("#txtMessage").siblings("label").hide();
        }
    });

    $el.find("#txtPerson").blur(function () {
        if (!$el.find("#txtPerson").val().trim()) {
            $el.find("#txtPerson").siblings("label").text("姓名不能为空").show();
            $el.find("#txtPerson").focus();
            isSubmit = true;
            return false;
        } else if (!person.test($el.find("#txtPerson").val())) {
            $el.find("#txtPerson").siblings("label").text("只能输入中文英文").show();
            $el.find("#txtPerson").focus();
            isSubmit = true;
            return false;
        } else if(!stringMaxLength($el.find("#txtPerson").val(), $el.find("#txtPerson"),20)){
            $el.find("#txtPerson").siblings("label").text("最多输入20个字符").show();
            $el.find("#txtPerson").focus();
            isSubmit = true;
            return false;
        }else {
            isSubmit = false;
            $el.find("#txtPerson").siblings("label").hide();
        }
    });

    $el.find("#txtTelephone").blur(function () {
        if (!$el.find("#txtTelephone").val().trim()) {
            $el.find("#txtTelephone").siblings("label").text("电话不能为空").show();
            $el.find("#txtTelephone").focus();
            isSubmit = true;
            return false;
        } else if (!photos.test($el.find("#txtTelephone").val())) {
            $el.find("#txtTelephone").siblings("label").text("请输入正确的手机号码").show();
            $el.find("#txtTelephone").focus();
            isSubmit = true;
            return false;
        } else {
            isSubmit = false;
            $el.find("#txtTelephone").siblings("label").hide();
        }
    });

    $el.find("#txtValidCode").blur(function () {
        if (!$el.find("#txtValidCode").val().trim()) {
            $el.find("#txtValidCode").siblings("label").text("验证码不能为空").show();
            $el.find("#txtValidCode").focus();
            isSubmit = true;
            return false;
        } else if ($el.find('#txtValidCode').val().trim() !== $("#codeVal").val().trim()) {
            $el.find("#txtValidCode").siblings("label").text("验证码错误,请重新输入").show();
            $el.find("#txtValidCode").focus();
            isSubmit = true;
            return false;
        } else {
            isSubmit = false;
            $el.find("#txtValidCode").siblings("label").hide();
        }
    });

    if (!window.lanh) {
        $el.find("#btnSubmit").on("click", function (e) {
            var inputValidCode = $el.find('#txtValidCode').val();
            var msgText = $el.find("#txtMessage").val(),
                personText = $el.find("#txtPerson").val(),
                telText = $el.find("#txtTelephone").val();
            if (!isSubmit) {
                if (!msgText.trim()) {
                    $el.find("#txtMessage").siblings("label").text("内容不能为空").show();
                    $el.find("#txtMessage").focus();
                    isSubmit = true;
                    return false;
                } else if (!personText.trim()) {
                    $el.find("#txtPerson").siblings("label").text("姓名不能为空").show();
                    $el.find("#txtPerson").focus();
                    isSubmit = true;
                    return false;
                } else if (!telText.trim()) {
                    $el.find("#txtTelephone").siblings("label").text("电话不能为空").show();
                    $el.find("#txtTelephone").focus();
                    isSubmit = true;
                    return false;
                } else if (!inputValidCode) {
                    $el.find("#txtValidCode").siblings("label").text("请输入验证码").show();
                    $el.find("#txtValidCode").focus();
                    isSubmit = true;
                    return false;
                }
            }

            var data = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\
                        <root>\
                           <category>message</category>\
                           <title>留言</title>\
                           <content><![CDATA[{content}]]></content>\
                           <person><![CDATA[{person}]]></person>\
                           <telephone><![CDATA[{telephone}]]></telephone>\
                        </root>";
            data = data.replace("{content}", msgText)
                       .replace("{person}", personText)
                       .replace("{telephone}", telText);
            if (!isSubmit) {
                $.ajax({
                    type: "POST",
                    url: "http://" + window.location.host + "/action/itemedit?m=message&type=json",
                    data: data,
                    dataType: "text",
                    success: function (result) {
                        if (typeof result == 'string' && result.indexOf("success") > 0) {
                            messageTip.success("留言成功");
                            $el.find("#txtValidCode").val("");
                            validCode.update($el.find('#validCode').get(0));
                            $el.find("#txtMessage").val("");
                            $el.find("#txtPerson").val("");
                            $el.find("#txtTelephone").val("");
                        }
                    }
                });
            }
            return false;
        });

        var clearControlValue = function () {
            $el.find("#txtMessage").val("");
            $el.find("#txtTelephone").val("");
            $el.find("#txtMobilephone").val("");
            $el.find("#txtPerson").val("");
            $el.find("#txtEmail").val("");
        }

        $el.find("#btnReset").on("click", function (e) {
            clearControlValue();
        });
    }

    /* 字符最大长度验证（一个中文字符长度为2）*/
    var stringMaxLength = function (value, element, param) {
        var length = 0;
        for (var i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 127) {
                if (length + 2 > param) {
                    break;
                }
                length += 2;
            } else {
                if (length + 1 > param) {
                    break;
                }
                length++;
            }
        }
        $(element).val(value.substr(0, i));
        return length <= param;
       // return this.optional(element) || (length <= param);
    }
});
