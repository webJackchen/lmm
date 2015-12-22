'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:StyleManageCtrl
 * @description
 * # ManagementstylectrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('StyleManageCtrl', ["$scope", "$element", "$timeout", "FrameworkLeftMenuService", "loginService", "messengerService", "styleService", "lanhWindow", "$http", "$location",
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



          /*稿件状态切换*/
          $scope.styleStatus = "Check";/*状态*/
          $scope.switchStatue = function ($event, statue) {
              var html = "<s class='active'><i></i></s>";
              $scope.styleCondition.moduleType = "";
              $scope.styleCondition.title = "";
              $scope.styleCondition.lastEditTime = "";
              $scope.styleCondition.editor = "";
              $scope.styleCondition.prcoessStatus = "";
              $scope.styleCondition.webType = "";
              $scope.styleKeyword = "";
              $scope.styleCondition.isRemoved = false;
              $scope.styleStatus = statue;
              $($event.currentTarget).addClass("active").siblings().removeClass("active");
              $($event.currentTarget).parent().find("s.active").remove();
              $($event.currentTarget).find("a").append(html);
              $scope.refreshList();
          }


          /*刷新列表*/
          $scope.stylePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
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
                  prcoessStatus: $scope.styleStatus,
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
              $scope.styleCondition.prcoessStatus = "";
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

          var _buildPreview = function (_template) {
              //模拟真实环境的预览
              var _preview = $(_template.html).append("<style>" + _template.css.replace(/_panelId_/g, "control_editor") + "</style>"
                  + "<script type=\"text/javascript\">" + _template.js.replace(/_panelId_/g, "control_editor") + "</script>");
              _preview = "<div id=\"control_editor\" style=\"width: 100%; height: 100%;\">" + $(_preview).prop("outerHTML") + "</div>";
              _preview = "<div id=\"preview\" class=\"ui-widget-content\" style=\"position: absolute; border: none; width: auto; height: auto;\">" + $(_preview).prop("outerHTML") + "</div>";
              _preview = $(_preview);

              var style = $scope.editorTemplate.style;
              for (var name in style) {
                  var $dom = _preview.find("#control_editor"),
                      value = style[name];
                  switch (name) {
                      case "background-image":
                          value = "url(" + style[name] + ")";
                          break;
                      case "width":
                      case "height":
                          $dom = _preview;
                          if (style[name] != "auto") {
                              value = (parseFloat(style[name]) + 4) + "px";
                          }
                          break;
                      case "border-width":
                      case "border-radius":
                          value = parseFloat(style[name]) + "px";
                          break;
                      case "left":
                      case "top":
                          $dom = _preview;
                          value = parseFloat(style[name]) + "px";
                          break;
                  }
                  $dom.css(name, value);
              }
              $scope.editorTemplate._template._preview = _preview.prop("outerHTML");

              setTimeout(function () {
                  $("#editor_preview").find("a").attr("href", "javascript:void(0)");
              }, 500);
          }

          /*点击预览*/
          $scope.editStyleTemp = "";
          var _menus = leftMenuService.getLeftMenuJson();
          $scope.previewStyle = function (template) {
              console.log(template)
              $scope.editStyleTemp = angular.copy(template);
              $scope.editStyle = true;
              $http.get("../../views/templates/management-style-manage-preview.tpl.html").success(function (result) {
                  lanhWindow.create({
                      title: "结构编辑器",
                      template: result,
                      open: function () {
                          $scope.editorTemplate = {
                              _template: {}
                          }
                          $scope.editorTemplate._template = {}
                          if ($scope.editStyleTemp.files && $scope.editStyleTemp.files.length) {
                              for (var i = 0; i < $scope.editStyleTemp.files.length; i++) {
                                  if ($scope.editStyleTemp.files[i].fileSuffix === 'css') {
                                      $scope.editorTemplate._template.css = $scope.editStyleTemp.files[i].context;
                                  } else if ($scope.editStyleTemp.files[i].fileSuffix === 'html') {
                                      $scope.editorTemplate._template.html = $scope.editStyleTemp.files[i].context;
                                  } else if ($scope.editStyleTemp.files[i].fileSuffix === 'js') {
                                      $scope.editorTemplate._template.js = $scope.editStyleTemp.files[i].context;
                                  }
                              }
                              $timeout(function () {
                                  var _attachMenu = null;
                                  var _searchMenuOption = function (key, _menus) {
                                      $.each(_menus, function (i, _menu) {
                                          if (_menu.key == key) {
                                              _attachMenu = _menu;
                                          } else if (!!_menu.childs && _menu.childs.length > 0) {
                                              _searchMenuOption(key, _menu.childs);
                                          }
                                      });
                                  }
                                  _searchMenuOption($scope.editStyleTemp.moduleType, angular.copy(_menus));
                                  $scope.editorTemplate = $.extend(_attachMenu, $scope.editorTemplate);
                                  $scope.data = _attachMenu.data;
                                 _buildPreview($scope.editorTemplate._template);
                              });
                          }
                      }
                  }, $scope);
              });
          }

      }
  ]);
