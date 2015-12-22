'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingJobCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingJobCtrl', ["$scope", "$element",
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

          var data = $scope.data = $.extend({
              btntext: "职位申请",
              wage: true,
              sex: true,
              date: true,
              record: true,
              experience: true,
              address: true,
              number:true
          }, $scope.data);


          $scope.btnOK = function () {
              console.log(data)
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
