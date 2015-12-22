'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:customManage
 * @description
 * # customManage
 */
angular.module('lanhKdesignApp')
  .directive('customManage', ["$compile", "$http", "$timeout", "lanhWindow", "FrameworkLeftMenuService", "styleService", "loginService",
      function ($compile, $http, $timeout, lanhWindow, frameworkLeftMenuService, styleService, loginService) {
          return {
              templateUrl: "../../views/common/custommanage-preview.tpl.html",
              restrict: 'E',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs
                        type:   //模块类型:  image, menu
                  */
                  $scope._panelId = "preview_control_" + $scope.$id;

                  //*********以下代码可以通用*********
                  //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
                  var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
                  for (var property in _currentObj) {
                      $scope[property] = _currentObj[property];
                  }

                  $scope.tpl_status = {
                      mode: "select",    //select or custom
                      editor: "css"     //css、js、html
                  }

                  $scope.btnOK = function () {
                      //固定实现, 触发该事件传递设定对象给目标元素
                      $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data, template: $scope.template });

                      $element.parent().dialog("close");    //固定方法, 关闭弹窗.
                  }

                  $scope.openGrid = function () {
                      $http.get("../../views/common/custommanage-grid.tpl.html")
                      .success(function (result) {
                          lanhWindow.create({
                              title: "样式设置",
                              template: result,
                          }, $scope);
                          $scope.getStyleList();
                      });
                  }

                  var loginInfo = loginService.getLoginInfo();
                  $scope.isDesigner = loginInfo.isKplusUser != "true";
                  /*刷新列表*/
                  $scope.stylePage = {
                      total: 0,
                      pageIndex: 1,
                      pageSize: 10,
                      isOnlyActive: 'true',
                      keyword: ""
                  };

                  $scope.getStyleList = function () {

                      var data = {
                          pageIndex: $scope.stylePage.pageIndex,
                          pageSize: $scope.stylePage.pageSize,
                          editor: ($scope.stylePage.isOnlyActive === 'true' ? "" : loginInfo.userName),
                          prcoessStatus: ($scope.stylePage.isOnlyActive === 'true' ? "Active" : ""),
                          moduleType: attrs.type,
                          keyword: $scope.stylePage.keyword,
                          editTime: "",
                          isRemoved: false,
                          isDelete: false,
                          webType: ""
                      }
                      styleService.getList(data,
                         function (result) {
                             $scope.stylePage.total = result.totalCount;
                             $scope.templateList = [];
                             var _control = frameworkLeftMenuService.getMenuInfo(attrs.type);
                             var defaultTemplate = _control.defaultTemplate;
                             var template = _control.template || {
                                 previewImg: defaultTemplate.previewImg || "../../images/no_image_220x220.jpg",
                                 html: null,
                                 css: null,
                                 js: null
                             }


                             if (!_control.template) {
                                 if (!!defaultTemplate.html) {
                                     $http.get(defaultTemplate.html).success(function (result) { template.html = result; });
                                 } else {
                                     template.html = "";
                                 }

                                 if (!!defaultTemplate.css) {
                                     $http.get(defaultTemplate.css).success(function (result) { template.css = result; });
                                 } else {
                                     template.css = "";
                                 }

                                 if (!!defaultTemplate.js) {
                                     $http.get(defaultTemplate.js).success(function (result) { template.js = result; });;
                                 } else {
                                     template.js = "";
                                 }
                             }

                             var hover = setInterval(function () {
                                 $scope.$apply(function () {
                                     if (template.html !== null && template.css !== null && template.js !== null) {
                                         clearInterval(hover);
                                         $scope.templateList.push({
                                             skinName: "default",
                                             moduleType: attrs.type,
                                             previewImg: template.previewImg,
                                             files: [{
                                                 context: template.html,
                                                 fileSuffix: "html"
                                             }, {
                                                 context: template.css,
                                                 fileSuffix: "css"
                                             }, {
                                                 context: template.js,
                                                 fileSuffix: "js"
                                             }]
                                         });
                                         if (!!result.list) {
                                             $.each(result.list, function (i, template) {
                                                 template.previewImg = (!!template.previewImg) ? (lanh.apiHost + template.previewImg) : "";
                                             });
                                             if ($scope.stylePage.pageIndex === 1) {
                                                 $scope.templateList = $scope.templateList.concat(result.list);
                                             } else {
                                                 $scope.templateList = result.list;
                                             }

                                         }
                                     }
                                 });
                             }, 100);

                             _buildPreview($scope._template);
                         });
                  }

                  /*分页查询*/
                  $scope.pageChanged = function () {
                      $scope.getStyleList();
                  }

                  $scope._template = angular.copy($scope.template) || {};   //临时对象，作为编辑和选择后缓存的对象

                  var _set = function () {
                      var template = $.grep($scope.templateList, function (_template) {
                          if (_template.focus === "on") {
                              return _template;
                          }
                      });
                      if (template.length > 0) {
                          template = template[0];
                          $scope._template = $.extend($scope._template, {
                              skinName: template.skinName,
                          });
                          if (!!template.previewImg) {
                              $scope._template.previewImg = template.previewImg;
                          }
                          $.each(template.files, function (i, file) {
                              switch (file.fileSuffix) {
                                  case "html":
                                      $scope._template.html = html_beautify(file.context);
                                      break;
                                  case "css":
                                      $scope._template.css = css_beautify(file.context);
                                      break;
                                  case "js":
                                      $scope._template.js = js_beautify(file.context);
                                      break;
                              }
                          });
                          _buildPreview($scope._template);
                      }
                  }

                  var _buildPreview = function (_template) {
                      //模拟真实环境的预览
                      var _preview = $(_template.html).append("<style>" + _template.css.replace(/_panelId_/g, $scope._panelId) + "</style>"
                          + "<script type=\"text/javascript\">" + _template.js.replace(/_panelId_/g, $scope._panelId) + "</script>");
                      _preview = "<div id=\"{{_panelId}}\" style=\"width: 100%; height: 100%;\">" + $(_preview).prop("outerHTML") + "</div>";
                      _preview = "<div id=\"preview\" class=\"ui-widget-content\" style=\"position: absolute; border: none;\">" + $(_preview).prop("outerHTML") + "</div>";
                      $(_preview).css({
                          width: $scope.style.width,
                          height: $scope.style.height,
                      });
                      $scope._template._preview = $(_preview).prop("outerHTML");
                      $timeout(function () {
                          $(".ui-dialog #preview").find("a").attr("href", "javascript:void(0)");
                      });
                  }

                  _buildPreview($scope._template);

                  $scope.btnSelected = function (template) {
                      $.each($scope.templateList, function (i, _template) {
                          _template.focus = "";
                      });
                      template.focus = "on";
                      _set();
                  }

                  var changedPreview = null;
                  $scope.changedPreview = function () {
                      if (!!changedPreview) {
                          clearTimeout(changedPreview);
                          changedPreview = null;
                      }
                      changedPreview = setTimeout(function () {
                          $scope.$apply(function () {
                              _buildPreview($scope._template);
                          });
                      }, 1000);
                  }

                  $scope.btnSet = function ($event) {
                      $scope.$parent.template = $scope.template = {
                          html: $scope._template.html,
                          css: $scope._template.css,
                          js: $scope._template.js,
                          previewImg: $scope._template.previewImg,
                          skinName: $scope._template.skinName
                      };
                      //var selected = $.grep($scope.templateList, function (template) { return template.focus == "on" });
                      //if (selected.length > 0) {
                      //    selected = selected[0];
                      //    $scope.$parent.template = $scope.template = {
                      //        html: $scope._template.html,
                      //        css: $scope._template.css,
                      //        js: $scope._template.js,
                      //        previewImg: $scope._template.previewImg,
                      //        skinName: $scope._template.skinName
                      //    };
                      //}
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }

                  $scope.btnSearch = function () {
                      $scope.stylePage.total = 0;
                      $scope.stylePage.pageIndex = 1;
                      $scope.stylePage.pageSize = 10;
                      $scope.getStyleList();
                  }
              }
          }
      }
  ]);