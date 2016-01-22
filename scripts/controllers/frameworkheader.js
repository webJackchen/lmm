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

          /*显示工具条*/
          $scope.showToolBar = function () {
              $(".module-configuration").css({
                  right: "15%",
                  top: "15%",
                  left: "auto"
              }).show();
          }

          $scope.showStaff = function () {
              if ($('#K-staff').css('display') == "none") {
                  $("#K-staff").show();
                  staff();
              } else {
                  $("#content").css("padding", "");
                  $("#K-staff").hide();
              }
          }
          /* $scope.btnAlign = function (type) {
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
           }*/

          //由于左边菜单也使用了该Controller，所以使用$root进行变量共享 modify by clark
          $scope.$root.currentPageItem = { key: 'default', text: '首页', single: true };
          $scope.openLeftMenu = function (pageKey) {
              //一个写死的菜单key
              $scope.$root.$broadcast("leftmenu.expand", { menuKey: pageKey || 'pages' });
          }

      }
  ]);
