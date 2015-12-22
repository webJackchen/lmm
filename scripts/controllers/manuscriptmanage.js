'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManuscriptCtrl
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManuscriptManageCtrl', ["$scope", "$element", "manuscriptService", "loginService", "utilsService", "messengerService", "lanhWindow", "$http", "$location", "$timeout", "storage", "$filter",
      function ($scope, $element, manuscriptService, loginService, utilsService, messengerService, lanhWindow, $http, $location, $timeout, storage, $filter) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $("#datetimepickerMauscript").daterangepicker({
              "autoApply": true,
              "startDate": new Date(),
              "endDate": new Date(),
              "locale": {
                  "format": "YYYY.MM.DD"
              }
          });
          /*清空时间值*/
          $scope.removeDate = function ($event) {
              $(event.target).closest(".datetimepicker").find("input").val("");
          }

          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
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
          $scope.host = lanh.apiHost;
          $scope.templateList = [];

          /*稿件状态切换*/
          $scope.manuscriptStatus = "Check";/*状态*/
          $scope.switchStatue = function ($event, statue) {
              var html = "<s class='active'><i></i></s>";
              $scope.manuscriptInfo.webType = "";
              $scope.manuscriptInfo.styleClass = "";
              $scope.manuscriptInfo.industry = "";
              $scope.manuscriptInfo.color = "";
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.manuscriptInfo.editor = "";
              $scope.manuscriptInfo.key = "";
              $scope.manusKeyword = "";
              $scope.manuscriptStatus = statue;
              $($event.currentTarget).addClass("active").siblings().removeClass("active");
              $($event.currentTarget).parent().find("s.active").remove();
              $($event.currentTarget).find("a").append(html);
              $scope.refreshList();
          }

          /*刷新列表*/
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
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
                  prcoessStatus: $scope.manuscriptStatus,
                  keyword: $scope.manusKeyword,
                  isRemoved: false
              }
              console.log(data)
              manuscriptService.getList(data,
                    function (result) {
                        console.log(result.dataList)
                        $scope.templateList = result.dataList;
                        $scope.templatePage.total = result.totalCount;
                    }
                );
          }
          /*条件查询*/
          $scope.queryList = function () {
              $scope.manusKeyword = "";
              $scope.manuscriptInfo.lastEditTime = $("#datetimepickerMauscript").val();
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

          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshList();
          }

          $scope.refreshList();

          $scope.$on("refreshManuscriptAdminList", function () {
              $scope.refreshList();
          });


          /*申请通过*/
          $scope.checkSuccess = function (template) {
              messengerService.confirm("你确认审核通过吗?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "Shelve";
                      manuscriptService.submitManuscript(template,
                          function (result) {
                              if (result.code == 200) {
                                  $scope.refreshList();
                              }
                          });
                  }
              }, $scope);
          }

          $scope.processInfo = ""; /*审核流程中信息*/
          $scope.process = "";     /*审核状态  不通过or下架*/
          /*申请不通过*/
          $scope.checkFailure = function (template) {
              $scope.opinion = "";
              $scope.process = "failure";
              $scope.processInfo = template;
              $http.get("/views/templates/management-audit.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "审核",
                      template: result
                  }, $scope);
              });
          }


          $scope.opinion = "";/*修改意见*/
          $scope.btnOpinion = function ($event) {
              if ($scope.opinion == "" || $scope.opinion == null) {
                  $($event.currentTarget).parent().siblings(".opinion").find("textarea").focus();
              } else {
                  $scope.processInfo.checkFailedRemark = $scope.opinion;
                  $scope.processInfo.operation = "RejectShelve";
                  console.log($scope.processInfo)
                  manuscriptService.submitManuscript($scope.processInfo,
                     function (result) {
                         if (result.code == 200) {
                             $scope.refreshList();
                         }
                     });
                  $scope.btnClose($event);
              }
          }

          /*关闭审核框*/
          $scope.btnClose = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*下架*/
          $scope.componentInfo = {
              unShelveRemark: "0",
              editor: ""
          }
          
          $scope.unShelve = function (template) {
              $scope.process = "unshelve";
              $scope.componentInfo.editor = "";
              $scope.processInfo = template;
              $http.get("/views/templates/management-audit.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "下架",
                      template: result
                  }, $scope);
              });
          }
          /*下架确认按钮*/
          $scope.btnUnShelve = function ($event) {
              if ($scope.componentInfo.unShelveRemark === "0") {
                  $scope.processInfo.operation = "UnShelve";
              } else if ($scope.componentInfo.unShelveRemark === "1") {
                  $scope.processInfo.operation = "ReturnToEditor";
              } else if ($scope.componentInfo.unShelveRemark === "2") {
                  $scope.processInfo.editor = $scope.componentInfo.editor;
                  $scope.processInfo.operation = "Assign";
              }
              manuscriptService.submitManuscript($scope.processInfo,
                  function (result) {
                      if (result.code == 200) {
                          messengerService.success("下架成功");
                          $scope.refreshList();
                          $($event.currentTarget).parents(".lanh-modal").dialog("close");
                      }
                  });
          }

          /*重新上架*/
          $scope.Shelve = function (template) {
              messengerService.confirm("你确定要上架稿件?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "Shelve";
                      manuscriptService.submitManuscript(template,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("上架成功");
                                  $scope.refreshList();
                              }
                          });
                  }
              }, $scope);
          }

          /*删除稿件*/
          $scope.remark = ""; /*删除备注*/
          $scope.btnDelete = function (template) {
              $scope.remark = ""; /*删除备注*/
              $scope.process = "isDelete";
              $scope.processInfo = template;
              $http.get("/views/templates/management-audit.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "删除",
                      template: result
                  }, $scope);
              });
          }
          /*删除*/
          $scope.btnDeleteManus = function ($event) {
              var data = {
                  id: $scope.processInfo.id,
                  remark: $scope.remark,
                  isRadicalDelete: true
              }
              manuscriptService.deleteManuscript(data,
                function (result) {
                    if (result.code == 200) {
                        messengerService.success("删除成功");
                        $scope.refreshList();
                    }
                });
              $scope.btnClose($event);
          }

          /*获取用户列表*/
          loginService.getUserInfo(function (result) {
              $scope.userInfo = result.dataList;
              for (var i = 0; i < $scope.userInfo.length; i++) {
                  if ($scope.userInfo[i].loginName === loginService.getLoginInfo().userName) {
                       $scope.userInfo.splice(i, 1);
                  }
              }
          });
      }
  ]);
