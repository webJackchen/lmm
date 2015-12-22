'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ComponentShelveCtrl
 * @description
 * # 
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ComponentShelveCtrl', ["$scope", "$element", "componentService", "loginService", "utilsService", "messengerService", "lanhWindow", "$http", "$location", "$timeout", "storage", "$filter",
      function ($scope, $element, componentService, loginService, utilsService, messengerService, lanhWindow, $http, $location, $timeout, storage, $filter) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $timeout(function () {
              $element.find("#datetimepickerMauscript1").daterangepicker({
                  "parentEl": ".ui-dialog",
                  "autoApply": true,
                  "startDate": new Date(),
                  "endDate": new Date(),
                  "locale": {
                      "format": "YYYY.MM.DD"
                  }
              });
          })

          /*清空时间值*/
          $scope.removeDate = function ($event) {
              $scope.componentCondition.editTime = "";
              $(event.target).closest(".datetimepicker").find("input").val("");
          }

          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
              $scope.componentCondition.editTime = "";
          }

          $scope.componentKeyword = "";
          $scope.componentPage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };
          $scope.componentCondition = {
              type: "Web",
              prcoessStatus: "Active",
              title: "",
              editTime: "",
              isRemoved: false,
          };
          $scope.refreshList = function () {
              var data = {}, loginInfo = loginService.getLoginInfo();
              data = {
                  pageIndex: $scope.componentPage.pageIndex,
                  pageSize: $scope.componentPage.pageSize,
                  editor: "",
                  prcoessStatus: $scope.componentCondition.prcoessStatus,
                  type: $scope.componentCondition.type,
                  keyWord: $scope.componentKeyword,
                  editTime: $scope.componentCondition.editTime || "",
                  isRemoved: $scope.componentCondition.isRemoved,
                  isDelete: false
              };
              componentService.getList(data,
                  function (result) {
                      console.log(result)
                      $scope.componentShelveList = result.list;
                      $scope.componentPage.total = result.totalCount;
                  }
              );
          }
          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshList();
          }

          /*关键字查询*/
          $scope.searchKeyword = function () {
              $scope.refreshList();
          }

          /*条件查询*/
          $scope.searchCondition = function () {
              $scope.componentKeyword = "";
              $scope.refreshList();
          }

          $scope.refreshList();


          /*选择复制的稿件*/
          $scope.copyInfo = "";
          $scope.checkedTemplate = function (template, $event) {
              $scope.copyInfo = angular.copy(template);
              $(".template-content").find(".template-body").removeClass("active");
              $(".template-content").find(".template-title").css("display", "none");
              $($event.currentTarget).addClass("active");
              $($event.currentTarget).siblings(".template-title").show();
              $($event.currentTarget).siblings(".template-title").attr("id", "copyTitle")
              template.ischecked = true;
          }

          $scope.copyManuscriptInfo = function ($event) {
              if ($element.find("#copyTitle").find("input").val() == "") {
                  $element.find("#copyTitle").find("input").focus();
              } else {
                  $scope.copyInfo.title = $element.find("#copyTitle").find("input").val();
                  $scope.copyInfo.creator = loginService.getLoginInfo().userName;

                  componentService.copyComponent($scope.copyInfo, function (result) {
                      if (result.code == 200) {
                          messengerService.success("复制成功！");
                          $element.parent().dialog("close");
                          $scope.$parent.refreshList();
                      } else {
                          var errorMsg = '复制组件时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '复制组件失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              }
          }
      }
  ]);