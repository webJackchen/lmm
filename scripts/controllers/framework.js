'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FreameworkCtrl
 * @description
 * # FreameworkctrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkCtrl', ["$scope", "$location", "history", "loginService", "pageService", "messengerService", "storage", "$timeout", "templateService",
      function ($scope, $location, history, loginService, pageService, messengerService, storage, $timeout, templateService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          //window.onbeforeunload = function (e) {
          //    return "请确认此页面已保存！";
          //}

          $scope.userInfo = loginService.getLoginInfo();
          var setPreviewBg = function () {
              $scope.isPreview = $location.search().preview ? $location.search().preview : '';
              if ($scope.isPreview) {
                  if (!!$location.search().componentid) {
                      $timeout(function () {
                          $("#previewBg").css('height', parseInt($(".framework").height()) + 10);
                      }, 1000);

                  } else if (!!$location.search().mobilecomponentid) {
                      $timeout(function () {
                          $("#previewBg").css('height', parseInt($(document).height()) + 10);
                      }, 1000);
                  }
              }
          }

          $scope.$on("framework.setPreviewBg", function (e) {
              setPreviewBg();
          });

          setPreviewBg();

          var _platformType = "";
          if (!!$location.search().templateid) {
              $scope.editorInfo = {
                  id: $location.search().templateid,
                  type: "web",
                  readOnly: false
              }
          } else if (!!$location.search().componentid) {
              $scope.editorInfo = {
                  id: $location.search().componentid,
                  type: "component",
                  readOnly: !!$location.search().preview
              }
          } else if (!!$location.search().mobiletemplateid) {
              $scope.editorInfo = {
                  id: $location.search().mobiletemplateid,
                  type: "mobile",
                  readOnly: !!$location.search().preview
              }
          } else if (!!$location.search().mobilecomponentid) {
              $scope.editorInfo = {
                  id: $location.search().mobilecomponentid,
                  type: "mobilecomponent",
                  readOnly: !!$location.search().preview
              }
          }

          //left menu select event, create control
          $scope.$on("framework.selectedControl", function (e, options) {
              switch (options[0].action) {
                  case "setting":
                      $scope.$broadcast("framework.createControl.setting", options);
                      break;
                  case "window":
                      //如果选项没有defaultTemplate，则只需要弹窗，否则将创建对象后再弹窗(framework.createControl包含弹窗流程)
                      if (!options[0].defaultTemplate && !!options[0].settingTemplateUrl) {
                          $scope.$broadcast("framework.createControl.setting", options);
                      } else {
                          $scope.$broadcast("framework.createControl", options);
                      }
                      break;
                  case "select":
                      $scope.$broadcast("framework.createControl.select", options);
                      break;
                  default:
                      $scope.$broadcast("framework.createControl", options);
                      break;
              }
          });

          $scope.historyPrev = history.prev;
          $scope.historyNext = history.next;

          //global control toolbar events
          $scope.btnEvents = function (action) {
              if ($scope.btnModels[action].show && $scope.btnModels[action].class == "enabled") {
                  $scope.$broadcast("framework.control.toolbar.events", action);
              }
          }

          $scope.btnAlign = function (action, event) {
              event.stopPropagation();
              if ($scope.btnModels[action].show && $scope.btnModels[action].class == "enabled") {
                  $scope.$root.$broadcast("framework.feature.align", action);
              }
          }

          /*对齐大小*/
          $scope.btnAlignSize = function () {
              if ($(event.target).parent().hasClass("disabled")) return false;
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
              history.log();
          }

          $scope.showChildrenMenus = function (event) {
              $(event.target).siblings().show();
          }
          $scope.hideMenus = function (event) {
              event.stopPropagation();
              $(event.target).closest("#alignMenu,#arrangeMenu").hide();
          }

          var _buildBtns = function (controls) {
              var showGroup = false, showUnGroup = false, isSelectableFn = false, isSelectOrGroup = false;
              if (controls[0]) {
                  var $control = $("#" + controls[0].controlId);
                  showGroup = $control.length > 0 && $control.parents("[id^='temp_']").length > 0 && $control.parents("[id^='temp_']").find("[group]").length <= 0;
                  showUnGroup = $control.length > 0 && $control.parents("[id^='group_']").length > 0 && $control.parents("[id^='temp_']").length <= 0;
                  isSelectableFn = $control.length > 0 && $control.parents("[id^='temp_']").length > 0;
                  isSelectOrGroup = showGroup || showUnGroup || isSelectableFn;
              }
              var isShowMapRight = true;
              if (!!controls[0] && controls[0].key == "plug_map") {
                  isShowMapRight = false;
              }

              $scope.btnModels = {
                  "lock": {
                      "type": "lock",
                      "show": !!controls[0],
                      "class": !!controls[0] && $.grep(controls, function (n) { return n.canLock == false }).length != controls.length ? 'enabled' : 'disabled',
                      "icon": !!controls[0] && controls[0].locked == true ? 'icon-on-lock' : 'icon-lock',
                      "title": !!controls[0] && controls[0].locked == true ? '解锁' : '锁定',
                      "desc": ""
                  },
                  "setting": {
                      "type": "setting",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-automatic-configuration",
                      "class": !!controls[0] && !!controls[0].settingTemplateUrl ? 'enabled' : 'disabled',
                      "title": "设置",
                      "desc": ""
                  },
                  "style": {
                      "type": "style",
                      "show": controls.length == 1 && !!controls[0] && !isSelectOrGroup,
                      "icon": "icon-sketchpad",
                      "class": controls.length == 1 && !!controls[0] && !!controls[0].settingBaseStyle && !isSelectOrGroup ? 'enabled' : 'disabled',
                      "title": "样式",
                      "desc": ""
                  },
                  "scale": {
                      "type": "scale",
                      //"show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('scale') >= 0,
                      "show": controls.length == 1 && !!controls[0] && !isSelectOrGroup && !!controls[0] && controls[0].location.indexOf("-full") == -1 && (controls[0].addTools || []).indexOf('scale') >= 0 && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 && !isSelectOrGroup,
                      "icon": "icon-one-to-one",
                      "class": !!controls[0] && controls.length == 1 && controls[0].location.indexOf("-full") == -1 && (controls[0].addTools || []).indexOf('scale') >= 0 && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 && !isSelectOrGroup ? 'enabled' : 'disabled',
                      "title": "自适应",
                      "desc": ""
                  },
                  "createStyle": {
                      "type": "createStyle",
                      "show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('createStyle') >= 0 && !isSelectOrGroup,
                      "icon": "icon-upload-style",
                      "class": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('createStyle') >= 0 && !isSelectOrGroup ? 'enabled' : 'disabled',
                      "title": "上传样式",
                      "desc": ""
                  },
                  "createComponent": {
                      "type": "createComponent",
                      "show": !!controls[0] && controls.length > 1 || isSelectOrGroup,
                      "icon": "icon-upload-component",
                      "class": !!controls[0] && controls.length > 1 && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 || isSelectOrGroup ? 'enabled' : 'disabled',
                      "title": "上传组件",
                      "desc": ""
                  },
                  "copy": {
                      "type": "copy",
                      "show": !!controls[0] && controls[0].key !== "plug_customer_services" && controls[0].key !== "plug_map" && controls[0].key !== "controls_single_detail",
                      "icon": "icon-document-copying",
                      //"class": !!controls[0] && $.grep(controls, function (n) { return n.canDelete == false }).length == 0 ? 'enabled' : 'disabled',
                      "class": !!controls[0] && controls[0].key !== "plug_customer_services" && controls[0].key !== "plug_map" && controls[0].key !== "controls_single_detail" && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 ? 'enabled' : 'disabled',
                      "title": "复制",
                      "desc": "Ctrl + C"
                  },
                  "patse": {
                      "type": "patse",
                      "show": isShowMapRight,
                      "icon": "icon-paste",
                      "class": !!$scope.$root.copyCache && !!$scope.$root.copyCache.length > 0 ? 'enabled' : 'disabled',
                      "title": "粘贴",
                      "desc": "Ctrl + V"
                  },
                  "copyPatse": {
                      "type": "copyPatse",
                      "show": !!controls[0] && controls[0].key !== "plug_customer_services" && controls[0].key !== "plug_map" && controls[0].key !== "controls_single_detail",
                      "icon": "icon-to-copy",
                      "class": !!controls[0] && controls[0].key !== "plug_customer_services" && controls[0].key !== "plug_map" && controls[0].key !== "controls_single_detail" && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 ? 'enabled' : 'disabled',
                      "title": "复印",
                      "desc": "Ctrl + Q"
                  },
                  "fullWidth": {
                      "type": "fullWidth",
                      "show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('stretch') >= 0 && !isSelectOrGroup && controls[0].key !== "controls_shapeandline_vline",
                      "icon": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "icon-stretch" : "icon-cancel-stretch",
                      "class": controls.length == 1 && !!controls[0] && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 && controls[0].key !== "controls_shapeandline_vline" && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 && (controls[0].addTools || []).indexOf('stretch') >= 0 && !isSelectOrGroup ? 'enabled' : 'disabled',
                      "title": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "通栏" : "取消通栏",
                      "desc": ""
                  },
                  "maxWidth": {
                      "type": "maxWidth",
                      "show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('maxWidth') >= 0,
                      "icon": "icon-max-width",
                      "class": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "enabled" : "disabled",
                      "title": "宽度最大化",
                      "desc": ""
                  },
                  "indexUp": {
                      "type": "indexUp",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-forward-one",
                      "class": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "enabled" : "disabled",
                      "title": "上一层",
                      "desc": ""
                  },
                  "indexDown": {
                      "type": "indexDown",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-backward-layer",
                      "class": !!controls[0] && !!controls[0].style && controls[0].style['z-index'] > 1 && controls[0].location.indexOf("-full") == -1 ? 'enabled' : 'disabled',
                      "title": "下一层",
                      "desc": ""
                  },
                  "indexTop": {
                      "type": "indexTop",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-stick",
                      "class": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "enabled" : "disabled",
                      "title": "顶层",
                      "desc": ""
                  },
                  "indexBottom": {
                      "type": "indexBottom",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-the-bottom",
                      "class": !!controls[0] && !!controls[0].style && controls[0].style['z-index'] > 1 && controls[0].location.indexOf("-full") == -1 ? 'enabled' : 'disabled',
                      "title": "底层",
                      "desc": ""
                  },
                  "delete": {
                      "type": "delete",
                      "show": !!controls[0],
                      "icon": "icon-delete",
                      "class": !!controls[0] && $.grep(controls, function (n) { return n.canDelete == false }).length != controls.length ? 'enabled' : 'disabled',
                      "title": "删除",
                      "desc": "Delete"
                  },
                  "settingHeader": {
                      "type": "settingHeader",
                      "show": !controls[0] && $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-header-body',
                      "icon": "icon-automatic-configuration",
                      "class": 'enabled',
                      "title": "设置头部背景",
                      "desc": ""
                  },
                  "settingBody": {
                      "type": "settingBody",
                      "show": !controls[0] && $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-body-body',
                      "icon": "icon-automatic-configuration",
                      "class": 'enabled',
                      "title": "设置中部背景",
                      "desc": ""
                  },
                  "settingFooter": {
                      "type": "settingFooter",
                      "show": !controls[0] && $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-footer-body',
                      "icon": "icon-automatic-configuration",
                      "class": 'enabled',
                      "title": "设置底部背景",
                      "desc": ""
                  },
                  "settingPage": {
                      "type": "settingPage",
                      "show": !controls[0] && ($('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-footer' || $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-header' || $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-body'),
                      "icon": "icon-automatic-configuration",
                      "class": 'enabled',
                      "title": "设置页面背景",
                      "desc": ""
                  },
                  //"group": {
                  //    "type": "group",
                  //    "show": showGroup,
                  //    "icon": "icon-upload-component",
                  //    "class": showGroup ? 'enabled' : 'disabled',
                  //    "title": "组合",
                  //    "desc": "Ctrl + G"
                  //},
                  //"unGroup": {
                  //    "type": "unGroup",
                  //    "show": showUnGroup,
                  //    "icon": "icon-upload-component",
                  //    "class": showUnGroup ? 'enabled' : 'disabled',
                  //    "title": "解组",
                  //    "desc": "Ctrl + Shit + G"
                  //},
                  "top": {
                      "type": "top",
                      "show": controls.length > 1,
                      "icon": "icon-align-top",
                      "class": controls.length > 1 ? 'enabled' : 'disabled',
                      "title": "顶部对齐",
                      "desc": ""
                  },
                  "middle": {
                      "type": "middle",
                      "show": controls.length > 0,
                      "icon": "icon-vertical-alignment",
                      "class": controls.length > 0 ? 'enabled' : 'disabled',
                      "title": "上下居中",
                      "desc": ""
                  },
                  "bottom": {
                      "type": "bottom",
                      "show": controls.length > 1,
                      "icon": "icon-bottom-alignment",
                      "class": controls.length > 1 ? 'enabled' : 'disabled',
                      "title": "底部对齐",
                      "desc": ""
                  },
                  "left": {
                      "type": "left",
                      "show": controls.length > 1,
                      "icon": "icon-left-justified",
                      "class": controls.length > 1 ? 'enabled' : 'disabled',
                      "title": "左对齐",
                      "desc": ""
                  },
                  "center": {
                      "type": "center",
                      "show": controls.length > 0,
                      "icon": "icon-horizontal-alignment",
                      "class": controls.length > 0 ? 'enabled' : 'disabled',
                      "title": "左右居中",
                      "desc": ""
                  },
                  "right": {
                      "type": "right",
                      "show": controls.length > 1,
                      "icon": "icon-align-right",
                      "class": controls.length > 1 ? 'enabled' : 'disabled',
                      "title": "右对齐",
                      "desc": ""
                  },
                  "alignSize": {
                      "type": "alignSize",
                      "show": !!controls[0] && controls[0].key !== "controls_shapeandline_hline" && controls[0].key !== "controls_shapeandline_vline",
                      "icon": "icon-align-size",
                      "class": !!controls[0] && controls[0].key !== "controls_shapeandline_hline" && controls[0].key !== "controls_shapeandline_vline" && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 && controls[0].location.indexOf("-full") == -1 ? 'enabled' : 'disabled',
                      "title": "对齐大小",
                      "desc": ""
                  },
                  "alignWay": {
                      "type": "alignWay",
                      "show": !!controls[0],
                      "icon": "icon-align-size",
                      "class": !!controls[0] && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 && controls[0].location.indexOf("-full") == -1 ? 'enabled' : 'disabled',
                      "title": "对齐方式",
                      "desc": ""
                  },
                  "indexWay": {
                      "type": "indexWay",
                      "show": !!controls[0] && controls.length == 1 && controls[0].location.indexOf("-full") == -1,
                      "icon": "icon-forward-one",
                      "class": controls.length == 1 && !!controls[0] && controls[0].location.indexOf("-full") == -1 && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 && $.grep(controls, function (n) { if (!!n.locked && n.locked) { return n; } }).length == 0 ? 'enabled' : 'disabled',
                      "title": "层级",
                      "desc": ""
                  }
              }
          }
          _buildBtns([]);

          $scope.$on("framework.control.toolbar.get", function (e, model) {
              $scope.controls = !!model ? angular.copy(model) : [];
              $scope.disabled = {
                  width: !!$scope.controls[0] ? false : true,
                  height: !!$scope.controls[0] ? false : true,
                  x: !!$scope.controls[0] ? false : true,
                  y: !!$scope.controls[0] ? false : true
              };
              /*单个模块工具栏设置*/
              if (!!$scope.controls[0] && $scope.controls.length == 1) {
                  if ($scope.controls[0].locked) {//锁定
                      $scope.disabled = {
                          width: true,
                          height: true,
                          x: true,
                          y: true
                      }
                  } else if ($scope.controls[0].key.indexOf("detail") != -1) {/*详情页*/
                      $scope.disabled = {
                          width: false,
                          height: true,
                          x: false,
                          y: false
                      }
                  } else if ($scope.controls[0].location.indexOf("-full") !== -1) {//通栏
                      if ($scope.controls[0].key == "controls_shapeandline_hline") {//横线
                          $scope.disabled = {
                              width: true,
                              height: true,
                              x: true,
                              y: false
                          }
                      } else {
                          $scope.disabled = {
                              width: true,
                              height: false,
                              x: true,
                              y: false
                          }
                      }
                  } else if ($scope.controls[0].key == "controls_shapeandline_hline") {//横线
                      $scope.disabled = {
                          width: false,
                          height: true,
                          x: false,
                          y: false
                      }
                  } else if ($scope.controls[0].key == "controls_shapeandline_vline") {//竖线
                      $scope.disabled = {
                          width: true,
                          height: false,
                          x: false,
                          y: false
                      }
                  }
              }
              _buildBtns($scope.controls);
          });


          $scope.btnSave = function () {
              $scope.$broadcast("framework.header.event.save", false);
          }

          $scope.btnPreview = function () {
              $scope.$broadcast("framework.header.event.preview");
          }

          $scope.btnRelease = function () {
              $scope.$broadcast("framework.header.event.release");
          }

          $scope.btnExit = function () {
              messengerService.confirm("确定要关闭页面吗？</br>关闭之前请确保稿件已正常保存。",
                  function (confirm) {
                      if (confirm == true) {
                          window.close();
                      }
                  }, $scope);
          }



          /*move module toolbar*/
          /*author lilina*/
          $scope.draagleToolBar = function (event) {
              $(".module-configuration").draggable({
                  handle: ".module-configuration-top",
                  containment: '#bg',
                  scroll: false,
                  refreshPositions: true,
                  stop: function (event, ui) {
                      if (parseInt(ui.position.top) <= 50) {
                          $(".module-configuration").css("top", '60px');
                      }
                      if (parseInt(ui.position.left) < 70) {
                          $(".module-configuration").css("left", '70px');
                      }
                  }
              });
          }

          /*close toolbar*/
          /*author lilina*/
          $scope.closeToolBar = function () {
              $(".module-configuration").hide();
          }

          //global control toolbar coordinates
          /*author lilina*/
          $scope.modelsStyle = {
              left: "",
              top: "",
              width: "",
              height: ""
          };

          $scope.disabled = {
              width: true,
              height: true,
              x: true,
              y: true
          };
          $scope.btnCoordinates = function (action) {
              $scope.$broadcast("framework.control.toolbar.coordinates", action, $scope.modelsStyle);
          }

          /*获取当前模块style值*/
          $scope.$on('framework.control.toolbar.coordinates.style', function (event, data) {
              $scope.modelsStyle = data;
          });

          /*是否选中模块*/
          $scope.$watch("disabled.width", function (newVal, oldVal) {
              if (newVal) {
                  $scope.modelsStyle = {
                      left: "",
                      top: "",
                      width: "",
                      height: ""
                  };
              }
          });

          /*加载已经安装的终端的稿件*/
          $scope.installedInfoPC = null;
          $scope.installedInfoWAP = null;
          $scope.installedInfoWXP = null;
          $scope.installedInfoAPP = null;
          if ($scope.userInfo.isKplusUser === "true") {
              var kUID = loginService.getLoginInfo().manuscript_kid;
              templateService.getInstallTemplate({ kUID: kUID, templateType: "web" }, function (result) {
                  if (!!result.dataObject) {
                      $scope.installedInfoPC = result.dataObject;
                  }
              });
              templateService.getInstallTemplate({ kUID: kUID, templateType: "wap" }, function (result) {
                  if (!!result.dataObject) {
                      $scope.installedInfoWAP = result.dataObject;
                  }
              });
              templateService.getInstallTemplate({ kUID: kUID, templateType: "wxp" }, function (result) {
                  if (!!result.dataObject) {
                      $scope.installedInfoWXP = result.dataObject;
                  }
              });
              templateService.getInstallTemplate({ kUID: kUID, templateType: "app" }, function (result) {
                  if (!!result.dataObject) {
                      $scope.installedInfoAPP = result.dataObject;
                  }
              });
          }

          /*切换终端*/
          $scope.toggleWebType = function (type) {
              if ($scope.installedInfoPC == null) {
                  return false;
                  //modify by clark ,加入了一个判断条件：(($scope.installedInfoPC.webType || '').toLowerCase() == (type || '').toLowerCase())，如果点击的是跟当前稿件同一个平台就不进行切换了操作了。
              } else if (($scope.editorInfo.type === "mobile" && $location.search().templateType == type) || (($scope.installedInfoPC.webType || '').toLowerCase() == (type || '').toLowerCase())) {
                  return false;
              } else {
                  messengerService.confirm({
                      title: "提示",
                      message: "是否保存当前修改",
                      btnOK: "是",
                      btnNo: "否",
                      btnCancel: "取消"
                  }, function (confirm) {
                      if (confirm == true) {
                          $scope.$broadcast("framework.header.event.save", function (result) {
                              if (result.code == "200") {
                                  toggleWeb(type);
                              } else {
                                  messengerService.error(result.message);
                              }
                          });
                      } else if (confirm == "no") {
                          toggleWeb(type);
                      }
                  }, $scope);
              }
          }

          /*切换终端*/
          var toggleWeb = function (type) {
              switch (type) {
                  case "web":
                      window.location.href = "../#/framework?templateid=" + $scope.installedInfoPC.number;
                      break;
                  case "wap":
                      window.location.href = "../#/framework?templateType=wap&mobiletemplateid=" + $scope.installedInfoWAP.number;
                      break;
                  case "wxp":
                      window.location.href = "../#/framework?templateType=wxp&mobiletemplateid=" + $scope.installedInfoWXP.number;
                      break;
                  case "app":
                      window.location.href = "../#/framework?templateType=app&mobiletemplateid=" + $scope.installedInfoAPP.number;
                      break;
              }
          }

          /*mobile 下级菜单toggle*/
          $scope.showMobileWebtype = function (event) {
              if ($scope.installedInfoWAP != null || $scope.installedInfoWXP != null || $scope.installedInfoAPP != null) {
                  $(event.target).addClass("show-webtype");
                  $(event.target).find("span").show();
              }
          }
          $scope.hideMobileWebtype = function (event) {
              $(event.target).removeClass("show-webtype");
              $(event.target).find("span").hide();
          }

          $scope.hideWebtype = function (event) {
              $(event.target).closest("dd.show-webtype").removeClass("show-webtype");
              $("span.mobile-children-webType").hide();
          }

          $scope.$on("framework.get.editorInfo", function (e, callback) {
              callback($scope.editorInfo);

              //$scope.$broadcast("framework.get.editorInfoRes", $scope.editorInfo);
          });
      }
  ]);
