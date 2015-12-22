'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FrameworkheaderCtrl
 * @description
 * # FrameworkheaderCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkHeaderCtrl', ["$scope", "$element", "$timeout", "$http", "alignService", "$filter", "$location", "messengerService", "pageService", "loginService", "storage",
      function ($scope, $element, $timeout, $http, alignService, $filter, $location, messengerService, pageService, loginService, storage) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.editorInfo = $scope.$parent.editorInfo;

          $scope.btnAlign = function (type) {
              $scope.$root.$broadcast("framework.feature.align", type);
          }

          $scope.btnAlignSize = function () {
              $("#content").css({
                  "cursor": "alias" //todo
              }).on("mousedown.alignSize", function (event) {
                  //console.log(event);
                  $timeout(function () {
                      $scope.$root.$broadcast("framework.feature.alignSize", event.target);
                      $("#content").css({ "cursor": "auto" }).off("mousedown.alignSize");
                      $("#content [id^='oper_']").find("#control_mask").remove();
                  });
              }).on("mouseup.alignSize", function (event) {
                  $timeout(function () {
                      $("#content").off("mouseup.alignSize");
                      delete $scope.$root._attachMouseEvents;
                  });
              });
              $("#content [id^='oper_']").append("<div id=\"control_mask\" style=\"width: 100%;height: 100%;position: absolute;left: 0;top: 0;\"></div>");
              $scope.$root._attachMouseEvents = "alignSize";
          }

          $scope.selectPage = "default";
          $scope.currentPage = "default";
          $scope.savedModel = {};
          
          var _getPages = function () {
              pageService.getPages(function (result) {
                  $scope.source = result;
                  $scope.$root.$broadcast("framework.header.event.togglepage", $scope.source.groupPages[0]);
              })
          }

          if ($scope.editorInfo.type == "web") {
              if (loginService.getLoginInfo().isKplusUser != "true") {
                  pageService.getKPlusId($scope.editorInfo.id, function (result) {
                      storage.session.set("manuscript_kid", result.dataObject.sKID);
                      _getPages();
                  })
              } else {
                  storage.session.set("manuscript_kid", loginService.getLoginInfo().userName);
                  _getPages();
              }
          }

          $scope.togglePage = function () {
              //判断是否改变了内容
              $scope.$root.$broadcast("framework.editor.model.get", function (model) {
                  if (JSON.stringify($scope.savedModel) == JSON.stringify(model)) {
                      $scope.currentPage = $scope.selectPage;
                      $scope.$root.$broadcast("framework.header.event.togglepage", $.grep($scope.source.groupPages, function (n) { return n.key == $scope.currentPage })[0]);
                  } else {
                      messengerService.confirm({
                          title: "提示",
                          message: "<span>网站设计已更改，是否立即保存？</span></br><span style='color: red;'>如不保存将丢失数据</span>",
                          btnOK: "是",
                          btnNo: "否",
                          btnCancel: "取消"
                      }, function (confirm) {
                          if (confirm == true) {
                              $scope.$root.$broadcast("framework.header.event.save", function (result) {
                                  if (result.code == "200") {
                                      $scope.currentPage = $scope.selectPage;
                                      $scope.$root.$broadcast("framework.header.event.togglepage", $.grep($scope.source.groupPages, function (n) { return n.key == $scope.currentPage })[0]);
                                  } else {
                                      $scope.selectPage = $scope.currentPage;
                                      messengerService.error(result.message);
                                  }
                              });
                          } else if (confirm == "no") {
                              $scope.currentPage = $scope.selectPage;
                              $scope.$root.$broadcast("framework.header.event.togglepage", $.grep($scope.source.groupPages, function (n) { return n.key == $scope.currentPage })[0]);
                          } else {
                              $scope.selectPage = $scope.currentPage;
                          }
                      }, $scope);
                  }
              });
          }

          $scope.$on("framework.header.model.savedlog", function (e, model) {
              $scope.savedModel = angular.copy(model);
          });
      }
  ]);
