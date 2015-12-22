'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManagementCtrl
 * @description
 * # ManagementCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManagementCtrl', ["$scope", "loginService", "storage",
      function ($scope, loginService, storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $scope.tpl_status = {
              role:loginService.getLoginInfo().role ,
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

          /**admin info**/
          $scope.switchManuscriptAdmin = function (mode) {
              $scope.tpl_status.mode = mode;
              $scope.$broadcast("refreshManuscriptAdminList");
          }
      }
  ]);
