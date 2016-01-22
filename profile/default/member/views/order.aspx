<div class="order">
    <ul class="nav nav-tabs management-content-bar nopadding">
        <li class="active" data-value="0"><a href="javascript:void(0);">全部订购<s class="active"><i></i></s></a></li>
        <li data-value="-1"><a href="javascript:void(0);">待确认</a></li>
        <li data-value="1"><a href="javascript:void(0);">已确认</a></li>
    </ul>

    <div class="conditionQuery">
        <div class="form-inline">
            <div class="form-group">
                <select class="form-control" id="orderType">
                    <option value="0">请选择订购状态</option>
                    <option value="-1">待确认</option>
                    <option value="1">已确认</option>
                </select>
            </div>
            <div class="form-group datetimepicker ml10">
                <input class="form-control" type="text" id="orderDate" style="width: 195px;" placeholder="输入选择时间" />
                <span class="add-on"><i class="iconfont icon-calendar"></i></span>
            </div>
            <div class="form-group ml10">
                <input type="text" class="form-control" placeholder="输入订购编号" id="orderKey" />
            </div>
            <div class="form-group ml20">
                <button class="btn btn-primary pull-left">搜 索</button>
            </div>
            <div class="form-group ml20">
                <button class="btn btn-default pull-left">清 除</button>
            </div>
        </div>
    </div>

    <div class="template-list">
        <table class="table table-bordered table-hover text-center">
            <thead>
                <tr style="background: #F3F3F3;">
                    <th>订购详细</th>
                    <th class="text-center">收货人</th>
                    <th class="text-center">总计</th>
                    <th class="text-center">状态</th>
                    <th class="text-center">留言</th>
                </tr>
            </thead>
            <tbody id="tbody_data"></tbody>
        </table>
    </div>
    <div class="text-right" id="page"></div>
</div>

<script src="/js/framework/page.js"></script>
<script src="/js/controllers/order.js"></script>