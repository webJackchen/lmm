'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.recyleService
 * @description
 * # manuscriptService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('recyleService', ["$http",
      function ($http) {
          var self = this;

          self.getList = function (data, callback) {
              var url = "template";

              var params = [];
              params.push("creator=" + data.creator);
              params.push("isDelete=" + data.isDelete);
              params.push("state=" + data.state);
              params.push("pageSize=" + data.pageSize);
              params.push("pageIndex=" + data.pageIndex);
              params.push("lastEditTime=" + (data.lastEditTime || ''));
              params.push("lastuploadTime=" + (data.lastUploadTime || ''));
              params.push("title=" + (data.title || ''));
              params.push("WebType=" + (data.webType || ''));

              $http.get(lanh.apiPath + url + "?" + params.join("&"))
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.reductionTemplate = function (template, callback) {
              var url = 'template';
              $http.put(lanh.apiPath + url, template)
                .success(function (result) {
                    callback(result);
                });
          }

          self.throughDeleteTemplate = function (template, callback) {
              var url = 'updateTemplateDelete';
              $http.post(lanh.apiPath + url, { id: template.id })
                    .success(function (result) {
                        callback(result);
                    });
          }

          self.throughDeleteCustomizeModule = function (template, callback) {
              var url = 'UpdateCustomizeModuleDelete';
              $http.post(lanh.apiPath + url, template)
                    .success(function (result) {
                        callback(result);
                    });
          }
      }
  ]);
