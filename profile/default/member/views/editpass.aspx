<div class="safe">
    <ul class="nav nav-tabs management-content-bar nopadding">
        <li>账户设置</li>
    </ul>

    <div class="conditionQuery form-horizontal">
        <form method="post" id="dataForm">
            <div class="form-group">
                <span class="col-sm-2 control-label">原密码：</span>
                <span class="col-sm-10">
                    <input type="password" class="form-control" placeholder="原密码" id="txtPasswordOld" name="txtPasswordOld" /></span>
            </div>
            <div class="form-group">
                <span class="col-sm-2 control-label">新密码：</span>
                <span class="col-sm-10">
                    <input type="password" class="form-control" placeholder="新密码" id="txtPasswordNew" name="txtPasswordNew" /></span>
            </div>
            <div class="form-group">
                <span class="col-sm-2 control-label">确认密码：</span>
                <span class="col-sm-10">
                    <input type="password" class="form-control" placeholder="确认密码" id="txtPasswordOk" name="txtPasswordOk" /></span>
            </div>
            <div class="form-group">
                <span class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-primary">确认</button>
                </span>
            </div>
        </form>
    </div>
</div>

<script src="/js/controllers/editpass.js"></script>
