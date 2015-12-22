'use strict';

/**
 * @ngdoc overview
 * @name lanhKdesignApp
 * @description
 * # lanhKdesignApp
 *
 * Main module of the application.
 */
angular
  .module('lanhKdesignApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    "flow",
    "ui.bootstrap"
  ])
  //.config(["$locationProvider", function ($locationProvider) {
  //    $locationProvider.html5Mode(true);
  //}])
  .config(["$routeProvider", function ($routeProvider) {
      $routeProvider
        .when('/', {
            templateUrl: 'views/login.tpl.html',
            controller: 'LoginCtrl'
        })
        .when('/login', {
            templateUrl: 'views/login.tpl.html',
            controller: 'LoginCtrl'
        })
        .when('/management', {
            templateUrl: 'views/management.tpl.html',
            controller: 'ManagementCtrl'
        })
        .when('/framework', {
            templateUrl: 'views/framework.tpl.html',
            controller: 'FrameworkCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
  }])
  .config(["$httpProvider", function ($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

      var _requestCount = 0;
      var _showLoading = function () {
          if ($(".loading-container").length == 0) {
              $("body").append("<div class=\"loading-container\"><div class=\"loading-loader\"><div class=\"loader\"><div class=\"loader-inner pacman\"><div></div><div></div><div></div><div></div><div></div></div></div></div></div>");
          }
          if (_requestCount > 0) {
              $(document.body).css({
                  overflow: 'hidden'
              });
              $('.loading-container').css({
                  display: 'table-cell',
                  height: '100%'
              }).show();
          }
      }
      var _hideLoading = function () {
          if (_requestCount <= 0) {
              $(document.body).css({
                  overflow: 'auto'
              });
              $('.loading-container').hide();
              _requestCount = 0;
          }
      }

      $httpProvider.interceptors.push(["$q", "storage", "messengerService", function ($q, storage, messengerService) {
          return {
              "request": function (config) {
                  //mock data
                  var _authorizationCode = "";
                  if (!!lanh.mock_kid) {
                      _authorizationCode = lanh.mock_kid;
                  } else {
                      _authorizationCode = storage.session.get("manuscript_kid") || "";
                  }
                  config.headers["AuthorizationCode"] = _authorizationCode + (storage.session.get("isKplusUser") == "true" ? "_kuser" : "");
                  config.headers["KDesignLoginCode"] = storage.session.get("loginUserName");

                  if (config.url.indexOf(".tpl.html") != -1 ||
                      config.url.indexOf(".js") != -1 ||
                      config.url.indexOf(".css") != -1) {
                      var buts = "buts=" + Date.now();
                      config.url = config.url + (config.url.indexOf("?") == -1 ? "?" : "&") + buts;
                  }

                  if (config.url.indexOf(".tpl.html") == -1) {
                      _requestCount++;
                      _showLoading();
                  }
                  return config;
              },

              "requestError": function (rejection) {
                  messengerService.error("请求资源发生错误，请与管理员联系。<br/>错误链接: " + rejection.config.url);
                  _requestCount--;
                  _hideLoading();
                  return $q.reject(rejection);
              },

              "response": function (response) {
                  _requestCount--;
                  _hideLoading();
                  return response;
              },

              "responseError": function (rejection) {
                  messengerService.error("API返回数据时发生错误，请与管理员联系。<br/>错误链接: " + rejection.config.url);
                  _requestCount--;
                  _hideLoading();
                  return $q.reject(rejection);
              }
          }
      }]);

      //监听jQuery的ajax
      $(document).ajaxSend(function (event, jqXHR, ajaxOptions) {
          _requestCount++;
          _showLoading();
      });

      $(document).ajaxComplete(function (event, xhr, settings) {
          _requestCount--;
          _hideLoading();
      });

      $(document).ajaxError(function (event, xhr, settings) {
          messengerService.error("API返回数据时发生错误，请与管理员联系。<br/>错误链接: " + rejection.config.url);
          _requestCount--;
          _hideLoading();
      });
  }])
  .config(['$sceDelegateProvider', function ($sceDelegateProvider) {
      $sceDelegateProvider.resourceUrlWhitelist([
       // Allow same origin resource loads.
       'self',
       // Allow loading from our assets domain.  Notice the difference between * and **.
       'http://media.w3.org/**']);
  }]);
