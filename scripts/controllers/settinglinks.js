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
              row: 1,
              col: 1
          }, $scope.data);

          if ($scope.data.links[0] && $scope.data.links[0].title.text === '在线制作') {
              $scope.data.links = [];
          }

          /*遍历数据，并转换数据类型*/
          var getLinkListData = function (links) {
              if (!angular.isArray(links)) {
                  links = [links];
              }
              for (var i = 0; i < links.length; i++) {
                  var linksIte = links[i];
                  linksIte.selected = false;
              }
              return links;
          }

          /*获取链接内容*/
          $scope.links = [];
          $scope.addLinks = function () {
              baseService.get("proxy?isLinks=true", function (result) {
                  if (result) {
                      var dataObj = JSON.parse(result.jsonText);
                      if (dataObj.channel.item != "0") {
                          $scope.links = getLinkListData(dataObj.channel.item);
                          for (var i = 0; i < $scope.links.length; i++) {
                              $scope.links[i].image.url = "http://" + dataObj.channel.host + $scope.links[i].image.url;
                              console.log(Boolean(isChecked($scope.links[i].link)))
                              $scope.links[i].selected = Boolean(isChecked($scope.links[i].link.text));
                          }
                      } else {
                          $scope.links = [];
                      }

                      $http.get("../../views/settings/settinglinks.tpl.html")
                      .success(function (result) {
                          lanhWindow.create({
                              title: "选择友情链接",
                              template: result
                          }, $scope);
                      });
                  }

              })
          }
          /*选择链接*/
          var selectItem = $.extend([], $scope.data.links);
          $scope.selectedLink = function (link) {
              link.selected = !link.selected;
              if (link.selected) {
                  selectItem.push(link);
              } else {
                  selectItem = $.grep(selectItem, function (n) { return n.link.text != link.link.text });
              }
          }

          var isChecked = function (link) {/*选中默认选中的数据*/
              if (!data || !data.links) return false;
              var links = data.links;
              if (!links || !links.length) return false;
              var queryResult = $filter('filter')(data.links, function (dataItem) {
                  return dataItem.link.text === link;
              });
              return queryResult && queryResult.length;
          }

          /*选择链接并窗口关闭*/
          $scope.closeLink = function ($event) {
              $scope.data.links = angular.copy(selectItem);
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*删除link*/
          $scope.removeLink = function (link) {
              $scope.data.links = $.grep(selectItem, function (n) { return n.link.text != link.link.text });
              selectItem = angular.copy($scope.data.links);
          }

          /*上移*/
          $scope.upmove = function (link) {
              var index = $scope.data.links.indexOf(link);
              if (index > 0) {
                  var tempLink = $scope.data.links[index - 1];
                  $scope.data.links[index - 1] = $scope.data.links[index]
                  $scope.data.links[index] = tempLink;

              }
          }
          /*下移*/
          $scope.downmove = function (link) {
              var index = $scope.data.links.indexOf(link);
              if (index < $scope.data.links.length) {
                  var tempLink = $scope.data.links[index + 1];
                  $scope.data.links[index + 1] = $scope.data.links[index]
                  $scope.data.links[index] = tempLink;

              }
          }



          $scope.btnOK = function () {
              $scope.data.width = parseInt(100 / $scope.data.col);
              if ($scope.data.links.length > parseInt($scope.data.col * $scope.data.row)) {
                  $scope.data.links.length = parseInt($scope.data.col * $scope.data.row);
              }
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
