'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.styleService
 * @description
 * # manuscriptService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('componentService', ["$http",
      function ($http) {
          var self = this;

          self.getList = function (data, callback) {
              var url = "component";
              var params = [];
              params.push("pageIndex=" + data.pageIndex);
              params.push("pageSize=" + data.pageSize);
              params.push("editor=" + (data.editor || ''));
              params.push("prcoessStatus=" + (data.prcoessStatus || ''));
              params.push("type=" + (data.type || ''));
              params.push("keyWord=" + (data.keyWord || ''));
              params.push("editTime=" + (data.editTime || ''));
              params.push("isRemoved=" + data.isRemoved);
              params.push("isDelete=" + data.isDelete);

              $http.get(lanh.apiPath + url + "?" + params.join("&"))
                  .success(function (result) {
                      callback(result);
                  });
          }

          self.createComponent = function (data, callback) {
              var url = 'component';
              $http.post(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.copyComponent = function (data, callback) {
              var url = 'ComponentCopy';
              $http.post(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.uploadComponent = function (data, callback) {
              var url = 'uploadComponent';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.deleteComponent = function (data, callback) {
              var url = 'component?id=' + data.id + '&deleteRemark=' + data.deleteRemark + '&isRadicalDelete=' + data.isRadicalDelete;
              $http.delete(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.uploadInfo = function (data, callback) {
              var url = 'component';
              $http.put(lanh.apiPath + url, data)
                .success(function (result) {
                    callback(result);
                });
          }

          self.getComponentJSON = function (componentId, callback) {
              $http.get(lanh.apiPath + "componentConfig?componentId=" + componentId)
              .success(function (result) {
                  if (!!result.dataObject && !!result.dataObject.controls) {
                      $.each(result.dataObject.controls, function (i, control) {
                          for (var key in control.data) {
                              var _data = control.data[key];
                              if (typeof (control.data[key]) == "string") {
                                  try{
                                      _data = JSON.parse(control.data[key]);
                                  } catch (e) {
                                      _data = control.data[key];
                                  }
                              }
                              control.data[key] = _data;
                              //control.data[key] = JSON.parse(control.data[key]);
                              //control.data[key] = control.data[key];
                          }
                      });
                  }
                  callback(result);
              });
          }

          self.createComponentJSON = function (data, callback) {
              $.each(data.Controls, function (i, control) {
                  for (var key in control.data) {
                      control.data[key] = JSON.stringify(control.data[key]);
                  }
              });
              $http.post(lanh.apiPath + "componentConfig", data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.batchDelet = function (data, callback) {
              var url = 'BatchDeleteComponents';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }

          self.batchReduction = function (data, callback) {
              var url = 'BatchRestoreComponents';
              $http.post(lanh.apiPath + url, data)
              .success(function (result) {
                  callback(result);
              });
          }
      }
  ]);
