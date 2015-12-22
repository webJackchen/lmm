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

    <title>K+ 个人中心</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="shortcut icon" href="favicon.ico" />
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <!-- build:css(app) styles/vendor.css -->
    <link href="/css/bootstrap/bootstrap.css" rel="stylesheet" />
    <link href="/css/font-awesome/css/font-awesome.css" rel="stylesheet" />
    <link href="/css/jquery-ui/smoothness/jquery-ui.css" rel="stylesheet" />
    <link href="/css/daterangepicker/daterangepicker.css" rel="stylesheet" />
    <link href="/css/iconfont/iconfont.css" rel="stylesheet" />
    <!-- endbuild -->
    <!-- build:css(.tmp) styles/main.css -->
    <link href="/css/framework/profile.css" rel="stylesheet" />
    <!-- endbuild -->
    <link href="/css/views/default.css" rel="stylesheet" />
</head>
<body>
    <!--[if lte IE 8]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    <%--<div class="container container-fluid">
        <div class="text-right" style="margin: 8px 0;">欢迎您！糖果 | 回到首页 | 客户服务</div>
    </div>--%>
    <div style="width: 100%; background-color: #3ec5df; height: 80px; line-height: 80px; color: #fff;">
        <div class="container container-fluid">
            <div class="col-sm-4 text-left" style="font-size: 24px;">
                个人中心
            </div>
            <div class="col-sm-7 text-right" style="font-size: 16px;">
                <a href="index" style="color: #fff;" id="loginUser"></a>
            </div>
            <div class="col-sm-1 text-right" style="font-size: 16px; cursor: pointer;" onclick="exitLog()">
                退出
            </div>
        </div>
    </div>
    <div class="container container-fluid">
        <div class="row body">
            <div class="col-sm-2">
                <div class="menu-left">
                    <div class="menu-group-title">
                        <label>账户设置</label>
                    </div>
                    <a id="userInfoChoose" class="menu-item alink" href="views/userinfo">个人信息</a>
                    <a class="menu-item alink" href="views/accountsafe">账户安全</a>
                    <a id="addressChoose" class="menu-item alink" href="views/address">收货地址</a>
                    <div class="menu-group-title">
                        <label>交易信息</label>
                    </div>
                    <a class="menu-item alink" href="views/order">我的订购</a>
                    <a class="menu-item alink" href="views/ordergoods">我的订单</a>
                    <div class="menu-group-title">
                        <label>消息中心</label>
                    </div>
                    <a id="messageChoose" class="menu-item alink" href="views/message">我的留言</a>
                    <a id="commentChoose" class="menu-item alink" href="views/comment">我的评价</a>
                </div>
            </div>
            <div class="col-sm-10 content-body" id="content"></div>
        </div>
    </div>
    <!--提示-->
    <div class="palert"></div>
    <!--透明背景 -->
    <div class="shade" id="shade"></div>

    <script src="/js/jquery/jquery.js"></script>
    <script src="/js/jquery/moment.js"></script>
    <script src="/js/jquery/daterangepicker.js"></script>
    <script src="/js/jquery/jquery.cookie.js"></script>
    <script src="/js/framework/jquery-ui/jquery-ui.js"></script>
    <script src="/js/framework/kplus.js"></script>
    <script src="/js/framework/bootstrap.min.js"></script>
    <script src="/js/framework/jquery.dialog.js"></script>

    <script src="/js/framework/jquery.validate.js"></script>
    <script src="/js/framework/validate.js"></script>
    <script src="/js/framework/messages_cn.js"></script>
        <script src="/js/controllers/orderaction.js"></script>
    <script src="/js/config.js"></script>
    <script src="/js/controllers/user.js"></script>
</body>
</html>
