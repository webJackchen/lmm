'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingfulltextresultCtrl
 * @description
 * # SettingfulltextresultCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingfulltextresultCtrl', ['$scope', '$element',
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


          $scope.applySetting = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }
      }]);
