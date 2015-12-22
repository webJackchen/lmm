$(function () {
    // $.validator.setDefaults({
    //     debug: true,
    //     showErrors: function (errorMap, errorList) {
    //         if (errorList && errorList.length > 0) {
    //             $.each(errorList, function (index, obj) {
    //                 var _item = $(obj.element);
    //                 _item.closest(".form-group").addClass("has-error");
    //                 if (obj.message.indexOf('必填') != -1) {
    //                     Kplus.prompt(_item.closest(".form-group").find(".control-label").text().replace("*", "").replace("：", "") + " 为" + obj.message, "warning");
    //                 } else {
    //                     Kplus.prompt(obj.message, "warning");
    //                 }
    //             });
    //         } else {
    //             var _item = $(this.currentElements);
    //             _item.closest(".form-group").removeClass("has-error");
    //         }
    //     }
    // });

    jQuery.validator.addMethod("isIdCardNo", function (value, element) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return this.optional(element) || reg.test(value);
    }, "请正确输入您的身份证号码");

    jQuery.validator.addMethod("isAlphabet", function (value, element) {
        var reg = /^[A-Za-z]*$/;
        return this.optional(element) || reg.test(value);
    }, "只能输入英文字串");

    jQuery.validator.addMethod("isAlphabet1", function (value, element) {
        var reg = /^[A-Za-z][A-Za-z0-9]*$/;
        return this.optional(element) || reg.test(value);
    }, "只能是以字母开头的字串");
    jQuery.validator.addMethod("isZipCode", function (value, element) {
        var reg = /^[0-9]{6}$/;
        return this.optional(element) || reg.test(value);
    }, "请正确填写您的邮政编码");
    jQuery.validator.addMethod("isTel", function (value, element) {
        var reg = /^\d{3,4}-?\d{7,9}$/;
        return this.optional(element) || reg.test(value);
    }, "请填写正确的座机号码");

    jQuery.validator.addMethod("selectNone", function (value, element) {
        return value == "请选择";
    }, "必须选择一项");
    jQuery.validator.addMethod("isCode", function (value, element) {
        var ac = /^0\d{2,3}$/;
        return this.optional(element) || (ac.test(value));
    }, "区号如：010或0371");
    // 字符最大长度验证（一个中文字符长度为2）
    jQuery.validator.addMethod("stringMaxLength", function (value, element, param) {
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
        return this.optional(element) || (length <= param);
    }, $.validator.format("长度不能大于{0}!"));
    // 字符最大长度验证（一个中文字符长度为2）
    jQuery.validator.addMethod("stringMinLength", function (value, element, param) {
        var length = value.length;
        for (var i = 0; i < value.length; i++) {
            if (value.charCodeAt(i) > 127) {
                length++;
            }
        }
        $
        return this.optional(element) || (length >= param);
    }, $.validator.format("长度不能小于{0}!"));

    // 字符验证，只能包含中文、英文、数字、下划线等字符。
    jQuery.validator.addMethod("stringCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, "只能包含中文、英文、数字、下划线等字符");
    // \/:*<>|特殊字符    
    jQuery.validator.addMethod("isFileName", function (value, element) {
        var NotAllowedCharRegex = new RegExp('[/\\:<>\*\|"\?]')
        return this.optional(element) || !(NotAllowedCharRegex.test(value));
    }, "无法使用“/\:*<>|”特殊字符");
    jQuery.validator.addMethod("maxdigits", function (value, element) {
        return this.optional(element) || /^\d+(\.\d{1,2})?$/.test(value);
    }, "小数位不能超过三位");
    // 待实现
    jQuery.validator.addMethod("stringPointCheck", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, "只能包含中文、英文、数字、下划线、中划线和·等字符");
    // 待实现
    jQuery.validator.addMethod('chiEngNumCheck', function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, '只能包含中文、英文、数字');
    // 待实现
    jQuery.validator.addMethod('passwordCheck', function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, '无法使用空格');
    jQuery.validator.addMethod('engNumCheck', function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, '只能包含英文、数字、下划线');
    jQuery.validator.addMethod("mainhost", function (value, element) {
        return this.optional(element) || /^www(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?$/.test(value);
    }, "主域名输入不正确");
    jQuery.validator.addMethod("host", function (value, element) {
        return this.optional(element) || /[a-zA-Z0-9*][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/.test(value);
    }, "域名输入不正确");
});

