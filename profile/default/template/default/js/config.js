var lanh = {
    apiHost: "",
    userID: "1644255256",
    userName: "tigger",
    realName: "糖果"
}
var userinfo = Kplus.getCookie("user.info");
var isLogin = !!userinfo && userinfo !== "";
if (isLogin) {
    lanh.userID = userinfo.split("$")[0];
    lanh.realName = decodeURI(userinfo.split("$")[1]);
    lanh.userName = decodeURI(userinfo.split("$")[2]);
} else {
    document.location.href = "login";
}