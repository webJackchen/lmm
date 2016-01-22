<div class="columnTitle" style="color: #3ec5df;">
    <label>收货地址</label>
</div>
<div class="form-panel">
    <form id="addressDataForm" class=" form-horizontal">
        <div class="form-group row">
            <div>
                <div class="col-sm-2">
                    <label class="pull-right control-label">收货人：</label>
                    <span style="color: red;" class="pull-right control-label">*</span>
                </div>
                <div class="col-sm-10">
                    <input type="text" id="name" name="name" class="form-control" maxlength="20" placeholder="请输入收货人">
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div id="city">
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">收货地址：</label>
                    <span style="color: red;" class="pull-right control-label">*</span>
                </div>
                <div class="col-sm-2">
                    <select id="province" class="prov form-control ng-pristine ng-valid ng-touched" onchange="changeData(this.value,'province')"></select>
                </div>
                <div class="col-sm-2">
                    <select id="select_city" class="city form-control ng-pristine ng-valid ng-touched" style="display: none;" disabled="disabled" onchange="changeData(this.value,'city')"></select>
                </div>
                <div class="col-sm-2">
                    <select id="district" class="dist form-control ng-pristine ng-valid ng-touched" style="display: none;" disabled="disabled" onchange="changeData(this.value,'district')"></select>
                </div>
            </div>
        </div>
        <div class="form-group row">

            <div class="col-sm-2 ">
                <label class="pull-right control-label">详细地址：</label>
                <span style="color: red;" class="pull-right control-label">*</span>
            </div>
            <div class="col-sm-10">
                <div id="addressHeadDiv" class="pull-left" style="display: none;">
                    <label id="labProvince" style="font-size: 14px; font-weight: normal;"></label>
                    <label id="labCity" style="font-size: 14px; font-weight: normal;"></label>
                    <label id="labDistrict" style="font-size: 14px; font-weight: normal;"></label>
                </div>
                <div id="addressDiv" class="pull-left col-sm-8" style="padding-left: initial;">
                    <input type="text" id="address" name="address" class="form-control" maxlength="50" onkeyup="adressInputLengthLimit(this.value,this,50)" placeholder="请输入详细地址">
                </div>
            </div>
        </div>

        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">手机号码：</label>
                    <span style="color: red;" class="pull-right control-label">*</span>
                </div>
                <div class="col-sm-4">
                    <input type="text" id="mobile" name="mobile" class="form-control" placeholder="请输入手机号码"  onblur=' promptHide("phoneVerify")'>
                    <label id="phoneVerify" style="display: none;" for="text" generated="true" class="error">请输入联系方式</label>
                </div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">或   固定电话：</label>
                </div>
                <div class="col-sm-4">
                    <input type="text" id="phone" name="phone" class="form-control" placeholder="请输入固定电话"  onblur=' promptHide("phoneVerify")'>
                </div>
            </div>
        </div>
        <div class="form-group row">
            <div>
                <div class="col-sm-2 ">
                    <label class="pull-right control-label">电子邮箱：</label>
                </div>
                <div class="col-sm-10">
                    <input type="text" id="mail" name="mail" class="form-control" placeholder="请输入电子邮箱">
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
<script src="/js/controls/cityselect/js/city.min.js"></script>
<script src="/js/controls/cityselect/js/jquery.cityselect.js"></script>
<script>
    $("#city").citySelect();
</script>
<script src="/js/controllers/address.js"></script>
