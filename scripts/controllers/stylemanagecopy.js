'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:StyleManageCtrl
 * @description
 * # ManagementstylectrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('styleCopyCtrl', ["$scope", "$element", "$timeout", "FrameworkLeftMenuService", "loginService", "messengerService", "styleService", "lanhWindow", "$http", "$location",
      function ($scope, $element, $timeout, leftMenuService, loginService, messengerService, styleService, lanhWindow, $http, $location) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          $scope.tpl_status = {
              sltModule: "all",
              sltModuleList: [
                  { key: "all", title: "显示全部" },
                  //{ key: "controls_text", title: "文字" },
                  { key: "controls_image", title: "图片" },
                  { key: "controls_gallery_grid", title: "网格" },
                  { key: "controls_gallery_slide", title: "幻灯片" },
                  { key: "controls_gallery_thumbnail", title: "缩略图" },
                  { key: "controls_gallery_fullSlide", title: "大幅幻灯片" },
                  //{ key: "controls_gallery_stripwindow", title: "条形陈列窗" },
                  //{ key: "controls_gallery_bigstripwindow", title: "大幅陈列窗" },
                  { key: "controls_media_video", title: "视频" },
                  //{ key: "controls_shapeandline_bar", title: "矩形" },
                  //{ key: "controls_shapeandline_hline", title: "横线" },
                  //{ key: "controls_shapeandline_vline", title: "竖线" },
                  { key: "controls_base_hmenu", title: "横向菜单" },
                  { key: "controls_base_vmenu", title: "竖向菜单" },
                  { key: "controls_list_category", title: "分类列表" },
                  { key: "controls_list_content", title: "内容列表" },
                  { key: "plug_bread_crumbs", title: "面包屑" },
                  { key: "plug_message_board", title: "留言板" },
                  { key: "plug_customer_services", title: "在线客服" },
                  { key: "plug_links", title: "友情链接" },
                  { key: "plug_contact", title: "联系我们" },
                  { key: "controls_download_detail", title: "下载详情区" },
                  { key: "controls_article_detail", title: "简介详情区" },
                  { key: "controls_job_detail", title: "招聘详情区" },
                  { key: "controls_news_detail", title: "新闻详情区" },
                  { key: "controls_product_detail", title: "产品详情区" },
                  { key: "plug_fulltext", title: "全站搜索" },
                  { key: "controls_fulltextresult", title: "全站搜索结果页" },
                  { key: "plug_form", title: "万能表单" },
              ],
              justme: true,
              isDelete: false,
              templateList: [],

              //step 2
              editor: "css"
          }


          $element.find("#datetimepicker").daterangepicker({
              "autoApply": true,
              "showDropdowns": true,
              "startDate": new Date(),
              "endDate": new Date(),
              "locale": {
                  "format": "YYYY.MM.DD",
                  applyLabel: '确定',
                  cancelLabel: '取消',
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

          $scope.host = lanh.apiHost;
          
          $scope.styleList = [];

          /*刷新列表*/
          $scope.stylePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 8
          };
          $scope.styleCondition = {
              webType:"",
              moduleType: "all",
              title: "",
              lastEditTime: "",
              editor: "",
              prcoessStatus: "",
              isRemoved: false
          };

          $scope.refreshList = function () {
              var moduleType = "";
              if ($scope.styleCondition.moduleType === "all") {
                  moduleType = angular.copy($scope.styleCondition.moduleType);
                  moduleType = "";
              } else {
                  moduleType = angular.copy($scope.styleCondition.moduleType);
              }
              var data = {
                  pageIndex: $scope.stylePage.pageIndex,
                  pageSize: $scope.stylePage.pageSize,
                  editor: $scope.styleCondition.editor,
                  prcoessStatus: "Active",
                  moduleType: moduleType,
                  keyword: $scope.styleKeyword,
                  editTime: $scope.styleCondition.lastEditTime,
                  isRemoved: $scope.styleCondition.isRemoved,
                  isDelete: false,
                  webType: $scope.styleCondition.webType
              }
              styleService.getList(data,
                  function (result) {
                      console.log(result)
                      $scope.styleList = result.list;
                      $scope.stylePage.total = result.totalCount;

                  }
              );
          }

          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshList();
          }

          /*关键字查询*/
          $scope.styleKeyword = "";
          $scope.keyword = function () {
              $scope.styleCondition.webType = "";
              $scope.styleCondition.moduleType = "";
              $scope.styleCondition.title = "";
              $scope.styleCondition.lastEditTime = "";
              $scope.styleCondition.editor = "";
              $scope.refreshList();
          }
          /*条件查询*/
          $scope.queryList = function () {
              $scope.styleKeyword = "";
              $scope.refreshList();
          }


          $scope.refreshList();
          $scope.$on("refreshStyleList", function () {
              $scope.refreshList();
          });



          /*流程操作*/

          /*申请通过*/
          $scope.checkSuccess = function (template) {
              messengerService.confirm("你确认审核通过吗?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "Shelve";
                      styleService.saveStyle(template,
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

                  styleService.saveStyle($scope.processInfo,
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
              styleService.saveStyle($scope.processInfo,
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
              messengerService.confirm("你确定要上架样式?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "Shelve";
                      styleService.saveStyle(template,
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
              styleService.deleteStyle(data,
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

          $scope.copyStyleInfo = function ($event) {
              if ($element.find("#copyTitle").find("input").val() == "") {
                  $element.find("#copyTitle").find("input").focus();
              } else {
                  $scope.copyInfo.title = $element.find("#copyTitle").find("input").val();
                  $scope.copyInfo.editor = loginService.getLoginInfo().userName;
                  $scope.copyInfo.creator = loginService.getLoginInfo().userName;
                  styleService.createStyle($scope.copyInfo, function (result) {
                      if (result.code == 200) {
                          messengerService.success("复制成功");
                          $element.parent().dialog("close");
                          $scope.$parent.refreshList();
                      } else {
                          var errorMsg = '复制样式时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '复制样式失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              }
          }

      }
  ]);
