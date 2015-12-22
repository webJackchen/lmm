'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingcustomerservicesCtrl
 * @description
 * # SettingcustomerservicesCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingcustomerservicesCtrl', ['$scope', '$element',
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

          $scope.data = $.extend({
              allowPush: 'true',
              timeLimit: '0',
              showWorktime: 'false',
              showContact: 'false'
          }, $scope.data);

          $scope.applySetting = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  style: $scope.style,
                  template: $scope.template
              });
              $element.parent().dialog("close");
          }
      }]);
