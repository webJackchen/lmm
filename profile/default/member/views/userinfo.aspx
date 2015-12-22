<div class="columnTitle" style="color: #3ec5df;">
    <label>基本信息</label>
</div>
<div class="form-panel">
    <form id="memberDataForm" class=" form-horizontal">
        <div class="form-group row">
            <div>
                <div class="col-sm-2">
                    <label class="pull-right">账号：</label>
                </div>
                <div class="col-sm-10">
                    <label id="username"></label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">会员昵称：</label>
                    <span style="color: red;" class="pull-right control-label">*</span>
                </div>
                <div class="col-sm-10">
                    <input type="text" id="name" name="name" class="form-control" placeholder="请输入会员昵称">
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">性别：</label>
                </div>
                <div class="col-sm-10">
                    <div class=" form-radio ">
                        <label class="radio-inline ng-binding">
                            <input type="radio" value="1" name="sex">
                            男
                        </label>
                    </div>
                    <div class="form-radio">
                        <label class="radio-inline ng-binding">
                            <input type="radio" value="0" name="sex">
                            女
                        </label>
                    </div>
                    <div class=" form-radio">
                        <label class="radio-inline ng-binding">
                            <input type="radio" value="保密" name="sex">
                            保密
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2">
                    <label class="pull-right ">当前等级：</label>
                </div>
                <div class="col-sm-10">
                    <label id="special"></label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">邮箱：</label>
                </div>
                <div class="col-sm-8">
                    <input type="text" id="mail" name="mail" class="form-control" placeholder="请输入邮箱">
                </div>
                <div class="col-sm-2">
                    <a href="views/verifyemail" class="a-update js_mailUpdate alink" style="display: none;">修改</a>
                    <a href="views/verifyemail" class="a-update js_mailBind alink">绑定</a>
                    <label class="js_mailStatus control-label" style="display: none;">已验证</label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">手机号：</label>
                </div>
                <div class="col-sm-8">
                    <input type="text" id="mobilephone" name="mobilephone" class="form-control" placeholder="请输入手机号">
                </div>
                <div class="col-sm-2">
                    <a href="views/verifyphone" class="a-update js_phoneUpdate alink" style="display: none;">修改</a>
                    <a href="views/verifyphone" class="a-update js_phoneBind alink">绑定</a>
                    <label class="js_phoneStatus control-label" style="display: none;">已验证</label>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 "></div>
                <div class="col-sm-10">
                    <button class="btn btn-primary">保存</button>
                </div>
            </div>
        </div>
    </form>
</div>
<script src="/js/controllers/userinfo.js"></script>
