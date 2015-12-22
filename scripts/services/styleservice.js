'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.styleService
 * @description
 * # manuscriptService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('styleService', ["$http",
      function ($http) {
          var self = this;



          self.getList = function (data, callback) {
              var url = "CustomTemplate";
              console.log(data)
              var params = [];
              params.push("pageIndex=" + data.pageIndex);
              params.push("pageSize=" + data.pageSize);
              params.push("editor=" + data.editor);
              params.push("prcoessStatus=" + data.prcoessStatus);
              params.push("moduleType=" + data.moduleType);
              params.push("keyword=" + data.keyword);
              params.push("editTime=" + data.editTime);
              params.push("isRemoved=" + data.isRemoved);
              params.push("isDelete=" + data.isDelete);
              params.push("webType=" + data.webType);

              $http.get(lanh.apiPath + url + "?" + params.join("&"))
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.createStyle = function (data, callback) {
              var url = 'CustomTemplate';
              $http.post(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.saveStyle = function (style, callback) {
              var url = 'CustomTemplate';
              $http.put(lanh.apiPath + url, style)
                .success(function (result) {
                    callback(result);
                });
          }

          self.deleteStyle = function (data, callback) {
              var url = 'CustomTemplate/';

              var params = [];
              params.push("id=" + data.id);
              params.push("deleteRemark=" + data.remark);
              params.push("isRadicalDelete=" + data.isRadicalDelete);

              $http.delete(lanh.apiPath + url + "?" + params.join("&"))
                .success(function (result) {
                    callback(result);
                });
          }

          self.batchDelet = function (data, callback) {
              var url = 'BatchDeleteCustomTemplates';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.batchReduction = function (data, callback) {
              var url = 'BatchRestoreCustomTemplates';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.uploadStyle = function (style, callback) {
              var url = "UploadCustomTemplate";
              $http.post(lanh.apiPath + url, style)
                .success(function (result) {
                    callback(result);
                });
          }
      }
  ]);
