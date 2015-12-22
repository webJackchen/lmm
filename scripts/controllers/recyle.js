'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:RecyleCtrl
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('RecyleCtrl', ["$scope", "$element", "recyleService", "loginService", "lanhWindow", "messengerService", "styleService", "componentService", "manuscriptService", "$timeout",
      function ($scope, $element, recyleService, loginService, lanhWindow, messengerService, styleService, componentService, manuscriptService, $timeout) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          /**稿件库  start**/

          $element.find("#datetimepickerMauscript,#datetimepickerCompon,#datetimepickerStyle").daterangepicker({
              "autoApply": true,
              "startDate": new Date(),
              "endDate": new Date(),
              "locale": {
                  "format": "YYYY.MM.DD"
              }
          });
          $scope.host = lanh.apiHost;

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

          /*关键字*/
          $scope.manusKeyword = "";
          $scope.manuscriptInfo = {
              webType: "",
              styleClass: "",
              industry: "",
              color: "",
              lastEditTime: "",
              key: "",
              status: "",
              isRemoved: false
          }
          $scope.manuscriptStatus = "";
          var loginInfo = loginService.getLoginInfo();
          $scope.templateRecycleList = [];
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };
          $scope.refreshTemplateList = function () {
              $scope.selected = false;
              var data = {
                  pageIndex: $scope.templatePage.pageIndex,
                  pageSize: $scope.templatePage.pageSize,
                  id: "",
                  number: "",
                  webType: $scope.manuscriptInfo.webType,
                  isDelete: true,
                  title: "",
                  editor: loginInfo.userName,
                  styleClass: $scope.manuscriptInfo.styleClass,
                  sKID: $scope.manuscriptInfo.key,
                  color: $scope.manuscriptInfo.color,
                  lastEditTime: $scope.manuscriptInfo.lastEditTime,
                  lastUploadTime: "",
                  prcoessStatus: $scope.manuscriptStatus,
                  keyword: $scope.manusKeyword,
                  isRemoved: $scope.manuscriptInfo.isRemoved
              }
              manuscriptService.getList(data,
                    function (result) {
                        $scope.templateRecycleList = result.dataList;
                        $scope.templatePage.total = result.totalCount;
                        if (result.dataList && result.dataList.length) {
                            if ($scope.templateRecycleList.length && $scope.templateRecycleList.length > 0) {
                                for (var i = 0; i < $scope.templateRecycleList.length; i++) {
                                    $scope.templateRecycleList[i].selected = false;
                                }
                            }
                        }
                    }
                );
          }

          /*条件查询*/
          $scope.queryList = function () {
              $scope.manusKeyword = "";
              $scope.manuscriptInfo.lastEditTime = $element.find("#datetimepickerMauscript").val();
              if ($scope.manuscriptInfo.industry != "" && $scope.manuscriptInfo.industry != null) {
                  $scope.manuscriptInfo.key = $scope.manuscriptInfo.industry.key;
              } else {
                  $scope.manuscriptInfo.key = "";
              }
              if ($scope.manuscriptInfo.status === "Removed") {
                  $scope.manuscriptInfo.isRemoved = true;
                  $scope.manuscriptStatus = "";
              } else {
                  $scope.manuscriptStatus = $scope.manuscriptInfo.status;
                  $scope.manuscriptInfo.isRemoved = false;
              }
              $scope.refreshTemplateList();
          }

          /*关键字查询*/
          $scope.keyword = function () {
              $scope.manuscriptInfo.webType = "";
              $scope.manuscriptInfo.styleClass = "";
              $scope.manuscriptInfo.industry = "";
              $scope.manuscriptInfo.color = "";
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.manuscriptInfo.key = "";
              $scope.refreshTemplateList();
          }

          /*分页查询*/
          $scope.pageTemplateChanged = function () {
              $scope.refreshTemplateList();
          }
          $scope.refreshTemplateList();

          $scope.reductionTemplate = function (template) {
              template.operation = "Restore";
              messengerService.confirm("你确定要还原吗?", function (confirm) {
                  if (confirm == true) {
                      recyleService.reductionTemplate(template, function (result) {
                          if (result.code == 200) {
                              messengerService.success("还原成功");
                              $scope.refreshTemplateList();
                          }
                      });
                  }
              }, $scope);

          }

          $scope.throughDeleteTemplate = function (template) {
              var data = {
                  id: template.id,
                  remark: "",
                  isRadicalDelete: true
              }
              messengerService.confirm("你确定要删除吗?", function (confirm) {
                  if (confirm == true) {
                      manuscriptService.deleteManuscript(data, function (result) {
                          if (result.code == 200) {
                              messengerService.success("删除成功");
                          } else {
                              messengerService.success("删除失败");
                          }
                          $scope.refreshTemplateList();
                      });
                  }
              }, $scope);

          }

          /*全选*/
          $scope.selected = false;
          $scope.selectAll = function () {
              $scope.selected = !$scope.selected;
              for (var i = 0; i < $scope.templateRecycleList.length; i++) {
                  if ($scope.selected) {
                      $scope.templateRecycleList[i].selected = true;
                  } else {
                      $scope.templateRecycleList[i].selected = false;
                  }
              }
          }
          /*单个选择*/
          $scope.selectInfo = function (template) {
              template.selected = !template.selected;
          }


          $scope.batchDelet = function () {
              var data = [];
              for (var i = 0; i < $scope.templateRecycleList.length; i++) {
                  if ($scope.templateRecycleList[i].selected) {
                      var a = {
                          id: $scope.templateRecycleList[i].id,
                          remark: "",
                          isRadicalDelete: true
                      }
                      data.push(a);
                  }
              }
              $timeout(function () {
                  if (data.length > 0) {
                      messengerService.confirm("确定要批量删除?", function (confirm) {
                          if (confirm == true) {
                              manuscriptService.batchDelet(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("删除成功");
                                      $scope.refreshTemplateList();
                                  } else {
                                      messengerService.success("删除失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }

          $scope.batchReduction = function () {
              var data = [];
              for (var i = 0; i < $scope.templateRecycleList.length; i++) {
                  if ($scope.templateRecycleList[i].selected) {
                      data.push($scope.templateRecycleList[i].id);
                  }
              }
              $timeout(function () {
                  if (data.length) {
                      messengerService.confirm("确定要批量还原?", function (confirm) {
                          if (confirm == true) {
                              manuscriptService.batchReduction(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("还原成功");
                                      $scope.refreshTemplateList();
                                  } else {
                                      messengerService.success("还原失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }
          /**稿件库  end**/



          $scope.$on("refreshTemplateRecycle", function () {
              $scope.refreshTemplateList();
          })
          $scope.$on("refreshStyleRecycle", function () {
              $scope.refreshStyleList();
          })
          $scope.$on("refreshComponentRecycle", function () {
              $scope.refreshComponentList();
          })


          /*样式库  start*/

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

          /*刷新列表*/
          $scope.stylePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };
          $scope.styleCondition = {
              webType: "",
              moduleType: "all",
              title: "",
              lastEditTime: "",
              prcoessStatus: "",
              isRemoved: false
          };

          $scope.styleRecycleList = [];
          $scope.styleStatus = "";
          $scope.refreshStyleList = function () {
              $scope.selectedStyle = false;
              var moduleType = "", loginInfo = loginService.getLoginInfo();
              if ($scope.styleCondition.moduleType === "all") {
                  moduleType = angular.copy($scope.styleCondition.moduleType);
                  moduleType = "";
              } else {
                  moduleType = angular.copy($scope.styleCondition.moduleType);
              }
              var data = {
                  pageIndex: $scope.stylePage.pageIndex,
                  pageSize: $scope.stylePage.pageSize,
                  editor: loginInfo.userName,
                  prcoessStatus: $scope.styleStatus,
                  moduleType: moduleType,
                  keyword: $scope.styleKeyword,
                  editTime: $scope.styleCondition.lastEditTime,
                  isRemoved: $scope.styleCondition.isRemoved,
                  isDelete: true,
                  webType: $scope.styleCondition.webType
              }
              styleService.getList(data,
                  function (result) {
                      $scope.styleRecycleList = result.list;
                      $scope.stylePage.total = result.totalCount;
                      for (var i = 0; i < $scope.styleRecycleList.length; i++) {
                          $scope.styleRecycleList[i].selected = false;
                      }
                  }
              );
          }
          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshStyleList();
          }

          /*关键字查询*/
          $scope.styleKeyword = "";
          $scope.keywordStyle = function () {
              $scope.styleCondition.moduleType = "";
              $scope.styleCondition.title = "";
              $scope.styleCondition.lastEditTime = "";
              $scope.styleCondition.editor = "";
              $scope.styleCondition.prcoessStatus = "";
              $scope.styleCondition.webType = "";
              $scope.refreshStyleList();
          }
          /*条件查询*/
          $scope.queryListStyle = function () {
              $scope.styleKeyword = "";
              if ($scope.styleCondition.prcoessStatus === "Removed") {
                  $scope.styleCondition.isRemoved = true;
                  $scope.styleStatus = "";
              } else {
                  $scope.styleStatus = $scope.styleCondition.prcoessStatus;
                  $scope.styleCondition.isRemoved = false;
              }
              $scope.styleCondition.lastEditTime = $element.find("#datetimepickerStyle").val();
              $scope.refreshStyleList();
          }

          $scope.refreshStyleList();
          $scope.reductionStyle = function (template) {
              messengerService.confirm("你确定要还原吗?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "Restore";
                      styleService.saveStyle(template,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("还原成功");
                                  $scope.refreshStyleList();
                              }
                          }
                      );
                  }
              }, $scope);
          }

          $scope.throughStyle = function (template) {
              messengerService.confirm("你确定要删除吗?", function (confirm) {
                  if (confirm == true) {
                      var data = {
                          id: template.id,
                          remark: "",
                          isRadicalDelete: true
                      }
                      styleService.deleteStyle(data, function (result) {
                          if (result.code == 200) {
                              messengerService.success("删除成功");
                              $scope.refreshStyleList();
                          }
                      });
                  }
              }, $scope);

          }

          /*全选*/
          $scope.selectedStyle = false
          $scope.selectAllStyle = function () {
              $scope.selectedStyle = !$scope.selectedStyle;
              for (var i = 0; i < $scope.styleRecycleList.length; i++) {
                  if ($scope.selectedStyle) {
                      $scope.styleRecycleList[i].selected = true;
                  } else {
                      $scope.styleRecycleList[i].selected = false;
                  }
              }
          }
          /*单个选择*/
          $scope.selectInfoStyle = function (template) {
              template.selected = !template.selected;
          }

          $scope.batchDeletStyle = function () {
              var data = [];
              for (var i = 0; i < $scope.styleRecycleList.length; i++) {
                  if ($scope.styleRecycleList[i].selected) {
                      var a = {
                          id: $scope.styleRecycleList[i].id,
                          remark: "",
                          isRadicalDelete: true
                      }
                      data.push(a);
                  }
              }
              $timeout(function () {
                  if (data.length > 0) {
                      messengerService.confirm("确定要批量删除?", function (confirm) {
                          if (confirm == true) {
                              styleService.batchDelet(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("删除成功");
                                      $scope.refreshStyleList();
                                  } else {
                                      messengerService.success("删除失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }

          $scope.batchReductionStyle = function () {
              var data = [];
              for (var i = 0; i < $scope.styleRecycleList.length; i++) {
                  if ($scope.styleRecycleList[i].selected) {
                      data.push($scope.styleRecycleList[i].id);
                  }
              }
              $timeout(function () {
                  if (data.length > 0) {
                      messengerService.confirm("确定要批量还原?", function (confirm) {
                          if (confirm == true) {
                              styleService.batchReduction(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("还原成功");
                                      $scope.refreshStyleList();
                                  } else {
                                      messengerService.success("还原失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }

          /*样式库   end*/

          /*组件 start*/

          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
          }

          $scope.componentCondition = {
              webType: "",
              prcoessStatus: "",
              editTime: "",
              isRemoved: false,
          };

          $scope.componentstatus = "";
          $scope.componentPage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };
          $scope.refreshComponentList = function () {
              $scope.selectedCompon = false;
              var data = {
                  pageIndex: $scope.componentPage.pageIndex,
                  pageSize: $scope.componentPage.pageSize,
                  editor: loginInfo.userName,
                  prcoessStatus: $scope.componentstatus,
                  type: $scope.componentCondition.webType,
                  editTime: $scope.componentCondition.editTime,
                  isRemoved: $scope.componentCondition.isRemoved,
                  isDelete: true,
                  keyWord: $scope.componentKeyword
              };
              componentService.getList(data,
                    function (result) {
                        $scope.componentList = result.list;
                        $scope.componentPage.total = result.totalCount;
                        for (var i = 0; i < $scope.componentList.length; i++) {
                            $scope.componentList[i].selected = false;
                        }
                    }
                );
          }

          /*关键字查询*/
          $scope.componentKeyword = "";
          $scope.searchKeyword = function () {
              $scope.componentCondition.lastEditTime = "";
              $scope.componentCondition.prcoessStatus = "";
              $scope.componentCondition.webType = "";
              $scope.refreshComponentList();
          }
          /*条件查询*/
          $scope.searchCondition = function () {
              $scope.componentKeyword = "";
              if ($scope.componentCondition.prcoessStatus === "Removed") {
                  $scope.componentCondition.isRemoved = true;
                  $scope.componentstatus = "";
              } else {
                  $scope.componentstatus = $scope.componentCondition.prcoessStatus;
                  $scope.componentCondition.isRemoved = false;
              }
              $scope.componentCondition.editTime = $element.find("#datetimepickerCompon").val();
              console.log($scope.componentCondition)
              $scope.refreshComponentList();
          }

          /*分页查询*/
          $scope.pageComponentChanged = function () {
              $scope.refreshComponentList();
          }

          /*还原*/
          $scope.reductionComponent = function (component) {
              messengerService.confirm("你确定要还原吗?", function (confirm) {
                  if (confirm == true) {
                      component.operation = "Restore";
                      componentService.uploadInfo(component,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("还原成功");
                                  $scope.refreshComponentList();
                              }
                          }
                      );
                  }
              }, $scope);
          }
          /*删除*/
          $scope.throughComponent = function (component) {
              messengerService.confirm("你确定要删除吗?", function (confirm) {
                  if (confirm == true) {
                      var data = {
                          id: component.id,
                          remark: "",
                          isRadicalDelete: true
                      }
                      componentService.deleteComponent(data,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("删除成功");
                                  $scope.refreshComponentList();
                              } else {
                                  messengerService.success("删除失败");
                              }
                          }
                      );
                  }
              }, $scope);
          }

          /*全选*/
          $scope.selectedCompon = false;
          $scope.selectAllCompon = function () {
              $scope.selectedCompon = !$scope.selectedCompon;
              for (var i = 0; i < $scope.componentList.length; i++) {
                  if ($scope.selectedCompon) {
                      $scope.componentList[i].selected = true;
                  } else {
                      $scope.componentList[i].selected = false;
                  }
              }
          }
          /*单个选择*/
          $scope.selectInfoCompon = function (template) {
              template.selected = !template.selected;
          }

          $scope.batchDeletCompon = function () {
              var data = [];
              for (var i = 0; i < $scope.componentList.length; i++) {
                  if ($scope.componentList[i].selected) {
                      var a = {
                          id: $scope.componentList[i].id,
                          remark: "",
                          isRadicalDelete: true
                      }
                      data.push(a);
                  }
              }
              $timeout(function () {
                  if (data.length > 0) {
                      messengerService.confirm("确定要批量删除?", function (confirm) {
                          if (confirm == true) {
                              componentService.batchDelet(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("删除成功");
                                      $scope.refreshComponentList();
                                  } else {
                                      messengerService.success("删除失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }

          $scope.batchReductionCompon = function () {
              var data = [];
              for (var i = 0; i < $scope.componentList.length; i++) {
                  if ($scope.componentList[i].selected) {
                      data.push($scope.componentList[i].id);
                  }
              }
              $timeout(function () {
                  if (data.length > 0) {
                      messengerService.confirm("确定要批量还原?", function (confirm) {
                          if (confirm == true) {
                              componentService.batchReduction(data, function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("还原成功");
                                      $scope.refreshComponentList();
                                  } else {
                                      messengerService.success("还原失败");
                                  }
                              });
                          }
                      }, $scope);
                  }
              })
          }
          /*显示预览图片*/
          $scope.showImage = function ($event) {
              $(".table").find("img.preview-template").hide();
              $($event.currentTarget).siblings("img.preview-template").show();
          }
          /*隐藏预览图片*/
          $scope.hideImage = function ($event) {
              $(".table").find("img.preview-template").hide();
          }
      }

  ]);
