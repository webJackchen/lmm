//Global Configs
var lanh = {
    version: "2.2",
    apiHost: "http://kplusdesign.dev:8092/",
    //apiHost: "http://localhost:18080/",
    _kPlusPath: "http://{0}.kplusdesign.test:8033/manage/",
    //mock_kid: "1269341300",
    kPlusPath: function (kid) {
        var _kPlusPath = "";
        if (!!lanh.mock_kid) {
            _kPlusPath = lanh._kPlusPath.replace("{0}", lanh.mock_kid);
        } else if (!!kid) {
            _kPlusPath = lanh._kPlusPath.replace("{0}", kid);
        }
        return _kPlusPath;
    }
};
lanh.apiPath = lanh.apiHost + "api/";

angular.module('lanhKdesignApp')
.constant('GlobalConfig', {
    showLoading: true,
    service: {
        url: '',
        fileServerUrl: '',
        restServerUrl: lanh.apiPath
    }
});