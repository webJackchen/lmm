<link href="/css/views/ordergoods.css" rel="stylesheet" />
<input id="orderState"  type="hidden" value="<%=Request["order_state"]%>" />
<div class="order">
    <ul class="nav nav-tabs management-content-bar nopadding">
        <li class="active" data-value="-2"><a href="javascript:void(0);">全部订单<s class="active"><i></i></s></a></li>
        <li data-value="0"><a href="javascript:void(0);">待付款</a></li>
        <li data-value="1"><a href="javascript:void(0);">待发货</a></li>
        <li data-value="2"><a href="javascript:void(0);">待收货</a></li>
        <li data-value="4"><a href="javascript:void(0);">待评价</a></li>
    </ul>

    <div class="conditionQuery">
        <div class="form-inline">
            <div class="form-group">
                <select class="form-control" id="orderStatus">
                    <option value="-2">请选择订单状态</option>
                    <option value="0">待付款</option>
                    <option value="1">待发货</option>
                    <option value="2">待收货</option>
                    <option value="4">待评价</option>
                    <option value="5">交易完成</option>
                    <option value="-1">交易关闭</option>
                </select>
            </div>
            <div class="form-group datetimepicker ml10">
                <input class="form-control" type="text" id="orderDate" style="width: 195px;" placeholder="输入选择时间" />
                <span class="add-on"><i class="iconfont icon-calendar"></i></span>
            </div>
            <div class="form-group ml10">
                <input type="text" class="form-control" placeholder="输入订单编号" id="orderKey" />
            </div>
            <div class="form-group ml20">
                <button class="btn btn-primary pull-left">搜 索</button>
            </div>
            <div class="form-group ml20">
                <button class="btn btn-default pull-left" onclick="cleanInput()">清 除</button>
            </div>
        </div>
    </div>

    <div class="template-list">
        <table class="table table-bordered table-hover text-center">
            <thead>
                <tr style="background: #F3F3F3;">
                    <th>订单详细</th>
                    <th class="text-center">收货人</th>
                    <th class="text-center">总计</th>
                    <th class="text-center">状态</th>
                    <th class="text-center">操作</th>
                </tr>
            </thead>
            <tbody id="tbody_data"></tbody>
        </table>
    </div>
    <div class="text-right" id="page"></div>
</div>

<div id="messageAddDiv" style="display: none;">
    <div id="addMessage" class="form-panel" style="display: none; margin-top: 20px;">
        <form id="messageDataForm" class=" form-horizontal">
            <div class="form-group row">
                <div>
                    <div class="col-sm-2 ">
                        <label class="pull-right control-label">内容：</label>
                        <span style="color: red;" class="pull-right control-label">*</span>
                    </div>
                    <div class="col-sm-9">
                        <textarea class="form-control" id="commentContent" name="commentContent" onblur=' promptHide("contentVerify")'  onkeyup="words_deal()"></textarea>
                        <span id="wordVerify">(150/150)</span>
                        <label id="contentVerify" style="display: none;" for="commentContent" generated="true" class="error">评价内容不能为空</label>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <div>
                    <div class="col-sm-2 ">
                        <label class="pull-right control-label">验证码：</label>
                        <span style="color: red;" class="pull-right control-label">*</span>
                    </div>
                    <div class="col-sm-3">
                        <input type="text" class="form-control" id="txtVerifyCode" name="txtVerifyCode" onblur=' promptHide("codeVerify")'>
                        <label id="codeVerify" style="display: none;" for="txtVerifyCode" generated="true" class="error"></label>
                    </div>
                    <div class="col-sm-5 verify">
                        <img id="imgVerifyCode" src="#" style="width: 70px;" />
                        <span class="ml10">看不清？</span>
                        <a class="aVerifyCode" href="javascript:void(0);" onclick="verifyCode()">换一张</a>
                    </div>
                </div>
            </div>
            <div id="btnDiv" class="form-group text-center">
                <a class="btn btn-primary" onclick="doSubmitComment(@goodsLink,@orderLink)">提交评价</a>
            </div>
        </form>
    </div>
</div>

<script src="/js/framework/page.js"></script>
<script src="/js/controllers/orderaction.js"></script>
<script src="/js/controllers/ordergoods.js"></script>
<script src="/js/controllers/orderpay.js"></script>
<script src="/js/controllers/commentadd.js"></script>
<script type="text/javascript">

    function doSubmitPay(goodsLink, goodsNum, goodsPrice) {
        var url = "/payment/web/alipayescow/" + goodsLink + "?title=" + goodsNum + "&total=" + goodsPrice;
        window.location = url;
    }
</script>