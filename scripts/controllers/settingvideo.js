'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingvideoCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingVideoCtrl', ["$scope", "$element",
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
              poster: "../../images/no_image_220x220.jpg",
              src: "",
              autoplay: "false"
          }, $scope.data);

          $scope.$on("selectedImage", function (e, selected) {
              if (!!selected) {
                  $scope.data.poster = selected.src;
              }
          });

          $scope.mediaSelected = function (mediaItem) {
              $scope.data = $.extend($scope.data, mediaItem);
              //$scope.data.src = $sce.trustAsResourceUrl($scope.data.src);
          }


          $scope.btnOK = function () {
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.data.autoplay = data.autoplay;
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });
              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
