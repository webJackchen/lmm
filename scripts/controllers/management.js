'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManagementCtrl
 * @description
 * # ManagementCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManagementCtrl', ["$scope", "loginService", "storage","$http","lanhWindow",
      function ($scope, loginService, storage, $http, lanhWindow) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $(document.body).removeClass('page-mobile-body');

          $scope.tpl_status = {
              role: loginService.getLoginInfo().role,
              isKplusUser: storage.session.get("isKplusUser"),
              mode: !storage.session.get("isKplusUser") ? "manuscript" : "template"   //manuscript || recycle || editor || template
          }

          /*回收站*/
          $scope.recycle_status = {
              mode: "recycleTemplate"
          }

          $scope.btnExit = function () {
              loginService.logout();
          }

          /**user info**/

          /*稿件切换*/
          $scope.switchManuscript = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshManuscriptList");
          }

          /*样式库*/
          $scope.switchStyle = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshStyleList");
          }
          /*回收站*/
          $scope.switchRecycle = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshTemplateRecycle");
              $scope.$broadcast("refreshStyleRecycle");
              $scope.$broadcast("refreshComponentRecycle");
              $scope.$broadcast("refreshThemeRecycle");
          }
          /*稿件库回收*/
          $scope.switchRecycleManuscript = function (mode) {
              $scope.recycle_status.mode = mode;
              $scope.$broadcast("refreshTemplateRecycle");
          }
          /*样式回收*/
          $scope.switchRecycleStyle = function (mode) {
              $scope.recycle_status.mode = mode;
              $scope.$broadcast("refreshStyleRecycle");
          }
          /*组件库*/
          $scope.switchComponent = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshComponentList");
          }

          /*组件库回收*/
          $scope.switchRecycleComponent = function (mode) {
              $scope.recycle_status.mode = mode;
              $scope.$broadcast("refreshComponentRecycle");
          }

          /*主题库*/
          $scope.switchTheme = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshThemeList");
          }


          /*主题库回收*/
          $scope.switchRecycleTheme = function (mode) {
              $scope.recycle_status.mode = mode;
              $scope.$broadcast("refreshThemeRecycle");
          }


          /**admin info**/
          $scope.switchManuscriptAdmin = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshManuscriptAdminList");
          }

          $scope.$on('ManagementCtrl_changePlatformType', function (event, data) {
              $scope.changePlatformType();
          });

          $scope.changePlatformType = function () {
              var platformType = loginService.getPlatformType(),
                  leftBtn = $('.btn_left_platform'),
                  rightBtn = $('.btn_right_platform'),
                  webIcon = $('i.icon-computer'),
                  mobileIcon = $('i.icon-mobile-phone');

              if (platformType === 'Web') {
                  leftBtn.css('background', 'url(../images/management/btn_bg_platform_l02.png) no-repeat');
                  rightBtn.css('background', 'url(../images/management/btn_bg_platform_r01.png) no-repeat');
                  webIcon.css('color', '#FFFFFF');
                  mobileIcon.css('color', '#4C4C4C');
              }
              else {
                  leftBtn.css('background', 'url(../images/management/btn_bg_platform_l01.png) no-repeat');
                  rightBtn.css('background', 'url(../images/management/btn_bg_platform_r02.png) no-repeat');
                  webIcon.css('color', '#4C4C4C');
                  mobileIcon.css('color', '#FFFFFF');
              }
          }

          $scope.onIconMouseOver = function (platformType) {
              if (platformType === 'Web') {
                  $('i.icon-computer').css('color', '#42AABF');
              } else {
                  $('i.icon-mobile-phone').css('color', '#42AABF');
              }
          }

          $scope.onIconMouseLeave = function (platformType) {
              var _platformType = loginService.getPlatformType();
              if (platformType === 'Web') {
                  $('i.icon-computer').css('color', _platformType === 'Web' ? '#FFFFFF' : 'rgb(76, 76, 76)');
              } else {
                  $('i.icon-mobile-phone').css('color', _platformType === 'Mobile' ? '#FFFFFF' : 'rgb(76, 76, 76)');
              }
          }

          $scope.onPlatformClick = function (platformType) {
              if (loginService.getPlatformType() === platformType)
                  return;
              loginService.setPlatformType(platformType);
              $scope.changePlatformType();
              switch ($scope.tpl_status.mode) {
                  case 'manuscript':
                      $scope.$broadcast("refreshManuscriptList");
                      $scope.$broadcast("refreshManuscriptAdminList");
                      break;
                  case 'style':
                      $scope.$broadcast("refreshStyleList");
                      break;
                  case 'component':
                      $scope.$broadcast("refreshComponentList");
                      break;
                  case 'theme':
                      $scope.$broadcast("refreshThemeList");
                      break;
                  case 'recycle':
                      $scope.$broadcast("refreshRecycle");
                      break;
              }
          }
          $scope.systemSettings = function () {
              $http.get("/views/settings/systemsettings.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "系统设置",
                      template: result
                  },$scope)
              });
          }
      }
  ]);
