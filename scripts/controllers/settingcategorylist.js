'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingCategoryListCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingCategoryListCtrl', ["$scope", "$element", "baseService", "$filter","$timeout","utilsService",
function ($scope, $element, baseService, $filter, $timeout, utilsService) {
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
              showType: true,
              category: "news",
              categories:[],/*显示分类*/
              data: [],
              selectedCategoies: null,/*选择的分类*/
              target: "_self",
              selectedAll: false
          }, $scope.data);

        /*递归遍历数据集，设置数据项的历史选择状态*/
          var getLinkListData = function (category) {
              var sourceCfg = { name: '全选', item: category, checked: data.selectedAll },
                  isChecked = function (dataItem) {//历史选中检测数据
                      var oldSeleced = data.selectedCategoies;
                      if (oldSeleced) {
                          var queryResult = $filter('filter')(oldSeleced, function (dataIt) {
                              return dataIt.link === dataItem.link;
                          });
                          return queryResult && !!queryResult.length;
                      }
                      return false;
                  };
              if (!angular.isArray(category)) {
                  sourceCfg.item = [category];
              }
              utilsService.loop(sourceCfg, 'item', function (currentItem, nextItem) {
                  if (currentItem && !angular.isArray(currentItem.item) && angular.isObject(currentItem.item)) currentItem.item = [currentItem.item];
                  if (nextItem && !angular.isArray(nextItem.item) && angular.isObject(nextItem.item)) nextItem.item = [nextItem.item];

                  if (data.selectedAll) {/*全选*/
                      currentItem.checked = nextItem.checked = true;
                  } else{
                      currentItem.checked = isChecked(currentItem);
                      nextItem.checked = isChecked(nextItem);
                  }

              });
              return [sourceCfg];
          }
            
          /*默认读取分类*/
          var loadCategoryData = function (type) {
              var categories = [];
              baseService.get('proxy/sections', { sectionType: type })
              .then(function (result) {
                  if (result) {
                      var dataObj = JSON.parse(result.jsonText);
                      if (dataObj.channel.item != "0") {
                          categories = getLinkListData(dataObj.channel.item);
                          $scope.data.categories = categories;
                      } else {
                          $scope.data.categories = [];
                      }
                  }
              });
          }
          loadCategoryData($scope.data.category);


          /*切换分类*/
          $scope.changeCategory = function () {
              data.selectedAll = false;
              loadCategoryData($scope.data.category);
          }

          /*选择分类*/
          $scope.selectedCurrentItems = function (item) {
              item.selected = !item.selected;
          }


          /*选择分类*/
          var getSelectedCategory = function (callback) {
              var resultItems = [], aliasKeys = [];
              if (data.categories.length > 0) {
                  data.selectedAll = data.categories[0].checked;
                  utilsService.loop(data.categories[0], 'item', function (currentItem, nextItem) {
                      if (nextItem.checked) {
                          if (resultItems.indexOf(nextItem) == -1) {
                              resultItems.push(nextItem);
                              aliasKeys.push(nextItem.link.text || nextItem.link);
                          }
                      }
                  });
                  $scope.data.data = angular.copy(resultItems);
                  $scope.data.selectedCategoies = angular.copy(resultItems);
              }
              $timeout(function () {
                  callback();
              });
          }
         
          $scope.btnOK = function () {
              getSelectedCategory(function () {
                  $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template , style: $scope.style});
                  $element.parent().dialog("close");    //固定方法, 关闭弹窗.
              });
          }
      }
  ]);
