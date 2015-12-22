'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:LoginCtrl
 * @description
 * # LoginctrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('LoginCtrl', ["$scope", "$location", "storage", "loginService", "messengerService",
      function ($scope, $location, storage, loginService, messengerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          var params = storage.session.get("tmpParams");
          if (!!params) {
              $location.search(JSON.parse(params));
          }

          var tpl_status = $scope.tpl_status = {
              mode: !!$location.search().u || !!$location.search().u
          }

          $scope.login = function () {
              if (!tpl_status.mode) {
                  if (!$scope.username) {
                      messengerService.info("用户名不能为空");
                      return false;
                  }
                  if (!$scope.password) {
                      messengerService.info("密码不能为空");
                      return false;
                  }
                  loginService.login($scope.username, $scope.password, null,
                      function (result) {
                          $scope.password = "";
                          if (!result || !result.loginSuccess) {
                              messengerService.error("用户名或密码输入错误");
                          }
                      });
              } else {
                  loginService.login($location.search().kPlusUser || $location.search().u, "", true);
              }
          }
      }
  ]);
