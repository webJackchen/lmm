'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingcomponentCtrl
 * @description
 * # SettingcomponentCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingcomponentCtrl', ['$scope', '$element', 'componentService', 'loginService',
      function ($scope, $element, componentService, loginService) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.componentData = [];
          $scope.imageUrl = lanh.apiHost;

          var paged = $scope.paged = {
              total: 0,
              index: 1,
              size: 8
          }

          var loginInfo = loginService.getLoginInfo();

          var queryPara = $scope.queryPara = {
              isDesigner: loginInfo.isKplusUser != "true",
              isOnlyActive: "true",
              deviceType: 'Web',
              title: ''
          }

          $scope.currentItem = {};
          $scope.selectItem = function (item) {
              if (!!item.key && item.key == $scope.currentItem.key) $scope.currentItem = {};
              else $scope.currentItem = item;
          }

          $scope.refreshList = function () {
              componentService.getList({
                  pageIndex: paged.index,
                  pageSize: paged.size,
                  editor: ($scope.queryPara.isOnlyActive === 'true' ? "" : loginInfo.userName),
                  prcoessStatus: ($scope.queryPara.isOnlyActive === 'true' ? "Active" : ""),
                  type: "",
                  keyWord: $scope.queryPara.title,
                  editTime: "",
                  isRemoved: false,
                  isDelete: false
              }, function (result) {
                  if (result) {
                      $scope.componentData = result.list;
                      paged.total = result.totalCount;
                  }
              });
          }
          $scope.refreshList();

          $scope.pageChanged = function () {
              $scope.refreshList();
          }

          $scope.btnOK = function () {
              $scope.$emit('framework.editor.component.select', $scope.currentItem.componentId);
              $element.parent().dialog("close");
          }
      }]);
