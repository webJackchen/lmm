'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingmessageboardCtrl
 * @description
 * # SettingmessageboardCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingmessageboardCtrl', ['$scope', '$element',
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

          //$scope.data = {
          //    title: '留言板',
          //    titleTextAlign: 'left',
          //    welcomeTitle: '欢迎',
          //    submitText: '提交留言',
          //    hideTitle: false,
          //    hideWelcomeTitle: false
          //}
          $scope.setAlign = function (alignText) {
              $scope.data.titleTextAlign = alignText;
          }

          $scope.applySetting = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }

      }]);