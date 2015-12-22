<div class="safe">
    <ul class="nav nav-tabs management-content-bar nopadding">
        <li>手机验证</li>
    </ul>

    <div class="conditionQuery form-horizontal">
        <div class="health_fastbar">
            <div class="health_flow col-sm-4 nopadding">
                <div class="progress progress-blue">
                    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">
                        <span class="sr-only">50% Complete</span>
                    </div>
                </div>
                <div class="flow_descript_background">
                    <ul class="flow_background nopadding">
                        <li class="background_ok col-sm-6 nopadding" id="background_1"></li>
                        <li class="background_h col-sm-6 nopadding" id="background_2">2</li>
                    </ul>
                    <ul class="flow_descript nopadding">
                        <li class="col-sm-6 nopadding">手机验证</li>
                        <li class="col-sm-6 nopadding">完成</li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="health_descript_1">
            <form method="post" id="dataForm">
                <div class="form-group">
                    <div class="col-sm-2 control-label">手机号码：</div>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" placeholder="手机号码" id="txtPhone" name="txtPhone" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-2 control-label">手机效验码：</div>
                    <div class="col-sm-7">
                        <input type="text" class="form-control" placeholder="手机效验码" maxlength="6" id="txtPhoneCode" name="txtPhoneCode" />
                    </div>
                    <div class="col-sm-3">
                        <a class="btn btn-default" href="javascript:void(0);">获取短信效验码</a>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-2 control-label">验证码：</div>
                    <div class="col-sm-7">
                        <input type="text" class="form-control" placeholder="验证码" maxlength="6" id="txtVerifyCode" name="txtVerifyCode" />
                    </div>
                    <div class="col-sm-3 verify">
                        <img id="imgVerifyCode" src="#" />
                        <span class="ml10">看不清？</span>
                        <a class="aVerifyCode" href="javascript:void(0);">换一张</a>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button class="btn btn-primary">确认</button>
                    </div>
                </div>
            </form>
        </div>
        <div id="health_descript_2" class="hidden">
            <span class="col-sm-2 text-right"><i class="iconfont icon-ok1"></i></span>
            <div class="col-sm-10 verifysec">
                <p class="health_default"><strong>恭喜！手机验证成功</strong></p>
                <p class="health_default">5秒后自动跳转...或<a class="alink" href="views/accountsafe">点击跳转</a></p>
            </div>
        </div>
    </div>
</div>

<script src="/js/controllers/verifyphone.js"></script>