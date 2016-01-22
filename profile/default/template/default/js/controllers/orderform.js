$(function () {
    if ($.cookie("user.info") == "" || $.cookie("user.info") == undefined) {
        window.close();
    } else {
        var link = "",
        addressid = "",
        payment_type = "",
        totalAll = 0;
        var Request = new Object();
        Request = GetRequest();
        link = Request.link + "-" + Request.count;

        /*支付方式选择*/
        $(".content-body .pay-info>span").click(function () {
            $(this).addClass("active").siblings().removeClass("active");
        });

        /*获取当前商品的参数*/
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }


        /*获取收货地址*/
        function getAddress() {
            $.getJSON("/action/Saddresslist?type=json", function (result) {
                var _result = result.channel.item,_content;
                if (Object.prototype.toString.call(result.channel.item) === '[object Array]' && result.channel.item.length > 0) {
                    info = $.grep(result.channel.item, function (obj, index) {
                        return obj.state.text === "1";
                    });
                    _content = info[0];
                    if (info && info.length) {
                        _content = _result[0];
                    }
                } else {
                    _content = _result;
                }
                addressid = _content.link.text;

                var _html = "<span>" + _content.name.text + "</span><span>" + _content.province.text + "" + _content.city.text + "" + _content.district.text + "" + _content.address.text + "</span>" +
                  "<span>" + _content.mobile.text + "</span>";
                $(".content-body .address-info").append(_html);
            });
        }

        /*获取商品信息*/
        function getGoodInfo() {
            if (Request.link != "" && Request.link != null && Request.link != undefined) {
                $.getJSON("/action/itemlist?type=json&m=goods&i=" + Request.link, function (result) {
                    if (!!result && !!result.channel && !!result.channel.item) {
                        var _content = result.channel.item;
                        var _html = "";
                        if (_content.developers) {
                            _html = _html + '<h6>商家：' + _content.developers.text + '</h6>';
                        }
                        _html = _html + '<div class="col-sm-12"><div class="col-sm-2"><img src="http://' + result.channel.host + '' + _content.image.text + '" width="100%" height="100%"></div>';
                        _html = _html + '<div class="col-sm-6">' + _content.title.text + '</div>';
                        if (_content.isvip.text == "1") {
                            _html = _html + '<div class="col-sm-2 text-center price">' + _content.vipPrice.text + '</div>';
                        } else if (_content.isvip.text == "0") {
                            _html = _html + '<div class="col-sm-2 text-center price">' + _content.moduleInfo.price.text + '</div>';
                        }
                        _html = _html + '<div class="col-sm-1 text-center">×' + Request.count + '</div><div class="col-sm-1 text-center">有货</div></div>';
                        $(".content-body .goods-info").append(_html);

                        if (_content.isvip.text == "1") {/*是否是会员*/
                            $(".content-body .row.pay span.pay-moeny").text("￥" + parseInt(Request.count) * parseFloat(_content.vipPrice.text));
                            totalAll = parseInt(Request.count) * parseFloat(_content.vipPrice.text).toFixed(2);
                        } else {
                            $(".content-body .row.pay span.pay-moeny").text("￥" + parseInt(Request.count) * parseFloat(_content.moduleInfo.price.text));
                            totalAll = parseInt(Request.count) * parseFloat(_content.moduleInfo.price.text).toFixed(2);
                        }
                    }
                });
            }
        }

        /*订单提交*/
        $(".content-body .buttom-form").click(function () {
            payment_type = $(".content-body .pay-info>span.active").text();

            if (link == "" || addressid == "" || payment_type == "" || totalAll == "" || totalAll == 0) {
                return false;
            } else {
                var data = "<form><list><![CDATA[" + link +
                   "]]></list><addressid><![CDATA[" + addressid +
                    "]]></addressid><description><![CDATA[" + "" +
                   "]]></description><payment_type><![CDATA[" + payment_type +
                   "]]></payment_type><totalAll><![CDATA[" + totalAll +
                   "]]></totalAll></form>";

                $.ajax({
                    type: "POST",
                    url: "/action/sorderinsertedit?m=goods",
                    data: data,
                    processData: false,
                    async: false,
                    dataType: "text",
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    success: function (result) {
                        var state = $(result).find("item").find("return").text();
                        if (state == "success") {
                            alert("提交成功");
                            if (payment_type == "货到付款") {
                                window.location = "http://" + window.location.host + "/web/member/index?jump=ordergoods";
                            } else {/*在线支付*/
                                var orderInfo = $(result).find("item").find("message").text()
                                window.location = "/payment/web/alipayescow/" + orderInfo.split("#")[1] + "?title=" + orderInfo.split("#")[0] + "&total=" + totalAll;
                            }
                        } else {
                            alert($(result).find("item").find("message").text());
                            window.location = "http://" + window.location.host + "/web/default.html";
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        alert("系统错误，提交失败！");
                    }
                });
            }



        });

        getAddress();
        getGoodInfo();
    }
});
