'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingfullslideCtrl
 * @description
 * # SettingfullslideCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingfullslideCtrl', ['$scope', '$element', '$http', '$timeout',
      function ($scope, $element, $http, $timeout) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          var data = $scope.data = {
              $item$: [],
              attrs: {
                  autoPlay: 'true',
                  autoPlayInterval: '1000',
                  isShowIcon: 'true'
              }
          };

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }

          $scope.applySetting = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }

          $scope.$on("adCallback", function (e, result) {
              $scope.data = $.extend($scope.data, result.dataConfig);
              $scope.data.$item$ = result.data;
          });
      }]);
