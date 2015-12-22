<link href="/css/views/message.css" rel="stylesheet" />
<div class="columnTitle" style="color: #3ec5df;">
    <label>我的留言</label>
    <button class="btn  btn-primary btn-delete pull-right" onclick="doBatchDeleteMessages()">删除</button>
    <button class="btn btn-add btn-primary pull-right" onclick="doAddMessage()">留言</button>
</div>
<div class="col-sm-12 messageContent">
    <div class="col-sm-12 messageTitle">
        <ul class="col-sm-12">
            <li style="width: 5%">&nbsp;</li>
            <li style="width: 25%">留言时间</li>
            <li style="width: 50%">留言内容</li>
            <li style="width: 20%">操作</li>
        </ul>
    </div>
    <div class="col-sm-12 messageList">
        <table class="table table-hover">
            <tbody>
            </tbody>
        </table>
    </div>
</div>
<div id="showMessageInfo" style="display: none;"></div>
<div id="messageAddDiv" style="display: none;">
    <div id="addMessage" class="form-panel" style="display: none; margin-top: 20px;">
        <form id="messageDataForm" class=" form-horizontal">
            <div class="form-group row">
                <div>
                    <div class="col-sm-2 ">
                        <label class="pull-right control-label">内容：</label>
                        <span style="color: red;" class="pull-right control-label">*</span>
                    </div>
                    <div class="col-sm-10">
                        <textarea class="form-control" id="messageContent" name="messageContent"  onblur=' promptHide("contentVerify")'></textarea>
                        <label id="contentVerify" style="display: none;" for="messageContent" generated="true" class="error">留言内容不能为空</label>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <div>
                    <div class="col-sm-2 ">
                        <label class="pull-right control-label">姓名：</label>
                        <span style="color: red;" class="pull-right control-label">*</span>
                    </div>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="person" name="person"  onblur=' promptHide("personVerify")'>
                        <label id="personVerify" style="display: none;" for="person" generated="true" class="error">姓名不能为空</label>
                    </div>
                </div>
            </div>
            <div class="form-group row">
                <div>
                    <div class="col-sm-2 ">
                        <label class="pull-right control-label">手机：</label>
                        <span style="color: red;" class="pull-right control-label">*</span>
                    </div>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="telephone" name="telephone" onblur=' promptHide("telephoneVerify")'>
                        <label id="telephoneVerify" style="display: none;" for="telephone" generated="true" class="error"></label>
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
                        <label  id="codeVerify" style="display: none;" for="txtVerifyCode" generated="true" class="error"></label>
                    </div>
                    <div class="col-sm-5 verify">
                        <img id="imgVerifyCode" src="#" style="width: 70px;" />
                        <span class="ml10">看不清？</span>
                        <a class="aVerifyCode" href="javascript:void(0);" onclick="verifyCode()">换一张</a>
                    </div>
                </div>
            </div>
            <div id="btnDiv" class="form-group text-center">
                <a class="btn btn-primary" onclick="doSubmitMessage()">提交留言</a>
            </div>
        </form>
    </div>
</div>
<script src="/js/controllers/message.js"></script>
<script src="/js/controllers/messageadd.js"></script>
