'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:linkManage
 * @description
 * # linkmanage
 */
angular.module('lanhKdesignApp')
  .directive('linkManage', ["$http", "$compile", "$timeout", '$location', "lanhWindow", "pageService", 'baseService',
      function ($http, $compile, $timeout, $location, lanhWindow, pageService, baseService) {
          return {
              restrict: 'A',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs.defaultType
                    attrs.linkManage:   //callback event
                  */
                  var data = $scope.data = $.extend({
                      type: attrs.defaultType || "page",
                      value: "",
                      title: "",
                      isNewWindow: false
                  }, $scope.data);

                  var query = $scope.query = $.extend({
                      contentType: 'news',
                      category: '',
                  }, data.query || {});

                  var categoryListData = [{
                      key: 'news',
                      text: '新闻列表'
                  }, {
                      key: 'article',
                      text: '介绍列表'
                  }, {
                      key: 'job',
                      text: '招聘列表'
                  }, {
                      key: 'download',
                      text: '下载列表'
                  }];

                  $scope.source = {
                      categories: categoryListData,
                      childCategories: [],
                      dataList: []
                  }



                  var getLinkListData = function (category) {
                      if (!angular.isArray(category)) {
                          category = [category];
                      }
                      for (var i = 0; i < category.length; i++) {
                          var childItem = category[i];
                          if (childItem.item) {
                              if (!angular.isArray(childItem.item)) {
                                  category.item = [childItem.item];
                              }
                          }
                      }
                      return category;
                  }

                  var loadCategoryData = function (type) {
                      baseService.get('proxy', { catgeoryList: true, catgeoryType: type })
                      .then(function (result) {
                          if (result) {
                              var dataObj = JSON.parse(result.jsonText);
                              if (dataObj.channel.item !== '0') {
                                  var childCategories = getLinkListData(dataObj.channel.item);
                                  $scope.source.childCategories = childCategories;
                                  if (!data.selectItemId) {
                                      query.category = childCategories[0].link;
                                  }
                                  $scope.loadData();
                              } else {
                                  $scope.source.childCategories = [];
                              }
                          }
                      });
                  }


                  $scope.loadData = function () {
                      baseService.get('proxy/itemlist', { contentType: query.contentType, category: query.category || '' })
                      .then(function (result) {
                          if (result && result.jsonText) {
                              var dataObj = JSON.parse(result.jsonText);
                              if (dataObj.channel.item !== '0') {
                                  var content = getLinkListData(dataObj.channel.item);
                                  for (var i = 0; i < content.length; i++) {
                                      content[i].image.url = "http://" + dataObj.channel.host + content[i].image.url;
                                      content[i].urlText = content[i].url;
                                      content[i].url = "http://" + dataObj.channel.host + content[i].url;
                                      if (content[i].link.text == data.selectItemId) {
                                          $scope.currentItem = content[i];
                                      }
                                  }
                                  console.log(content)
                                  $scope.source.dataList = content;
                              } else {
                                  $scope.source.dataList = []
                              }
                          }
                      });
                  }

                  $scope.changeCategory = function () {
                      data.selectItemId = "";
                      loadCategoryData(query.contentType);
                  }

                  if (!!data.selectItemId) {
                      loadCategoryData(query.contentType);
                  }

                  $scope.currentItem = {};
                  $scope.selectItem = function (item) {
                      item.selected = !item.selected;
                      if (item.selected) $scope.currentItem = item;
                      else $scope.currentItem = {};
                  }


                  pageService.getPages(function (result) {
                      $scope.pageSource = result;
                  }, '', true);

                  $($element).on("click", function () {
                      openSettingWindow();
                  });

                  var editorArgs;
                  var openSettingWindow = function (e, args) {
                      if (args) {
                          editorArgs = args;
                          $scope.isEditor = true;
                      }
                      $timeout(function () {
                          $http.get("/views/common/linkmanage.tpl.html")
                            .success(function (result) {
                                lanhWindow.create({
                                    title: "链接",
                                    template: result
                                }, $scope);
                            })
                      });
                  }
                  $scope.$on('link.opensetting', openSettingWindow);

                  if ($scope.isEditor) {
                      $scope.data = $.extend($scope.data, {
                          type: attrs.defaultType || "page",
                          value: "",
                          title: "",
                          isNewWindow: false
                      });
                  }


                  $($element).css({
                      "cursor": "pointer"
                  });

                  $scope.changeType = function () {
                      $scope.data.value = "";
                      $scope.data.selectItemId = "";
                      if ($scope.data.type == 'product' || $scope.data.type == 'article') {
                          query.contentType = $scope.data.type;
                          if ($scope.data.type == 'article') {
                              query.contentType = 'news';
                          }
                          loadCategoryData(query.contentType);
                      }
                  }


                  $scope.mediaSelected = function (mediaItem) {
                      $scope.data = $.extend($scope.data, mediaItem);
                      //$scope.data.src = $sce.trustAsResourceUrl($scope.data.src);
                  }
                  $scope.btnOK = function ($event) {
                      if (!!attrs.linkManage) {
                          if ($scope.data.type == "page") {
                              $.each($scope.pageSource.groupPages, function (i, pageItem) {
                                  if (pageItem.key == $scope.data.value) {
                                      $scope.data.title = pageItem.text;
                                      return false;
                                  }
                              });
                          }
                          else if (data.type == 'article' || data.type == 'product') {
                              $scope.data.title = $scope.currentItem.urlText;
                              $scope.data.value = $scope.currentItem.url;
                              $scope.data.query = query;
                              $scope.data.selectItemId = $scope.currentItem.link.text;
                          }
                          else if (data.type == 'mail') {
                              if (($scope.data.value || '').indexOf('mailto://') < 0 && $scope.data.value)
                                  $scope.data.value = 'mailto://' + $scope.data.value;
                              $scope.data.title = $scope.data.value;
                          }
                          else if (data.type == 'flink') {

                              if (($scope.data.value || '').indexOf('http') < 0 && $scope.data.value)
                                  $scope.data.value = 'http://' + $scope.data.value;
                              $scope.data.title = $scope.data.value;
                          }
                          else {
                              $scope.data.title = $scope.data.value;
                          }
                          if (editorArgs) {
                              $scope.data.editorArgs = editorArgs;
                          }

                          if (data.type !== 'flink' && data.type !== 'file' && data.type !== 'mail') {
                              var tempPara = $location.search()['templateid'];
                              if (tempPara) {
                                  $scope.data.value += '?temp=' + tempPara;
                              }
                          }
                          $scope.$emit(attrs.linkManage, $scope.data)
                      }
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }
              }
          };
      }
  ]);
