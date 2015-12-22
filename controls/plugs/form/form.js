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


$(function () {


    $('#txtTime').daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        singleDatePicker: true,
        "locale": {
            "format": "YYYY.MM.DD hh:mm:ss",
        }
    });
    $('#txtDate').daterangepicker({
        singleDatePicker: true,
        "locale": {
            "format": "YYYY.MM.DD",
        }
    });

    var $el = $("#_panelId_"), validCode;
    if ($el.find('#validCode').length)
        validCode = new vCode($el.find('#validCode').get(0));

    $el.find('input[type="text"]')
    .on('focus', function () {
        if (!$(this).data('text-changed')) {
            $(this).data('old-text', $(this).val());
            $(this).val('');
        }
    })
    .on('change', function () {
        $(this).data('text-changed', true);
    })
    .on('blur', function () {
        if (!$(this).val()) {
            $(this).val($(this).data('old-text'));
            $(this).data('text-changed', false);
        }
    });

    $el.find('textarea')
        .on('focus', function () {
            if (!$(this).attr('text-changed')) {
                $(this).attr('old-text', $(this).val());
                $(this).val('');
            }
        })
        .on('change', function () {
            $(this).attr('text-changed', true);
        })
        .on('blur', function () {
            if (!$(this).val()) {
                $(this).val($(this).attr('old-text'));
                $(this).attr('text-changed', false);
            }
        });



    var validInput = function () {
        if ($('#txtValidCode').length) {
            var inputValidCode = $('#txtValidCode').val();
            if (!inputValidCode) {
                alert('请输入验证码.');
                return false;
            }
            if (!validCode.verify(inputValidCode)) {
                alert('验证码错误,请重新输入.');
                validCode.update($el.find('#validCode').get(0));
                return false;
            }
        }

        var hasInputFaluied = false;

        if ($('input.isrequired').length) {
            $('input.isrequired').each(function () {
                if (!$(this).val()) {
                    hasInputFaluied = true;
                    var labelText = $(this).parent().siblings('.col-label').text() || '';
                    alert(labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '') + "不能为空。");
                    return false;
                }
            });
        }
        if (hasInputFaluied) return;
        debugger
        if ($('input[type="text"]').length) {
            $('input[type="text"]').each(function () {
                if ($(this).val()) {
                    var labelText = $(this).parent().siblings('.col-label').text() || '',
                        labelName = labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '');
                    var reg = /^[0-9]*$/g;
                    if ($(this).data('limit')) {
                        if ($(this).data('limit') == 'number') {
                            if (!reg.test($(this).val())) {
                                hasInputFaluied = true;
                                var errorText = $(this).data('error');
                                if ((errorText || '').indexOf(labelName) < 0)
                                    errorText = labelName + errorText;
                                alert(errorText);
                                return false;
                            }
                        }
                        else if ($(this).data('limit') == 'english') {
                            reg = /[^/d]/g;
                            if (!reg.test($(this).val())) {
                                hasInputFaluied = true;
                                var errorText = $(this).data('error');
                                if ((errorText || '').indexOf(labelName) < 0)
                                    errorText = labelName + errorText;
                                alert(errorText);
                                return false;
                            }
                        }
                    }
                }
            });
        }
        if (hasInputFaluied) return;


        if ($('textarea.isrequired').length) {
            $('textarea.isrequired').each(function () {
                if (!$(this).val()) {
                    hasInputFaluied = true;
                    var labelText = $(this).parent().siblings('.col-label').text() || '';
                    alert(labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '') + "不能为空。");
                    return false;
                }
            });
        }
        if (hasInputFaluied) return;
        if ($('.radrequired').length) {
            $('.radrequired').each(function () {
                var labelText = $(this).find('.col-label').text() || '',
                    notChecked = true;
                $(this).find('input[type="radio"]').each(function () {
                    if ($(this).get(0).checked == true) {
                        notChecked = false;
                    }
                });
                if (notChecked) {
                    hasInputFaluied = true;
                    alert('请选择' + labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', ''));
                    return false;
                }
            })
        }
        if (hasInputFaluied) return;

        if ($('.chkrequired').length) {
            $('.chkrequired').each(function () {
                var labelText = $(this).find('.col-label').text() || '',
                    notChecked = true;
                $(this).find('input[type="checkbox"]').each(function () {
                    if ($(this).get(0).checked == true) {
                        notChecked = false;
                    }
                });
                if (notChecked) {
                    hasInputFaluied = true;
                    alert('请选择' + labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', ''));
                    return false;
                }
            })
        }
        return !hasInputFaluied;
    }

    //<item number="15" type="checkbox">
    //<question>15．您一般会在什么心情下喝啤酒？</question>
    //<answer>
    //<item number="1">A．高兴时</item>
    //<item number="2">B．烦心时</item>
    //<item number="3">C．无聊时</item>
    //<item number="4">D．伤心时</item>
    //<item number="5">E．郁闷时</item>
    //<item number="6">F．其他</item>
    //</answer>
    //</item>
    ///这个估计会有问题，需要继续改进  mark by clark
    var getInputXml = function () {
        var textObjs = $('input[type="text"]'), xmlStr = '';
        textObjs.each(function () {
            if ($(this).val()) {
                var labelText = $(this).parent().siblings('.col-label').text() || '',
                    number = $(this).data('number'),
                    controlType = ($(this).attr('id') == 'txtDate' || $(this).attr('id') == 'txtTime') ? 'date' : 'text',
                    tmpXml = '<item number="' + number + '" type="' + controlType + '">',
                    labelName = labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '');

                if (labelName == '验证码' || !number) return '';

                tmpXml += '<question>' + labelName + '</question>';
                tmpXml += '<answer>' + $(this).val() + '</answer>';
                tmpXml += '</item>';
                xmlStr += tmpXml;
            }
        });
        return xmlStr;
    }
    var getRadioXml = function () {
        var radioRegionArr = $('div.radio-region'),
            xmlStr = '';
        radioRegionArr.each(function () {
            var numberText = $(this).data('number'),
                radioArr = $(this).find('input[type="radio"]'),
                labelText = $(this).find('.col-label').text() || '';

            xmlStr += '<item number="' + numberText + '" type="radio">';
            if (!labelText) return;
            xmlStr += '<question>' + labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '') + '</question>';
            radioArr.each(function () {
                if (!!$(this).get(0).checked) {
                    xmlStr += '<answer>' + $(this).val() + '</answer>'
                }
            });
            xmlStr += '</item>';
        });
        return xmlStr;
    }

    var getCheckboxXml = function () {
        var radioRegionArr = $('div.checkbox-region'),
            xmlStr = '';
        radioRegionArr.each(function () {
            var numberText = $(this).data('number'),
                radioArr = $(this).find('input[type="checkbox"]'),
                labelText = $(this).find('.col-label').text() || '';

            xmlStr += '<item number="' + numberText + '" type="radio">';
            xmlStr += '<question>' + labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '') + '</question>';
            xmlStr += '<answer>';
            radioArr.each(function () {
                if (!!$(this).get(0).checked) {
                    xmlStr += '<item number="' + $(this).data('number') + '">' + $(this).val() + '</item>'
                }
            });
            xmlStr += '</answer></item>';
        });
        return xmlStr;
    }

    var getTextareaXml = function () {
        var textObjs = $('textarea'), xmlStr = '';
        textObjs.each(function () {
            if ($(this).val()) {
                var labelText = $(this).parent().siblings('.col-label').text() || '',
                tmpXml = '<item number="' + $(this).data('number') + '" type="textarea">';
                tmpXml += '<question>' + labelText.replace('*', '').replace(':', '').replace('：', '').replace(' ', '') + '</question>';
                tmpXml += '<answer>' + $(this).val() + '</answer>';
                tmpXml += '</item>';
                xmlStr += tmpXml;
            }
        });
        return xmlStr;
    }


    var getPostXml = function () {
        return getInputXml() + getRadioXml() + getCheckboxXml() + getTextareaXml();
    }


    var getFormXml = function () {
        var _xml = '<form>'
            + '<item><![CDATA[' + $el.find('.kdo-panel').data('key') + ']]></item>'
            + '<mime><![CDATA[' + "web" + ']]></mime>'
            + '<content><![CDATA[' + encodeURIComponent(getPostXml()) + ']]></content>'
            + '</form>';
        debugger
        console.log(_xml);
        return _xml;
    }

    var clearControl = function () {
        $('textarea').each(function () {
            $(this).val('');
            $(this).val($(this).attr('old-text'));
            $(this).attr('text-changed', false);
        });
        $('input').each(function () {
            if ($(this).attr('id') !== 'txtDate' && $(this).attr('id') !== 'txtTime')
                $(this).val('');
            $(this).val($(this).attr('old-text'));
            $(this).attr('text-changed', false);
        });
        $('input[type="radio"]').each(function () {
            $(this).get(0).checked = false;
        });
        $('input[type="checkbox"]').each(function () {
            $(this).get(0).checked = false;
        });


    }

    $('#btnSubmit').click(function () {
        if (validInput() && !window.lanh) {
            $.ajax({
                type: "POST",
                url: "http://" + window.location.host + "/action/answerinsertedit?m=form",
                data: getFormXml(),
                dataType: "text",
                success: function (result) {
                    if (typeof result == 'string' && result.indexOf("success") > 0) {
                        alert("提交成功");
                        validCode.update($el.find('#validCode').get(0));
                        clearControl();
                    }
                }
            });
        }
    });
})