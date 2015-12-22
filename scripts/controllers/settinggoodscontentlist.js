'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingGoodsContentListCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingGoodsContentListCtrl', ["$scope", "$element", "baseService", "$filter", "$timeout", 'utilsService',
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
              category: "goods",
              selectedCategoies: null,/*选择的分类*/
              $item$: [],
              condition: "",/*筛选条件*/
              isPaged: "false", /*是否分页*/
              scrollable: "false", /*是否滚动*/
              pageSize: 5, /*每页显示个数*/
              titleLength: 20, /*标题字数*/
              row: "1",
              col: "1",
              target: "_self",
              width: 0,
              selectedAll: false,
              treeData: []
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
                  if (data.selectedAll) {
                      currentItem.checked = nextItem.checked = true;
                  }else{
                      currentItem.checked = isChecked(currentItem);
                      nextItem.checked = isChecked(nextItem);
                  }
              });
              return [sourceCfg];
          }


          /*默认读取分类*/
          var loadCategoryData = function (type) {
              $scope.data.treeData = [];
              baseService.get('proxy/sections', { sectionType: type })
              .then(function (result) {
                  if (result) {
                      var dataObj = JSON.parse(result.jsonText);
                      if (dataObj.channel.item != "0") {
                          $scope.data.treeData = getLinkListData(dataObj.channel.item);
                      } else {
                          $scope.data.treeData = [];
                      }
                  }
              });
          }
          loadCategoryData($scope.data.category);


          var getSelectedCategoryAliasesAndKeys = function () {
              var aliases = [], selectedItem = [], childrenAliasa = [];
              if (data.treeData.length > 0) {
                  data.selectedAll = data.treeData[0].checked;

                  utilsService.loop(data.treeData[0], 'item', function (currentItem, nextItem) {
                      if (nextItem.checked) {
                          selectedItem.push(nextItem);
                      }
                      if (currentItem.name == "全选" && currentItem.checked) {
                          aliases.push(nextItem.alias);
                          childrenAliasa.push(nextItem.alias);
                          return false;
                      } else if (currentItem.checked && nextItem.checked) {
                          childrenAliasa.push(nextItem.alias);
                          if (childrenAliasa.indexOf(currentItem.alias, childrenAliasa) == -1) {
                              aliases.push(currentItem.alias);
                          } 
                          return false;
                      } else if (!currentItem.checked && nextItem.checked) {/*单个，没有子级*/
                          childrenAliasa.push(nextItem.alias);
                          aliases.push(nextItem.alias);
                          return false;
                      }
                     
                  });
                  $scope.data.selectedCategoies = angular.copy(selectedItem);
              }
              return { aliases: aliases.join(',')};
          }


          var getSelectedCategoryData = function (selectAliases, callback) {
              if (selectAliases === "") {
                  $scope.data.$item$ = [];
                  if (callback) callback();
              } else {
                  var condition = {
                      contentList: true,
                      contentType: $scope.data.category,
                      categories: selectAliases,
                      index: 1,
                      length: $scope.data.titleLength || 20,
                      top: $scope.data.isPaged == 'false' ? 9999999 * parseInt($scope.data.col) : parseInt($scope.data.row) * parseInt($scope.data.col),
                      size: $scope.data.isPaged == 'false' ? 9999999 * parseInt($scope.data.col) : parseInt($scope.data.row) * parseInt($scope.data.col),
                      order: "isnew_desc,id_desc"
                  };
                  if ($scope.data.condition == "ishot") {
                      condition.isHot = true;
                      condition.isHome = false;
                  } else if ($scope.data.condition == "ishome") {
                      condition.isHot = false;
                      condition.isHome = true;
                  } else {
                      condition.isHot = false;
                      condition.isHome = false;
                  }

                  baseService.get('proxy', condition).then(function (result) {
                      if (result.jsonText) {
                          var dataObj = JSON.parse(result.jsonText);
                          var resultData = [];
                          if (angular.isArray(dataObj.channel.item)) resultData = dataObj.channel.item;
                          else if (angular.isObject(dataObj.channel.item)) resultData = [dataObj.channel.item];
                          for (var i = 0; i < resultData.length; i++) {
                              resultData[i].image.url = "http://" + dataObj.channel.host + resultData[i].image.url;
                              if (resultData[i].imglist) {
                                  for (var j = 0; j < resultData[i].imglist.image.length; j++) {
                                      resultData[i].imglist.image[j].url = "http://" + dataObj.channel.host + resultData[i].imglist.image[j].url;
                                  }
                              }
                          }
                          console.log(resultData)
                          $scope.data.$item$ = resultData;
                      }
                      if (callback) callback();
                  });
              }
          }

          $scope.btnOK = function () {
              var selectedCategoies = getSelectedCategoryAliasesAndKeys();
              getSelectedCategoryData(selectedCategoies.aliases, function () {
                  if ($scope.data.row && $scope.data.col) {
                      if ($scope.data.isPaged === 'true') {
                          if ($scope.data.$item$.length > parseInt($scope.data.row) * parseInt($scope.data.col))
                              $scope.data.$item$.length = parseInt($scope.data.row) * parseInt($scope.data.col);
                      }
                  } 
                  $scope.data.width = parseInt(100 / parseInt($scope.data.col));

                  var dataConfig = "";
                  if ($scope.data.isPaged === "true") {/*分页*/
                      dataConfig = "<order>B_Common_Item.isnew desc, B_Common_Item.id desc</order><channel>" + selectedCategoies.aliases + "</channel><count>" + parseInt($scope.data.row) * parseInt($scope.data.col) + "</count><module>" + $scope.data.category + "</module><title>" + $scope.data.titleLength + "</title>";
                  } else if ($scope.data.isPaged === "false") {/*不分页*/
                      dataConfig = "<order>B_Common_Item.isnew desc, B_Common_Item.id desc</order><channel>" + selectedCategoies.aliases + "</channel><top>9999999</top><module>" + $scope.data.category + "</module><title>" + $scope.data.titleLength + "</title>";
                  }
                  if ($scope.data.condition == "ishot") {
                      dataConfig = dataConfig + "<ishot>true</ishot>";
                  } else if ($scope.data.condition == "ishome") {
                      dataConfig = dataConfig + "<ishome>true</ishome>";
                  }
                  console.log($scope.data)
                  $scope.data.$dataconfig = dataConfig;
                  $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template, style: $scope.style });
                  $element.parent().dialog("close");    //固定方法, 关闭弹窗.
              });



          }

      }
  ]);