'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManagementStyleCtrl
 * @description
 * # ManagementstylectrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManagementStyleCtrl', ["$scope", "$element", "$timeout", "FrameworkLeftMenuService", "loginService", "messengerService", "styleService", "lanhWindow", "$http", "$location",
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
                  { key: "controls_goods_detail", title: "商品详情区" },
                  { key: "plug_login", title: "登录注册" },
                  { key: "plug_fulltext", title: "全站搜索" },
                  { key: "controls_fulltextresult", title: "全站搜索结果页" },
                  { key: "plug_form", title: "万能表单" },
                  { key: "shops_list_category", "title": "商铺分类" },
                  { key: "shops_list_content", "title": "商铺列表" }
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

          $scope.templateSource = [];
          $scope.TemplateStyle = {
              title: ''
          };

          $scope.btnOpenCreateForm = function () {
              $http.get("/views/templates/management-style-create.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "选择结构",
                      template: result
                  }, $scope);
              });
          }

          $scope.selectModule = function () {
              var _source = $scope.tpl_status.templateList = angular.copy($scope.templateSource);
              if ($scope.tpl_status.sltModule != "all") {
                  $scope.tpl_status.templateList = $.grep(_source, function (n) { return $scope.tpl_status.sltModule == n.key });
              }
          }

          $scope.btnSelected = function (template, $event) {
              $.each($scope.tpl_status.templateList, function (i, _template) {
                  _template.focus = "";
              });
              template.focus = "on";
          }

          var _eachBaseModule = function (_controls) {
              $.each(_controls, function (i, _control) {
                  if (!!_control.childs && _control.childs.length > 0) {
                      _eachBaseModule(_control.childs);
                  } else {
                      if ($.grep($scope.tpl_status.sltModuleList, function (n) { return n.key == _control.key }).length > 0) {
                          $scope.templateSource.push(_control);
                      }
                  }
              });
          }
          var _menus = leftMenuService.getLeftMenuJson();
          var _controls = $.grep(_menus, function (n) { return n.type == "Controls" });
          var _plugs = $.grep(_menus, function (n) { return n.type == "Plug" });
          _eachBaseModule(_controls);
          _eachBaseModule(_plugs);
          $scope.selectModule();

          $scope.btnSelect = function ($event) {
              $scope.TemplateStyle.title = $($event.currentTarget).parent().parent().children(".custom-grid").find(".custom-column.on #templateStyleTitle").val();
              if ($scope.TemplateStyle.title == "" || $scope.TemplateStyle.title == null) {
                  messengerService.success("请输入样式名称");
                  $("input#templateStyleTitle").focus();
              } else {
                  $scope.editStyle = false;
                  var selected = $.grep($scope.tpl_status.templateList, function (n) { return n.focus == "on" });
                  $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  if (selected.length > 0) {
                      $scope._option = angular.copy(selected[0]) || {};
                      $http.get("../../views/templates/management-skin-editor.tpl.html")
                          .success(function (result) {
                              lanhWindow.create({
                                  title: "结构编辑器",
                                  template: result,
                                  open: function () {
                                      $scope.editorTemplate = {
                                          _template: {},
                                          style: angular.copy($scope._option.style) || {}
                                      }

                                      $scope.data = angular.copy($scope._option.data) || {};

                                      $scope.editorTemplate._template = {}
                                      if (!!$scope._option.defaultTemplate.html) {
                                          $http.get($scope._option.defaultTemplate.html)
                                          .success(function (result) {
                                              $scope.editorTemplate._template.html = result;
                                          });
                                      } else {
                                          $scope.editorTemplate._template.html = "";
                                      }
                                      if (!!$scope._option.defaultTemplate.css) {
                                          $http.get($scope._option.defaultTemplate.css)
                                          .success(function (result) {
                                              $scope.editorTemplate._template.css = result;
                                          });
                                      } else {
                                          $scope.editorTemplate._template.css = "";
                                      }
                                      if (!!$scope._option.defaultTemplate.js) {
                                          $http.get($scope._option.defaultTemplate.js)
                                          .success(function (result) {
                                              $scope.editorTemplate._template.js = result;
                                          });
                                      } else {
                                          $scope.editorTemplate._template.js = "";
                                      }

                                      var hover = setInterval(function () {
                                          if ($scope.editorTemplate._template.html != null &&
                                              $scope.editorTemplate._template.css != null &&
                                              $scope.editorTemplate._template.js != null) {
                                              clearInterval(hover);
                                              $timeout(function () {
                                                  _buildPreview($scope.editorTemplate._template);
                                              });
                                          }
                                      }, 200);
                                  }
                              }, $scope);
                          });
                  }
              }

          }

          //step 2 editor script -> obj: $scope.editorTemplate._template
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


          var changedPreview = null;
          $scope.changedPreview = function () {
              if (!!changedPreview) {
                  clearTimeout(changedPreview);
                  changedPreview = null;
              }
              changedPreview = setTimeout(function () {
                  $scope.$apply(function () {
                      _buildPreview($scope.editorTemplate._template);
                  });
              }, 1000);
          }

          /*创建*/
          $scope.btnSet = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
              if ($scope.editStyle) {
                  var data = angular.copy($scope.editStyleTemp);
                  data.files = [];
                  data.operation = "Edit";
                  for (var property in $scope.editorTemplate._template) {
                      switch (property) {
                          case "html":
                          case "css":
                          case "js":
                              data.files.push({
                                  fileName: "style",
                                  fileSuffix: property,
                                  context: $scope.editorTemplate._template[property]
                              });
                              break;
                      }
                  }
                  styleService.saveStyle(data, function (result) {
                      if (result.code == "200") {
                          messengerService.success("复制成功");
                          $scope.refreshList();
                      } else {
                          messengerService.error("复制失败，名称重复！");
                      }
                  });

              } else {
                  var data = {
                      title: $scope.TemplateStyle.title,
                      moduleType: $scope._option.key,
                      moduleName: $scope._option.name,
                      creator: loginService.getLoginInfo().userName,
                      files: []
                  }

                  for (var property in $scope.editorTemplate._template) {
                      switch (property) {
                          case "html":
                          case "css":
                          case "js":
                              data.files.push({
                                  fileName: "style",
                                  fileSuffix: property,
                                  context: $scope.editorTemplate._template[property]
                              });
                              break;
                      }
                  }
                  styleService.createStyle(data, function (result) {
                      if (result.code == "200") {
                          messengerService.success("保存成功");
                          $scope.refreshList();
                      }
                      else {
                          var errorMsg = '创建样式时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '创建样式失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              }
          }

          /*编辑*/
          $scope.editStyleTemp = "";
          $scope.editStyleContent = function (data) {
              $scope.editStyleTemp = angular.copy(data);
              $scope.editStyle = true;
              $http.get("../../views/templates/management-skin-editor.tpl.html").success(function (result) {
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

          /*上传图片*/
          $scope.imageInfo = "";
          $scope.uploadImage = function (template) {
              $scope.imageInfo = template;
          }

          $scope.$on("uploadImageCallback", function (e, data) {
              if (data) {
                  $scope.imageInfo.imgStream = data[0].src;
                  $scope.imageInfo.imgSuffix = data[0].suffix;
                  $scope.imageInfo.operation = "UploadImg";
                  console.log($scope.imageInfo)
                  styleService.saveStyle($scope.imageInfo, function (result) {
                      console.log(result)
                      if (result.code == 200) {
                          $scope.styleTemplate.previewImg = $scope.host + result.dataObject.previewImg;
                          messengerService.success("上传成功")
                          $scope.refreshList();
                      }
                  });
              }
          });

          /*查看*/
          $scope.styleTemplate = {};
          $scope.btnOpenInfoForm = function (template) {
              $scope.edit = false;
              $scope.isDelete = false;
              $http.get("../../views/templates/management-style-edit.tpl.html")
                  .success(function (result) {
                      lanhWindow.create({
                          title: "样式信息",
                          template: result,
                          open: function () {
                              var styleTemplate = angular.copy(template);
                              if (styleTemplate.previewImg) {
                                  styleTemplate.previewImg = $scope.host + styleTemplate.previewImg;
                              }
                              $scope.styleTemplate = styleTemplate;
                          }
                      }, $scope);
                  });
          }
          $scope.editInfo = function () {
              $scope.edit = !$scope.edit;
          }

          /*查看编辑*/
          $scope.btnEdit = function ($event, template) {
              template.operation = "Edit";
              if (template.files && template.files.length) {
                  for (var i = 0; i < template.files.length; i++) {
                      template.files[i].fileName = "style";
                  }
              }
              styleService.saveStyle(template, function (result) {
                  if (result.code == "200") {
                      messengerService.success("编辑成功");
                      $scope.refreshList();
                      $scope.edit = false;
                  } else {
                      var errorMsg = '编辑失败。';
                      /*是否重复Title提示*/
                      if (result.dataObject.isDuplicateTitle) {
                          errorMsg = '编辑失败，名称重复！';
                      }
                      messengerService.error(errorMsg);
                  }
              });
          }

          /*复制*/
          $scope.copyStyleTemplate = {};
          $scope.copyStyleInfo = function (template) {
              $scope.copyStyleTemplate = angular.copy(template);
              $http.get("../../views/templates/management-style-copy.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "基础设置",
                      template: result
                  }, $scope);
              });
          }
          $scope.btnCopy = function ($event) {
              $scope.copyStyleTemplate.creator = loginService.getLoginInfo().userName;
              if ($scope.copyStyleTemplate.files && $scope.copyStyleTemplate.files.length) {
                  for (var i = 0; i < $scope.copyStyleTemplate.files.length; i++) {
                      $scope.copyStyleTemplate.files[i].fileName = "style";
                  }
              }
              styleService.createStyle($scope.copyStyleTemplate, function (result) {
                  if (result.code == "200") {
                      messengerService.success("复制成功");
                      $scope.refreshList();
                  }
                  else {
                      var errorMsg = '复制样式时发生错误。';
                      /*是否重复Title提示*/
                      if (result.dataObject.isDuplicateTitle) {
                          errorMsg = '复制样式失败，名称重复！';
                      }
                      messengerService.error(errorMsg);
                  }
              });
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*删除*/
          $scope.deleStyleInfo = "";
          $scope.remark = "";
          $scope.btnDelete = function (template) {
              $scope.isDelete = true;
              $scope.remark = "";
              $http.get("../../views/templates/management-style-edit.tpl.html")
                  .success(function (result) {
                      lanhWindow.create({
                          title: "样式信息",
                          template: result
                      }, $scope);
                  });
              $scope.deleStyleInfo = angular.copy(template);
          }

          /*删除按钮确认*/
          $scope.btnDeleteManus = function ($event) {
              var data = {
                  id: $scope.deleStyleInfo.id,
                  remark: $scope.remark,
                  isRadicalDelete: false
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

          /*关闭删除框*/
          $scope.btnClose = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*申请上架*/
          $scope.btnSubmit = function (template) {
              if (template.previewImg == null || template.previewImg == "") {
                  messengerService.confirm("请先上传预览图片!", function (confirm) {
                  }, $scope);
              } else {
                  messengerService.confirm("是否确定要上架样式?", function (confirm) {
                      if (confirm == true) {
                          template.operation = "ApplyShelve";
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
          }
          $scope.btnCancel = function (template) {
              messengerService.confirm("是否确定要下架稿件?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "UnShelve";
                      manuscriptService.submitManuscript(template,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("下架成功");
                                  $scope.refreshList();
                              }

                          });
                  }
              }, $scope);
          }

          /*复制所有稿件*/
          $scope.copyAllStyle = function () {
              $http.get("/views/templates/management-style-copyAll.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "样式库",
                      template: result
                  }, $scope);
              });
          }

          $scope.styleList = [];



          /*样式状态切换*/
          $scope.showStatus = true;
          $scope.styleStatus = "";/*状态*/
          $scope.switchStatue = function ($event, statue) {
              var html = "<s class='active'><i></i></s>";
              $scope.styleCondition.moduleType = "";
              $scope.styleCondition.title = "";
              $scope.styleCondition.lastEditTime = "";
              $scope.styleCondition.editor = "";
              $scope.styleCondition.prcoessStatus = "";
              $scope.styleKeyword = "";
              $scope.styleCondition.webType = "";
              $scope.styleCondition.isRemoved = false;
              $scope.styleStatus = statue;
              $($event.currentTarget).addClass("active").siblings().removeClass("active");
              $($event.currentTarget).parent().find("s.active").remove();
              $($event.currentTarget).find("a").append(html);
              $scope.refreshList();
              if ($scope.styleStatus === "") {
                  scope.showStatus = true;
              } else {
                  $scope.showStatus = false;
              }
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

          $scope.refreshList = function () {
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
                  isDelete: false,
                  webType: $scope.styleCondition.webType
              }
              styleService.getList(data,
                  function (result) {
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
              $scope.styleCondition.moduleType = "";
              $scope.styleCondition.title = "";
              $scope.styleCondition.lastEditTime = "";
              $scope.styleCondition.editor = "";
              $scope.styleCondition.prcoessStatus = "";
              $scope.styleCondition.webType = "";
              $scope.refreshList();
          }
          /*条件查询*/
          $scope.queryList = function () {
              $scope.showStatus = true;
              $scope.styleKeyword = "";
              if ($scope.styleCondition.prcoessStatus === "Removed") {
                  $scope.styleCondition.isRemoved = true;
                  $scope.styleStatus = "";
              } else {
                  $scope.styleStatus = $scope.styleCondition.prcoessStatus;
                  $scope.styleCondition.isRemoved = false;
              }
              $scope.styleCondition.lastEditTime = $element.find("#datetimepicker").val();
              $scope.refreshList();
          }


          $scope.refreshList();
          $scope.$on("refreshStyleList", function () {
              $scope.refreshList();
          });


      }
  ]);
