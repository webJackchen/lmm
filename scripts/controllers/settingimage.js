'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingimageCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingImageCtrl', ["$scope", "$element",
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
              src: "../../images/no_image_220x220.jpg",
              target: "none",
              href: "",
          }, $scope.data);

          if (!!$scope.data.href) {
              $scope._hrefName = $scope.data.href;
          }

          //image manage控件的回调事件
          $scope.$on("selectedImage", function (e, selected) {
              if (!!selected) {
                  $scope.data.src = selected.src;
              }
          });

          $scope.$on("linkCallback", function (e, linkData) {

              $scope._linkData = linkData;
              $scope.data.href = linkData.value;
              //$scope._hrefName = linkData.title;
              $scope._hrefName = linkData.title || linkData.value;

              $scope.data = $.extend(linkData, $scope.data, { type: linkData.type, value: linkData.value });
          });

          $scope.btnOK = function () {
              if ($scope.data.target === 'none') {
                  $scope.data.href = "";
              }


              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, {
                  data: $scope.data, template: $scope.template, style: $scope.style
              });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
