'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingNewsCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the SettingLinksCtrl
 */
angular.module('lanhKdesignApp')
  .controller('SettingLinksCtrl', ["$scope", "$element", "baseService", "$http", "lanhWindow", "$timeout", "$filter",
      function ($scope, $element, baseService, $http, lanhWindow, $timeout, $filter) {
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
              links: [],
              type: "text",
              row: 4,
              col: 3
          }, $scope.data);

          var addItemData = function () {
              $scope.data.$item$ = [];
              for (var i = 0; i < parseInt($scope.data.col) * parseInt($scope.data.row); i++) {
                  var _data = {
                      title: { "text": "友情链接" },
                      hyperLink: { "text": "http://www.baidu.com" },
                      image: { "url": "../../images/no_image_220x220.jpg" }
                  };
                  $scope.data.$item$.push(_data);
              }
          }

          $scope.$watch("data.row", function (newVal, oldVal) {
              if (parseInt(newVal) > 100) $scope.data.row = 100;
              else $scope.data.row = parseInt(newVal);

          })
          $scope.$watch("data.col", function (newVal, oldVal) {
              if (parseInt(newVal) > 100) $scope.data.col = 100;
              else $scope.data.col = parseInt(newVal);

          })


          $scope.btnOK = function () {
              addItemData();
              $scope.data.width = parseInt(parseInt(100 / $scope.data.col) - 2);
              if ($scope.data.$dataconfig.indexOf("<count>") !== -1) {
                  $scope.data.$dataconfig = $scope.data.$dataconfig.substring(0, $scope.data.$dataconfig.indexOf("<count>")) + "<count>" + parseInt($scope.data.col) * parseInt($scope.data.row) + "</count>";
              }

              $scope.data._fields = "";
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
