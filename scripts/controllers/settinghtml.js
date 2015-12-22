'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingmessageboardCtrl
 * @description
 * # SettingmessageboardCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettinghtmlCtrl', ['$scope', '$element',
      function ($scope, $element) {
          $scope.awesomeThings = [
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

          $scope.applySettingHtml = function () {
              $scope.data.code = $scope.data.code.split("\n").join("<br>");
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }
      }]);
