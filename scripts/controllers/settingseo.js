﻿'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingSeoCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingSeoCtrl', ["$scope", "$element","baseService",
      function ($scope, $element, baseService) {
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

          var seo = $scope.seo = $.extend({
              keywords: "",
              description: ""
          }, $scope.seo);
          

          $scope.btnOK = function () {
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting.seo", {
                  seo: $scope.seo
              });
              
              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
