'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingbreadcrumbsCtrl
 * @description
 * # SettingbreadcrumbsCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingbreadcrumbsCtrl', ['$scope', '$element', '$http', '$timeout', 'spectrumService',
      function ($scope, $element, $http, $timeout, spectrumService) {
          $scope.awesomeThings = [
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
          var menuInfo = $scope.$parent.currentPage,
              originalKey = (menuInfo.key || '').split('_')[0];

          if (originalKey !== 'default') {
              $http.get(lanh.apiPath + "proxy?isSection=true")
                  .success(function (result) {
                      var kplusObj = result.jsonText && JSON.parse(result.jsonText) || {},
                          dataList = kplusObj.channel.item !== '0' ? kplusObj.channel.item : [],
                          pages = [];
                      if (!angular.isArray(dataList)) dataList = [dataList];

                      $scope.data.source = [{
                          key: 'default',
                          text: '首页',
                          url: '/web/default.html'
                      }];

                      for (var i = 0, j = dataList.length; i < j; i++) {
                          if (hasItem(dataList[i], originalKey)) {
                              findItem(dataList[i], function (dataItem) {
                                  pages.push({
                                      text: dataItem.title.text,
                                      url: dataItem.url || "/web/" + dataItem.module + '_list' + dataItem.link
                                  });
                                  if (menuInfo.key.indexOf('_detail') >= 0) {
                                      pages.push({
                                          text: dataItem.title.text + '明细',
                                          url: dataItem.url || "/web/" + dataItem.module + '_detail' + dataItem.link
                                      });
                                  }
                              });
                              break;
                          }
                      }
                      $scope.data.source = $scope.data.source.concat(pages);
                  });
          }

          var findItem = function (item, callback) {
              if (!item) return false;
              if (angular.isArray(item)) {
                  for (var i = 0, j = item.length; i < j; i++) {
                      callback && callback(item[i]);
                      if (item[i].module === originalKey) return false;
                  }
              }
              else {
                  callback && callback(item);
              }
              if (item.module === originalKey) return false;

              findItem(item.item, callback);
          }

          var hasItem = function (item, key) {
              if (!item) return false;
              var list = item;
              if (!angular.isArray(list)) list = [list];
              for (var i = 0, j = list.length; i < j; i++) {
                  if (list[i].module == key) return true;
              }
              hasItem(item.item, key);
          }


          $scope.source = {
              delimiters: ['▶', '■', '／', '>>'],
              fonts: [{
                  key: '微软雅黑',
                  text: '微软雅黑'
              }, {
                  key: '宋体',
                  text: '宋体'
              }, {
                  key: '黑体',
                  text: '黑体'
              }],
              fontSizes: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
          }


          $scope.setDelimiter = function (delimiter) {
              $scope.data.delimiter = delimiter;
              return false;
          }
          $scope.setBold = function () {
              $scope.data.fontBold = !$scope.data.fontBold;
          }
          $scope.setItalic = function () {
              $scope.data.fontItalic = !$scope.data.fontItalic;
          }
          $scope.setUnderline = function () {
              $scope.data.fontUnderline = !$scope.data.fontUnderline;
          }

          $element.find("#fontColorPicker").spectrum($.extend(spectrumService.options, {
              color: $scope.data.fontColor,
              change: function (color) {
                  $timeout(function () {
                      $scope.data.fontColor = !!color ? color.toHexString() : "";
                  });
              }
          }));

          var getFontStyleString = function () {
              var styleStyle = 'font-size:' + $scope.data.fontSize + 'px;';
              styleStyle += 'font-family:\'' + $scope.data.fontName + '\';';
              styleStyle += 'color:' + $scope.data.fontColor + ';';
              if ($scope.data.fontBold) styleStyle += 'font-weight:bold;';
              if ($scope.data.fontItalic) styleStyle += 'font-style:italic;';
              if ($scope.data.fontUnderline) styleStyle += 'text-decoration:underline;';
              return styleStyle;
          }

          $scope.applySetting = function () {
              $scope.data.settingStyle = getFontStyleString();
              $scope.$parent.$broadcast("framework.setting." + $scope.controlId, {
                  data: $scope.data,
                  template: $scope.template,
                  style: $scope.style
              });
              $element.parent().dialog("close");
          }

      }]);
