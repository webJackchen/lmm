'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingLineHorizontal
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingLineHorizontalCtrl', ["$scope", "$element", "$timeout", "spectrumService",
      function ($scope, $element, $timeout, spectrumService) {
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
              color: "",
              borderStyle: "",
              borderWidth: "",
              borderRadius: "",
              opacity: 100
          }, $scope.data);

          $element.find("#borderColorPicker").spectrum($.extend(spectrumService.options, {
              color: $scope.data.color,
              change: function (color) {
                  $timeout(function () {
                      $scope.data.color = !!color ? color.toHexString() : "";
                  });
              }
          }));


          var sliderEvent = {
              reg: function (modelName) {
                  var sender = this;
                  sender.on('slide', function () {
                      $scope.$apply(function () {
                          $scope.data.opacity = sender.getValue();
                      })
                  });
                  sender.on('change', function (args) {
                      $scope.$apply(function () {
                          $scope.data.opacity = args.newValue;
                      })
                  });
              }
          };
          var sliderOpacity = new Slider($($element).find('#border-opacity')[0]);
          sliderEvent.reg.call(sliderOpacity);


          $scope.$watch('data.opacity', function (newVal) {
              if (newVal != undefined) {
                  sliderOpacity && sliderOpacity.setValue(newVal);
              }
          });
                


          $scope.btnOK = function () {
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
