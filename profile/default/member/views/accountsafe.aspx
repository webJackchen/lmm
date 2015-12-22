<div class="safe">
    <ul class="nav nav-tabs management-content-bar nopadding">
        <li>安全中心</li>
        <li class="pull-right">
            <ul class="nav nav-lv">
                <li class="nav-lv1 pull-left">安全级别：</li>
                <li class="nav-lv2 pull-right">
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
                </li>
            </ul>
        </li>
    </ul>

    <div class="conditionQuery form-horizontal">
        <div class="form-group">
            <span class="col-sm-1 text-center"><i class="iconfont icon-ok1" id="sucpass"></i></span>
            <span class="col-sm-1 nopadding">登陆密码：</span>
            <span class="col-sm-9 nopadding">互联网账号存在被盗风险，建议您定期更改密码以保护账户安全。</span>
            <a class="col-sm-1 alink" href="views/editpass">修改</a>
        </div>
        <div class="form-group">
            <span class="col-sm-1 text-center"><i class="iconfont icon-excalmatory-mark" id="sucemail"></i></span>
            <span class="col-sm-1 nopadding">邮箱验证：</span>
            <span class="col-sm-9 nopadding" id="useremail">您还没有进行邮箱验证，为避免账户被盗，请尽快验证</span>
            <a class="col-sm-1 alink" href="views/verifyemail">设置</a>
        </div>
        <div class="form-group">
            <span class="col-sm-1 text-center"><i class="iconfont icon-excalmatory-mark" id="sucphone"></i></span>
            <span class="col-sm-1 nopadding">手机验证：</span>
            <span class="col-sm-9 nopadding" id="userphone">您还没有进行手机验证，为避免账户被盗，请尽快验证</span>
            <a class="col-sm-1 alink" href="views/verifyphone">设置</a>
        </div>
    </div>
</div>

<script src="/js/controllers/accountsafe.js"></script>