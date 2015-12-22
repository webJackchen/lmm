$(function () {
    var panelId = "_panelId_",
        $el = $("#" + panelId),
        ctrlObj = $el.children(".content-detail"),
        isSystem = $(document.body).data("turnedsmembersystem"),
        _link = ctrlObj.find("#link").val(),
         _isvip = ctrlObj.find("#isvip").val();

    ctrlObj.find("#btn-buy").hide();
    if (isSystem) {
        var timer = setInterval(function () {
            turnedOrder = $(document.body).data('turnedpurchase');
            if (turnedOrder !== undefined) {
                if (turnedOrder) {
                    ctrlObj.find("#btn-buy").show();
                } else {
                    ctrlObj.find("#btn-buy").hide();
                }
                clearInterval(timer);
            }
        }, 200);
    }

    /*没有自定义属性则隐藏*/
    if (ctrlObj.find(".detail-attribute .attribute").text() == "") {
        ctrlObj.find(".detail-attribute#attribute").hide();
    }

    /*判断库存是否为0*/
    if (parseInt(ctrlObj.find(".detail-attribute span#count-stock").text()) == 0) {
        ctrlObj.find(".value input.stock").val(0);
      //  cursor: ns - resize;
        $("a#btn-buy").attr("disabled", "true");
    }

    /*是否是会员*/
    if (parseInt(_isvip) === 0) {
        ctrlObj.find("div.VIP-price").hide();
        ctrlObj.find("div.VIP-price").siblings("span.shop-price").addClass("text-decoratio");
    }

    /*图片切换预览*/
    ctrlObj.find("ul.perview-img li img").click(function (event) {
        $(this).parent().addClass("active").siblings().removeClass("active");
        $(this).closest("ul.perview-img").siblings("img.preview").attr("src", $(this).attr("src"));
    });

    /*增加数量*/
    ctrlObj.find("#addStock").click(function () {
        var _value = parseInt(ctrlObj.find(".detail-attribute input.stock").val());
        var _stock = parseInt(ctrlObj.find(".detail-attribute span#count-stock").text());
        if (_stock > _value) {
            _value = ++_value;
        }
        ctrlObj.find(".detail-attribute input.stock").val(_value);
    });

    /*减少数量*/
    ctrlObj.find("#reduceStock").click(function () {
        debugger;
        var _value = parseInt(ctrlObj.find(".detail-attribute input.stock").val());
        if (_value > 1) {
            _value = --_value;
        }
        ctrlObj.find(".detail-attribute input.stock").val(_value);
    });

    
    /*手动填写数量*/
    ctrlObj.find(".detail-attribute input.stock").focusout(function () {
        var _value = parseInt(ctrlObj.find(".detail-attribute input.stock").val());
        var _stock = parseInt(ctrlObj.find(".detail-attribute span#count-stock").text());
        if (_value > _stock || _value < 0) {
            ctrlObj.find(".detail-attribute input.stock").val(_stock);
        }
    });

    ctrlObj.find("#myTab li:eq(0) a").tab("show");

    /*获取地址信息*/
    function getAddress() {
        var _content = null;
        $.getJSON("/action/Saddresslist?type=json", function (result) {
            if (!!result && !!result.channel && !!result.channel.item) {
                _content = result.channel.item;
            }
        });
        return _content;
    }
   

    /*立即订购*/
    ctrlObj.find("#btn-buy").click(function () {
        var _count = parseInt(ctrlObj.find(".detail-attribute input.stock").val());
        if (_count > 0) {
            var address = getAddress();
            if ($.cookie("user.info")) {/*已登录*/
                $.getJSON("/action/Saddresslist?type=json", function (result) {
                    if (!!result && !!result.channel && !!result.channel.item) {/*已经填写收货地址*/
                        var data = result.channel.item;
                        window.open("http://" + window.location.host + "/web/member/orderform?link=" + _link + "&count=" + _count);
                    } else {/*未填写收货地址*/
                        window.open("http://" + window.location.host + "/web/member/index?jump=address");
                    }
                });
            } else {/*未登录*/
                $(".ui-dialog").find(".loginContainer").dialog('open');
            }
        } 
    });
   
    /*详情和评价切换*/
    ctrlObj.find("#myTab li").click(function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        var _index = $(this).index();
        ctrlObj.find(".detail-descript .tab-content .tab-pane").removeClass("active");
       ctrlObj.find(".detail-descript .tab-content .tab-pane").eq(_index).addClass("active");
    });
    
    

    /*读取评价*/
    function getEvaluation() {
        if (_link != "") {
            $.getJSON("/action/ItemListReply?type=json&m=goods&i=" + _link, function (result) {
                if (!!result && !!result.channel && !!result.channel.item) {
                    console.log(result.channel.item)
                    var _content = result.channel.item,
                        _html = "";
                    if (_content.length == undefined) {
                        _content = [_content];
                    }
                    for (var i = 0; i < _content.length; i++) {
                        if (_content[i].nickName.text == "") {
                            _html = _html + '<div class="evaluation-content"><div class="evaluation"><div class="evaluation-title"><span class="title">匿名评价：</span>' +
                         '<span class="tile">' + _content[i].buildDate + '</span></div><div class="evaluation-detail">' + _content[i].content.text + '</div></div>';
                       
                        } else {
                            _html = _html + '<div class="evaluation-content"><div class="evaluation"><div class="evaluation-title"><span class="title">' + _content[i].nickName.text + '：</span>' +
                           '<span class="tile">' + _content[i].buildDate + '</span></div><div class="evaluation-detail">' + _content[i].content.text + '</div></div>';
                        }
                        if (_content[i].description.text != "") {
                            _html = _html + '<div class="repaly"><div class="evaluation-title"><span class="title">商家回复：</span>' +
                           '<span class="tile">' + _content[i].authorEdit.dateTime + '</span></div><div class="evaluation-detail">' + _content[i].description.text + '</div></div></div>';
                        } else {
                            _html = _html + "</div>";
                        }
                    }
                    ctrlObj.find("#evaluation-content").append(_html);
                } else {
                    ctrlObj.find("#evaluation-content").append("暂无评价");
                }
            });
        }
    }

    getEvaluation();
});

