<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <!-- HTTP 1.1 -->
    <meta http-equiv="pragma" content="no-cache">
    <!-- HTTP 1.0 -->
    <meta http-equiv="cache-control" content="no-cache">
    <!-- Prevent caching at the proxy server -->
    <meta http-equiv="expires" content="0">

    <title>结算页</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" href="favicon.ico" />
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(app) styles/vendor.css -->
    <link href="/css/bootstrap/bootstrap.css" rel="stylesheet" />
    <link href="/css/iconfont/iconfont.css" rel="stylesheet" />
    <!-- endbuild -->
    <!-- build:css(.tmp) styles/main.css -->
    <link href="/css/views/orderform.css" rel="stylesheet" />
    <!-- endbuild -->
</head>
<body>
    <!--[if lte IE 8]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <div class="container container-fluid">
        <div class="row body">
            <h4>填写并核对订单信息</h4>
            <div class="col-sm-12 content-body">
                <div class="row bottom-border">
                    <div class="log-info">
                        <h5 class="pull-left">收货人信息</h5>
                    </div>
                    <div class="col-sm-12 address-info">
                        <span class="default-address">收货地址</span>
                    </div>
                </div>
                 <div class="row bottom-border">
                    <div class="log-info">
                        <h5 class="pull-left">支付方式</h5>
                    </div>
                    <div class="col-sm-12 pay-info">
                        <span class="active">在线支付</span>
                        <span>货到付款</span>
                    </div>
                </div>
                <div class="row bottom-border">
                    <div class="log-info">
                        <h5 class="pull-left">送货清单</h5>
                    </div>
                    <div class="col-sm-12 goods-info"></div>
                </div>
                <div class="row pay">
                    <div class="col-sm-12 text-right">
                        应付总额：<span class="pay-moeny"></span>
                        <a href="javascript:void(0)" class="buttom-form">提交订单</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="/js/jquery/jquery.js"></script>
    <script src="/js/controllers/orderform.js"></script>
    <script src="/js/jquery/jquery.cookie.js"></script>
</body>
</html>
