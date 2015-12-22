'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:mediamanage
 * @description
 * # mediamanage
 */
angular.module('lanhKdesignApp')
  .directive('mediaManage', ['$compile', '$http', 'baseService', 'lanhWindow', 'loginService',
      function ($compile, $http, baseService, lanhWindow, loginService) {
          return {
              restrict: 'E',
              template: '<div class="row"><div class="col-sm-9">'
              + '<input type="text" class="form-control" ng-disabled="true" ng-model="source.mediaUrl" />'
              + '</div>'
              + '<div class="col-sm-2 col-padding-clear">'
              + '<button class="btn btn-primary" ng-click="openWindow($event);">选择</button>'
              + '</div></div>',
              scope: {
                  type: '@',
                  caption: '@',
                  onSelected: '&onSelected',
                  src: '=',
                  videoKey: '='
              },
              link: function postLink(scope, element, attrs) {
                  scope.source = {
                      kplusUrl: loginService.getLoginInfo().kplusPath,
                      kplusHost: '',
                      mediaUrl: '',
                      data: [],
                      dataIsEmpty: true,
                      queryedData: false
                  };
                  if (scope.src) {
                      var srcArr = (scope.src || '').split('/');
                      scope.source.mediaUrl = srcArr.length && srcArr[srcArr.length - 1];
                  }
                  scope.queryPara = {
                      index: 1,
                      size: '20',
                      sortBy: 'id_desc',
                      keyWords: '',
                      mediaType: scope.type || 'video'
                  };

                  scope.currentItem = {};
                  scope.selectItem = function (item) {
                      if (!!item.key && item.key == scope.currentItem.key) scope.currentItem = {};
                      else scope.currentItem = item;
                  }

                  var reSelectedItem = function () {
                      if (scope.videoKey) {
                          for (var i = 0, ii = scope.source.data.length; i < ii; i++) {
                              var loopItem = scope.source.data[i];
                              if (loopItem.link.text === scope.videoKey)
                                  scope.currentItem = scope.source.data[i];
                          }
                      }
                  }

                  scope.loadMediaData = function () {
                      var successCallback = function (result) {
                          if (result && result.jsonText) {
                              var kplusObj = JSON.parse(result.jsonText);
                              if (!angular.isArray(kplusObj.channel.item) && angular.isObject(kplusObj.channel.item)) {
                                  kplusObj.channel.item = [kplusObj.channel.item];
                              }
                              if (angular.isArray(kplusObj.channel.item)) scope.source.data = kplusObj.channel.item;
                              else scope.source.data = [];

                              scope.source.kplusHost = 'http://' + kplusObj.channel.host;
                              scope.source.dataIsEmpty = scope.source.data.length <= 0 && !scope.source.queryedData;
                              scope.source.queryedData = false;

                              reSelectedItem();

                          }
                      };

                      if (scope.type === 'file') {
                          baseService.get(lanh.apiPath + 'proxy/file', scope.queryPara).then(successCallback);
                      }
                      else {
                          baseService.get(lanh.apiPath + 'proxy/media', scope.queryPara).then(successCallback);
                      }
                  }

                  scope.searchVideos = function () {
                      scope.source.queryedData = true;
                      scope.loadMediaData();
                  }

                  scope.openWindow = function ($event) {
                      $event.stopPropagation && $event.stopPropagation();
                      $http.get(attrs.template || '/views/common/mediamanage.tpl.html')
                      .then(function (result) {
                          lanhWindow.create({
                              title: scope.caption + '库',
                              template: result.data
                          }, scope);
                      });
                      scope.queryPara = {
                          index: 1,
                          size: '20',
                          sortBy: 'id_desc',
                          keyWords: '',
                          mediaType: scope.type || 'video'
                      };


                      scope.loadMediaData();
                      return false;
                  }



                  scope.btnOk = function ($event) {
                      if (!scope.currentItem.link) return;
                      var callback = scope.onSelected();
                      if (callback) {
                          var selectItemObj = {
                              id: scope.currentItem.link.text
                          };
                          if (scope.type === 'video') {
                              selectItemObj = angular.extend(selectItemObj, {
                                  poster: scope.source.kplusHost + scope.currentItem.image.url,
                                  src: scope.source.kplusHost + scope.currentItem.enclosure.url,
                                  name: scope.currentItem.enclosure.text
                              });
                          }
                          else if (scope.type === 'file') {
                              selectItemObj = angular.extend(selectItemObj, {
                                  poster: scope.source.kplusHost + scope.currentItem.url.text,
                                  src: scope.source.kplusHost + scope.currentItem.url.text,
                                  name: scope.currentItem.alltitle.text + '.' + scope.currentItem.extension.text
                              });
                              
                          }
                          callback(selectItemObj);
                      }
                      scope.source.mediaUrl = selectItemObj.name;
                      scope.src = selectItemObj.src;

                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }
              }
          };
      }]);
