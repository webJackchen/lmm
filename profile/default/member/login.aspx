<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="renderer" content="webkit">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>K+会员登录</title>
  <link href="/manage/third-party/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
  <style type="text/css">
    html, body { width: 100%; height: 100%; margin: 0 auto; padding: 0; }
    body { background: url(/manage/images/bg_login.jpg) no-repeat 25% bottom; background-color: #b6b6b7; font-size: 12px; min-width: 800px; }
    .login-box { width: 388px; *width: 280px; padding: 23px 55px 45px 55px; background: url(/manage/images/bg_login2.jpg) no-repeat left top; position: absolute; left: 50%; top: 50%; margin-top: -205px; }
    .login-tt { font-size: 24px; line-height: 30px; color: #636363; margin: 0px 0px 23px 0px; }
    #user_name { width: 41px; height: 40px; *height: 38px; background: url(/manage/images/ico_lg_usr.png) no-repeat left center; background-color: #ffffff; margin: 0px; display: inline-table; float: left; }
    #user_psd { width: 41px; height: 40px; *height: 39px; background: url(/manage/images/ico_lg_pwd.png) no-repeat left center; background-color: #ffffff; margin: 0px; display: inline-block; float: left; }
    .login-info { height: 40px; margin-bottom: 13px; }
    .login-info input { font-size: 14px; padding: 9px 0px 11px 2px; width: 240px; height: 100%; border: 1px solid #ffffff; background-color: #ffffff; margin-left: -5px; vertical-align: top; float: left; }
    .login-tips { margin-top: 7px; margin-bottom: 16px; position: relative; }
    .login-tips a { position: absolute; right: 0px; top: 0px; line-height: 20px; _right: 52px; }
    #message_info { margin-bottom: 7px; position: relative; color: red; }
    .login-btn { display: block; font-size: 18px; height: 39px; line-height: 39px; background-color: #f8a117; text-align: center; color: #ffffff !important; }
    input:-webkit-autofill { -webkit-box-shadow: 0 0 0px 1000px white inset; }
    .checkbox { padding: 0px !important; color: #7d7d7d; }
    .checkbox label { vertical-align: text-top; }
    input[type=checkbox] { margin-top: 3px !important; float: none !important; vertical-align: bottom; }
    .btn-onuse { background-color: #CCCCCC; }
  </style>
</head>
<body>
  <div class="login-box">
    <h5 class="login-tt">登录</h5>
    <div class="login-info">
      <div id="user_name"></div>
      <input id="c_userName" maxlength="20" placeholder="请输入用户名" type="text" value="" />
    </div>
    <div class="login-info pwd">
      <div id="user_psd"></div>
      <input id="c_userPassword" maxlength="20" placeholder="请输入密码" type="password" value="" />
    </div>
    <div id="message_info"></div>
    <div id="message_submit">
      <a class="login-btn" href="javascript:viod(0);" id="login">登录</a>
    </div>
  </div>

  <script src="/js/jquery/jquery.min.js" type="text/javascript"></script>
    <script>
        $(function () {
            $("#login").click(function () {
                var _name = $("#c_userName").val();
                var _pass = $("#c_userPassword").val();

                var _xml = "<form><userName><![CDATA[" + _name + "]]></userName><userPassword><![CDATA[" + _pass + "]]></userPassword></form>";
                var _url = "/action/memberlogin";
                $.ajax({
                    url: _url,
                    type: "POST",
                    data: _xml,
                    dataType: "text",
                    beforeSend: function () {
                        $("#login").attr("disabled", "disabled").addClass("btn-onuse").text("登录中...");
                    },
                    success: function (_data) {
                        if (_data.indexOf("$") > 0) {
                            window.location.href = "index";
                            $("#message_info").html("");
                        } else {
                            $("#c_userName").focus();
                            $("#login").removeAttr("disabled").removeClass("btn-onuse").text("登录");
                            $("#message_info").html("密码错误，找回密码请联系网站管理员或拨打4008121146。");
                        }
                    },
                    error: function () {
                        $("#login").removeAttr("disabled").removeClass("btn-onuse").text("登录");
                        $("#message_info").html("服务器繁忙，请稍后重试！");
                        return false;
                    }
                });
            });
        });
    </script>
</body>
</html>