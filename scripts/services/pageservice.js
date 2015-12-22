'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.pageService
 * @description
 * # pageService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('pageService', ["$http", "$filter", "storage",
      function ($http, $filter, storage) {
          var self = this;

          var _convertToGroupData = function (pages) {
              var result = [];
              for (var i = 0, ii = (pages || []).length; i < ii; i++) {
                  var pageItem = pages[i];
                  if (pageItem.single) {
                      result.push(angular.copy(pageItem));
                      continue;
                  }
                  result.push({
                      parentKey: pageItem.key,
                      parentName: pageItem.text,
                      key: pageItem.key + '_list' + (pageItem.alias || pageItem.key),
                      text: pageItem.text + '-列表页面',
                      alias: pageItem.alias,
                      link: pageItem.link,
                      url: pageItem.url
                  });
                  if (!pageItem.noDetail) {
                      result.push({
                          parentKey: pageItem.key,
                          parentName: pageItem.text,
                          key: pageItem.key + '_detail' + (pageItem.alias || pageItem.key),
                          text: pageItem.text + '-明细页面',
                          alias: pageItem.alias,
                          link: pageItem.link,
                          url: pageItem.url
                      });
                  }
              }
              return result;
          }

          self.getPages = function (callback, noCache, noDetail) {
              if (noCache) {
                  if (!!callback) callback(self.source);
              } else {
                  self.source = {
                      pages: [
                          {
                              key: 'default', text: '首页', single: true, url: '/web/default.html', link: '', alias: ''
                          },
                          {
                              key: 'fulltextresult', text: '全站搜索结果页', single: true, url: '/web/searchresult.html', link: '', alias: ''
                          }
                      ],
                      groupPages: []
                  }
                  $http.get(lanh.apiPath + "proxy?isSection=true")
                      .success(function (result) {
                          var kplusObj = result.jsonText && JSON.parse(result.jsonText) || {},
                              dataList = kplusObj.channel.item !== '0' ? kplusObj.channel.item : [];
                          if (!angular.isArray(dataList)) dataList = [dataList];
                          var queryIndexItems = $filter('filter')(dataList, function (item) { return item.key === 'default' });
                          if (queryIndexItems.length) self.source.pages = dataList;
                          else {
                              var sectionData = [].concat(self.source.pages);
                              for (var i = 0, ii = dataList.length; i < ii; i++) {
                                  var sectionItem = dataList[i];
                                  sectionData.push({
                                      key: sectionItem.module || sectionItem.alias || sectionItem.link.text,
                                      text: sectionItem.title.text,
                                      alias: sectionItem.alias,
                                      link: sectionItem.link,
                                      url: "/web" + sectionItem.url,
                                      noDetail: noDetail || false
                                  });
                              }
                              self.source.pages = sectionData;
                              self.source.groupPages = _convertToGroupData(self.source.pages);
                          }
                          if (!!callback) callback(self.source);
                      });
              }
          }

          self.getPage = function (templateId, pageName, pageType, callback) {
              var params = [
                  "templateId=" + templateId,
                  "pageName=" + pageName,
                  "pageType=" + pageType
              ];
              $http.get(lanh.apiPath + "JsonConfig?" + params.join("&"))
                .success(function (result) {
                    if (!!result.dataObject.controls) {
                        //result.dataObject.pageGuid;
                        $.each(result.dataObject.controls, function (i, control) {
                            for (var key in control.data) {
                                control.data[key] = JSON.parse(control.data[key]);
                            }
                        });
                    }
                    callback(result);
                })
          }

          self.savePage = function (data, callback) {
              $.each(data.Controls, function (i, control) {
                  for (var key in control.data) {
                      control.data[key] = JSON.stringify(control.data[key]);
                  }
              });
              $http.post(lanh.apiPath + "JsonConfig", data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.preview = function (data, callback) {
              $.each(data.Controls, function (i, control) {
                  for (var key in control.data) {
                      control.data[key] = JSON.stringify(control.data[key]);
                  }
              });
              $http.post(lanh.apiPath + "page", data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.release = function (webType, callback) {
              $http.post(lanh.apiPath + "release", { webType: webType })
              .success(function (result) {
                  callback(result);
              });
          }

          self.getKPlusId = function (templateId, callback) {
              $http.get(lanh.apiPath + "template?templateid=" + templateId)
              .success(function (result) {
                  callback(result);
              })
          }
      }
  ]);
