'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettinggallerygridCtrl
 * @description
 * # SettinggallerygridCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettinggallerygridCtrl', ['$http', '$scope', '$element', '$timeout'
      , function ($http, $scope, $element, $timeout) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.data = {
              $item$: [],
              attrs: {
                  row: '2',
                  col: '2'
              },
              edgeSpacing: 0,
              spacing: 0,
              isadd: false,
              spacingData:"padding:0"
          };

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }

          $scope.isCompontent = false;
          $scope.$emit("framework.get.editorInfo", function (result) {
              $scope.isCompontent = result.type == "component"
          });

          $scope.applySetting = function () {
              ////根据行列进行数据截断的处理
              //var imageLength = $scope.data.attrs.row * $scope.data.attrs.col;
              //images =angular.copy($scope.data.source.images);
              //if (images.length < imageLength) imageLength = images.length;
              //$scope.data.source.images = images.slice(0, imageLength);
              if (!$scope.data.isadd) {
                  var imageLength = $scope.data.attrs.row * $scope.data.attrs.col;                  
                  $scope.data.$item$ = [];
                  for (var i = 0; i < imageLength; i++) {
                      $scope.data.$item$[i] = { "url": "javascript:void(0)", "image": { "url": "../../images/no_image_220x220.jpg" }, "allTitle": { "text": "Mock Data"+i } }
                  }
              }
              if (($scope.data.edgeSpacing - $scope.data.spacing / 2) > 0) {
                  $scope.data.spacingData = "padding:" + ($scope.data.edgeSpacing - $scope.data.spacing / 2) + "px";
              } else {
                  $scope.data.spacingData = "margin:" + ($scope.data.edgeSpacing - $scope.data.spacing / 2) + "px";
              }
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, { data: $scope.data, template: $scope.template, style: $scope.style });
              $element.parent().dialog("close");
          }
          $scope.$on("adCallback", function (e, result) {
              $scope.data = $.extend($scope.data, result.dataConfig);
              $scope.data.$item$ = result.data;
              $scope.data.isadd = true;
          });
      }]);
