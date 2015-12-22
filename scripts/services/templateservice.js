'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.templateService
 * @description
 * # templateService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('templateService', ["$http", "messengerService",
      function ($http, messengerService) {
          var self = this;

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

          self.install = function (kPlusId, template, callback) {
              $http.post(lanh.apiPath + "InstallTemplate", {
                  KUId: kPlusId,
                  SKId: template.sKID,
                  TemplateId: template.id,
                  TemplateNumber: template.number,
                  TemplateType: template.webType
              }).success(function (result) {
                  if (result.code == 200) {
                      callback(result);
                  } else {
                      messengerService.error('模板安装失败，请与管理员联系。');
                  }
              })
          }

          self.getInstallTemplate = function (data, callback) {
              var usedTemplate = null;
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
              params.push("isInstalled=true");

              $http.get(lanh.apiPath + url + "?" + params.join("&"))
                  .success(function (result) {
                      $.each(result.dataList, function (i, template) {
                          if (template.isUsed) {
                              usedTemplate = template;
                              return false;
                          }
                      });
                      callback(usedTemplate);
                  });
             
          }
      }
  ]);
