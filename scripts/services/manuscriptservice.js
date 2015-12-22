'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.manuscriptService
 * @description
 * # manuscriptService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('manuscriptService', ["$http",
      function ($http) {
          var self = this;

          self.getSingle = function (id, callback) {
              var url = "template/" + id;

              $http.get(lanh.apiPath + url)
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.getList = function (data, callback) {
              var url = "template";
              var params = [];
              params.push("pageIndex=" + data.pageIndex);
              params.push("pageSize=" + data.pageSize);
              params.push("id=" + data.id);
              params.push("number=" + data.number);
              params.push("webType=" + data.webType);
              params.push("isDelete=" + data.isDelete);
              params.push("title=" + data.title);
              params.push("editor=" + data.editor);
              params.push("styleClass=" + data.styleClass);
              params.push("sKID=" + data.sKID);
              params.push("color=" + data.color);
              params.push("lastEditTime=" + data.lastEditTime);
              params.push("lastUploadTime=" + data.lastUploadTime);
              params.push("prcoessStatus=" + data.prcoessStatus);
              params.push("keyword=" + data.keyword);
              params.push("isRemoved=" + data.isRemoved);

              $http.get(lanh.apiPath + url + "?" + params.join("&"))
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.createManuscript = function (data, callback) {
              var url = 'template';
              $http.post(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.submitManuscript = function (template, callback) {
              var url = 'template';
              $http.put(lanh.apiPath + url, template)
                .success(function (result) {
                    callback(result);
                });
          }

          self.deleteManuscript = function (data, callback) {
              var url = 'template/';

              var params = [];
              params.push("id=" + data.id);
              params.push("deleteRemark=" + data.remark);
              params.push("isRadicalDelete=" + data.isRadicalDelete);

              $http.delete(lanh.apiPath + url + "?" + params.join("&"))
                .success(function (result) {
                    callback(result);
                });
          }

          self.getIndustryList = function (callback) {
              var url = 'proxy?isIndustry=true&userid=';
              $http.get(lanh.apiPath + url)
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.copyManuscript = function (template, callback) {
              var url = 'templateCopy';
              $http.post(lanh.apiPath + url, template)
              .success(function (result) {
                  callback(result);
              });
          }

          self.batchDelet = function (data, callback) {
              var url = 'BatchDeleteTemplates';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.batchReduction = function (data, callback) {
              var url = 'BatchRestoreTemplates';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }
      }
  ]);
