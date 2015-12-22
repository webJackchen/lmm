'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManuscriptCopyCtrl
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManuscriptCopyCtrl', ["$scope", "$element", "manuscriptService", "loginService", "utilsService", "messengerService", "lanhWindow", "$http", "$location", "$timeout", "storage","$filter",
      function ($scope, $element, manuscriptService, loginService, utilsService, messengerService, lanhWindow, $http, $location, $timeout, storage, $filter) {
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
              $(event.target).closest(".datetimepicker").find("input").val("");
          }

          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
              $scope.manuscriptInfo.lastEditTime = "";
          }

          /*行业类别转换格式*/
          var convertToArray = function (kplusObj) {
              if (!kplusObj || !kplusObj.channel) return [];
              var resultArr = [],
                  items = kplusObj.channel.item;
              if (items == 0) return [];

              for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  resultArr.push({
                      key: item.link.text || item.link,
                      text: item.title.text
                  });
              }
              return resultArr;
          }
          /*行业类别初始化*/
          manuscriptService.getIndustryList(function (result) {
              if (result && result.jsonText) {
                  var kplusObj = JSON.parse(result.jsonText);
                  $scope.industryList = convertToArray(kplusObj);
              }
          });

          $scope.templateList = [];

          /*刷新列表*/
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 8
          };
          /*关键字*/
          $scope.manusKeyword = "";
          $scope.manuscriptInfo = {
              webType: "",
              styleClass: "",
              industry: "",
              color: "",
              lastEditTime: "",
              key: "",
              editor:""
          }
          $scope.refreshList = function () {
              var loginInfo = loginService.getLoginInfo(), data = {};
              data = {
                  pageIndex: $scope.templatePage.pageIndex,
                  pageSize: $scope.templatePage.pageSize,
                  id: "",
                  number: "",
                  webType: $scope.manuscriptInfo.webType,
                  isDelete: false,
                  title: "",
                  editor: $scope.manuscriptInfo.editor,
                  styleClass: $scope.manuscriptInfo.styleClass,
                  sKID: $scope.manuscriptInfo.key,
                  color: $scope.manuscriptInfo.color,
                  lastEditTime: $scope.manuscriptInfo.lastEditTime,
                  lastUploadTime: "",
                  prcoessStatus: "Active",
                  keyword: $scope.manusKeyword,
                  isRemoved: false
              }
              manuscriptService.getList(data,
                    function (result) {
                        $scope.templateList = result.dataList;
                        $scope.templatePage.total = result.totalCount;
                    }
                );
          }
          /*分页查询*/
          $scope.pageCopyChanged = function () {
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.refreshList();
          }

          /*条件查询*/
          $scope.queryList = function () {
              $scope.manusKeyword = "";
              $scope.manuscriptInfo.lastEditTime = angular.copy($element.find("#datetimepickerMauscript1").val());
              if ($scope.manuscriptInfo.industry != "" && $scope.manuscriptInfo.industry != null) {
                  $scope.manuscriptInfo.key = $scope.manuscriptInfo.industry.key;
              } else {
                  $scope.manuscriptInfo.key = "";
              }
              $scope.refreshList();
          }

          /*关键字查询*/
          $scope.keyword = function () {
              $scope.manuscriptInfo.webType = "";
              $scope.manuscriptInfo.styleClass = "";
              $scope.manuscriptInfo.industry = "";
              $scope.manuscriptInfo.color = "";
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.manuscriptInfo.key = "";
              $scope.manuscriptInfo.editor = "";
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
              $($event.currentTarget).siblings(".template-title").attr("id","copyTitle")
              template.ischecked = true;
          }

          $scope.copyManuscriptInfo = function ($event) {
              if ($element.find("#copyTitle").find("input").val() == "") {
                  $element.find("#copyTitle").find("input").focus();
              } else {
                  $scope.copyInfo.operation = "templateCopy";
                  $scope.copyInfo.title = $element.find("#copyTitle").find("input").val();
                  $scope.copyInfo.editor = loginService.getLoginInfo().userName;
                  $scope.copyInfo.creator = loginService.getLoginInfo().userName;
                  manuscriptService.copyManuscript($scope.copyInfo, function (result) {
                      if (result.code == 200) {
                          messengerService.success("复制成功！");
                          $element.parent().dialog("close");
                          $scope.$parent.refreshList();
                      } else {
                          var errorMsg = '复制稿件时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '复制稿件失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              }
          }
      }
  ]);