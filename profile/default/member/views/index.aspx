<div class="index">
    <div class="panel panel-default index-info">
        <div class="panel-body row">
            <div class="col-sm-4 info">
                <div class="info-account">账号：<span></span></div>
                <div class="info-nname">昵称：<span></span></div>
                <div class="info-level">当前等级：<span></span></div>
                <div class="info-phone">手机：<span></span></div>
                <div class="info-mail">邮箱：<span></span></div>
                <div class="info-safe">
                    <div class="col-sm-3 nopadding">账户安全：</div>
                    <div class="col-sm-8 nopadding">
                        <ul class="nav nav-lv-bg">
                            <li class="col-sm-3 bgred" id="bg1"></li>
                            <li class="col-sm-3 bgblack" id="bg2"></li>
                            <li class="col-sm-3 bgblack" id="bg3"></li>
                        </ul>
                        <ul class="nav nav-lv-ft">
                            <li class="col-sm-3 clred" id="cl1">低</li>
                            <li class="col-sm-3 clblack" id="cl2">中</li>
                            <li class="col-sm-3 clblack" id="cl3">高</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-sm-8 handle">
                <div class="row" id="index-account">
                    <div class="col-sm-2 text-center">
                        <a class="alink" href="views/ordergoods?order_state=0">
                            <div class="h60"><i class="iconfont icon-to-be-paid"></i></div>
                            <div class="handle-payment">待付款 (<span>0</span>)</div>
                        </a>
                    </div>
                    <div class="col-sm-2 text-center">
                        <a class="alink" href="views/ordergoods?order_state=2">
                            <div class="h60"><i class="iconfont icon-goods-to-be-received"></i></div>
                            <div class="handle-deliver">待收货 (<span>0</span>)</div>
                        </a>
                    </div>
                    <div class="col-sm-2 text-center">
                        <a class="alink" href="views/ordergoods?order_state=4">
                            <div class="h60"><i class="iconfont icon-to-be-evaluated"></i></div>
                            <div class="handle-evaluate">待评价 (<span>0</span>)</div>
                        </a>
                    </div>
                    <!--
                    <div class="col-sm-2 text-center">
                        <a class="alink" href="views/ordergoods">
                            <div class="h60"><i class="iconfont icon-to-be-confirmed"></i></div>
                            <div class="handle-confirm">待确认 (<span>0</span>)</div>
                         </a>
                    </div>
                    <div class="col-sm-2 text-center">
                        <a href="views/ordergoods">
                            <div class="h60"><i class="iconfont icon-message-reply"></i></div>
                            <div class="handle-message">留言回复 (<span>0</span>)</div>
                        </a>
                    </div>
                    <div class="col-sm-2 text-center">
                        <a href="views/ordergoods">
                            <div class="h60"><i class="iconfont icon-comment-reply"></i></div>
                            <div class="handle-reply">评价回复 (<span>0</span>)</div>
                        </a>
                    </div>
                    -->
                </div>
            </div>
        </div>
    </div>

    <div class="panel panel-default">
        <div class="panel-heading list-header">
            <div class="col-sm-6"><strong>我的订购</strong></div>
            <div class="col-sm-6 text-right nopadding">
                <a class="alink" href="views/order">查看全部订购</a>
            </div>
        </div>
        <div class="panel-body template-list">
            <table class="table table-bordered table-hover text-center mb0">
                <thead>
                    <tr style="background: #F3F3F3;">
                        <th>订购详细</th>
                        <th class="text-center">收货人</th>
                        <th class="text-center">总计</th>
                        <th class="text-center">状态</th>
                        <th class="text-center">操作</th>
                    </tr>
                </thead>
                <tbody id="tbody_data"></tbody>
            </table>
        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-heading list-header">
            <div class="col-sm-6"><strong>我的订单</strong></div>
            <div class="col-sm-6 text-right nopadding">
                <a class="alink" href="views/ordergoods">查看全部订单</a>
            </div>
        </div>
        <div class="panel-body template-list">
            <table class="table table-bordered table-hover text-center mb0">
                <thead>
                    <tr style="background: #F3F3F3;">
                        <th>订单详细</th>
                        <th class="text-center">收货人</th>
                        <th class="text-center">总计</th>
                        <th class="text-center">状态</th>
                        <th class="text-center">操作</th>
                    </tr>
                </thead>
                <tbody id="tbody_data1"></tbody>
            </table>
        </div>
    </div>
</div>

<script src="/js/controllers/index.js"></script>
