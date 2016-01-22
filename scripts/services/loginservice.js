'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.loginService
 * @description
 * # loginService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('loginService', ["storage", "$location", "$http",
      function (storage, $location, $http) {
          var self = this;

          self.setPlatformType = function (platformType) {
              if (!platformType || platformType === '') {
                  platformType = 'Web';
              }
              storage.session.set('platformType', platformType);
          }

          self.getPlatformType = function () {
              var platformType = storage.session.get('platformType');
              if (!platformType || platformType === '') {
                  platformType = 'Web';
              }
              return platformType;
          }

          self.setGlobalhTML = function (data, callback) {
              var url = 'GlobalSetting';
              debugger;
              $http.put(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.getGlobalhTML = function (callback) {
              var url = 'GlobalSetting ';
              $http.get(lanh.apiPath + url)
                .success(function (result) {
                    callback(result);
                });
          }


          self.login = function (username, password, isKplusUser, callback) {
              if (!!isKplusUser) {
                  storage.session.set('loginUserName', username);
                  storage.session.set("lanh-kdesign-token", username);
                  storage.session.set("lanh-kdesign-role", null);
                  storage.session.set('isKplusUser', true);
                  storage.session.set("manuscript_kid", username);
                  _loginValidater("login");
              } else {
                  $http.post(lanh.apiPath + "login", {
                      loginName: username,
                      password: password
                  }).success(function (result) {
                      if (result && result.loginSuccess) {
                          storage.session.set('loginUserName', username);
                          storage.session.set("lanh-kdesign-token", result.userInfo.token);
                          storage.session.set("lanh-kdesign-role", result.userInfo.userType == 1 ? "admin" : "user");
                          _loginValidater("login");
                      }
                      callback(result);
                  });
              }
          }

          self.logout = function () {
              storage.session.del("loginUserName");
              storage.session.del("lanh-kdesign-token");
              storage.session.del("lanh-kdesign-role");
              storage.session.del("isKplusUser");
              storage.session.del("manuscript_kid");
              _loginValidater("logout");
          }

          self.getLoginInfo = function () {
              var identification = storage.session.get('kplus_identification');
              if (identification) {
                  if (lanh._kPlusPath.indexOf('?') >= 0) {
                      lanh._kPlusPath = lanh._kPlusPath.substring(0, lanh._kPlusPath.indexOf('?'));
                  }
                  lanh._kPlusPath += '?identification=' + identification;
              }
              return {
                  userName: storage.session.get('loginUserName'),
                  token: storage.session.get('lanh-kdesign-token'),
                  role: storage.session.get("lanh-kdesign-role"),
                  isKplusUser: storage.session.get('isKplusUser'),
                  manuscript_kid: storage.session.get("manuscript_kid"),
                  kplusPath: lanh.kPlusPath(storage.session.get("manuscript_kid"))
              };
          }

          var _loginValidater = function (action) {
              var params = $location.search();
              if ($location.path() == "/login" && !action) {
                  storage.session.del("tmpParams");
                  storage.session.del("loginUserName");
                  storage.session.del("lanh-kdesign-token");
                  storage.session.del("lanh-kdesign-role");
                  storage.session.del("isKplusUser");
                  storage.session.del("manuscript_kid");
              } else {
                  if (!!params) {
                      storage.session.set("tmpParams", JSON.stringify(params));
                  }
              }
              if (!!storage.session.get("lanh-kdesign-token")) {
                  if ($location.path() == "/" || $location.path() == "/login") {
                      //调用API验证，成功并返回新的登录凭证，跳转页面。
                      $location.path('/management');
                  }
              } else {
                  if (!action) {
                      $location.path('/login');
                  }
                  else if (!!params.u) {
                      location.href = lanh.kPlusPath(params.u);
                  }
                  else {
                      $location.path('/login');
                  }
              }
          }

          _loginValidater();

          self.getUserInfo = function (callback) {
              $http.get(lanh.apiPath + "user")
                .success(function (result) {
                    callback(result);
                });
          }
      }
  ]);
