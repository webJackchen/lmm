'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManagementTemplateCtrl
 * @description
 * # ManagementtemplateCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManagementTemplateCtrl', ["$scope", "$element", "loginService", "templateService", "messengerService",
      function ($scope, $element, loginService, templateService, messengerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.userInfo = loginService.getLoginInfo();
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 99999
          };

          $scope.refreshList = function () {
              var data = {
                  pageIndex: $scope.templatePage.pageIndex,
                  pageSize: $scope.templatePage.pageSize,
                  id: "",
                  number: "",
                  webType: "",
                  isDelete: false,
                  title: "",
                  editor: "",
                  styleClass: "",
                  sKID: "",
                  color: "",
                  lastEditTime: "",
                  lastUploadTime: "",
                  prcoessStatus: "Active",
                  keyword: "",
                  isRemoved: false
              }
              templateService.getList(data, function (result) {
                  $scope.templateList = result.dataList;
                  $.each($scope.templateList, function (i, template) {
                      template.previewImg = lanh.apiHost + template.previewImg;
                  });
              })
          }

          $scope.refreshList();

          $scope.btnInstall = function (template) {
              templateService.install($scope.userInfo.userName, template, function (result) {
                  messengerService.success("安装模板成功！");
                  $scope.refreshList();
                  $scope.$root.$broadcast("management.template.install-after");
              });
          }

          $scope.$on("management.template.select", function (e) {
              $scope.$parent.tpl_status.mode = "template";
          });
      }
  ]);
