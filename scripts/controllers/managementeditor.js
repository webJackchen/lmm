'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManagementeditorCtrl
 * @description
 * # ManagementeditorCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManagementEditorCtrl', ["$scope", "$element", "$location", "loginService", "templateService",
      function ($scope, $element, $location, loginService, templateService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.btnEdit = function () {
              //window.open("../#/framework?templateid=" + $scope.currentTemplate.number);
              $location.search({ templateid: $scope.currentTemplate.number });
              $location.path("/framework");
          }

          $scope.btnInstall = function () {
              $scope.$root.$broadcast("management.template.select");
          }

          $scope.$on("management.template.install-after", function (e) {
              $scope.$parent.tpl_status.mode = "editor";
              $scope.getInstallTemplate();
          });

          $scope.userInfo = loginService.getLoginInfo();
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 9999
          };
          $scope.getInstallTemplate = function () {
              var data = {
                  pageIndex: $scope.templatePage.pageIndex,
                  pageSize: $scope.templatePage.pageSize,
                  id: "",
                  number: "",
                  webType: "Web",
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
              templateService.getInstallTemplate(data, function (result) {
                  console.log(result)
                  $scope.currentTemplate = result;
                  if (!!$scope.currentTemplate) {
                      $scope.currentTemplate.previewImg = lanh.apiHost + $scope.currentTemplate.previewImg;
                      $scope.$parent.tpl_status.mode = "editor";
                  }
              });
          }

          $scope.getInstallTemplate();
      }
  ]);
