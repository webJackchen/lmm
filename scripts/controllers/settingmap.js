'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingContentListCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingMapCtrl', ["$scope", "$element", "baseService", "$filter", "$timeout",
      function ($scope, $element, baseService, $filter, $timeout) {
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


          $scope.contentList = $.extend({
              source: {
                  content: []
              },
              attrs: {
                  link: "",
                  address: ""
              }
          }, $scope.data);

          /*页面加载数据*/
          var loadContactData = function (type) {
              var data = {
                  contentList: true,
                  contentType: "contact",
                  categories: "",
                  top: 100,
                  index: 100,
                  size: 100,
                  length: 10,
                  isHot: false,
                  isHome: false
              }

              baseService.get('proxy', data)
              .then(function (result) {
                  if (result.jsonText) {
                      var dataObj = JSON.parse(result.jsonText);
                      if (dataObj.channel.item !== '0') {
                          $scope.contentList.source.content = dataObj.channel.item;
                      } else {
                          $scope.contentList.source.content = [];
                      }
                  }
              });
          }

          //初始化
          loadContactData("contact");

          //选择内容
          $scope.changeContact = function (link) {
              $scope.contentList.attrs.link = link;
              $scope.contentList.attrs.address = "";
              for (var i = 0; i < $scope.contentList.source.content.length; i++) {
                  if ($scope.contentList.source.content[i].link.text == link) {
                      $scope.contentList.attrs.address = $scope.contentList.source.content[i].moduleInfo.address.text;
                  }
              }
          }

          //点击确定
          $scope.btnOK = function () {
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.contentList, template: $scope.template, style: $scope.style });
              $element.parent().dialog("close");
          }
      }
  ]);

