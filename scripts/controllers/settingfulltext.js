'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingfulltextCtrl
 * @description
 * # SettingfulltextCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingfulltextCtrl', ['$scope', '$element',
      function ($scope, $element) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }


          var data = $scope.data = angular.extend({
              emptyText: '请输入文章或产品名称'
          }, $scope.data);


          $scope.applySetting = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }
      }]);
