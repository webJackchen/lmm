'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FreameworkCtrl
 * @description
 * # FreameworkctrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkCtrl', ["$scope", "$location", "history", "loginService", "pageService", "messengerService",
      function ($scope, $location, history, loginService, pageService, messengerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.userInfo = loginService.getLoginInfo();

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

          var _buildBtns = function (controls) {
              $scope.btnModels = {
                  "lock": {
                      "type": "lock",
                      "show": !!controls[0],
                      "class": !!controls[0] && $.grep(controls, function (n) { return n.canLock == false }).length != controls.length ? 'enabled' : 'disabled',
                      "icon": !!controls[0] && controls[0].locked == true ? 'icon-unlock' : 'icon-lock',
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
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-sketchpad",
                      "class": controls.length == 1 && !!controls[0] && !!controls[0].settingBaseStyle ? 'enabled' : 'disabled',
                      "title": "样式",
                      "desc": ""
                  },
                  "scale": {
                      "type": "scale",
                      "show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('scale') >= 0,
                      "icon": "icon-one-to-one",
                      "class": !!controls[0] && (controls[0].locked == true || controls[0].location.indexOf("-full") != -1) ? 'disabled' : 'enabled',
                      "title": "自适应",
                      "desc": ""
                  },
                  "createStyle": {
                      "type": "createStyle",
                      "show": controls.length == 1 && !!controls[0] && !!controls[0].settingTemplateUrl && (controls[0].addTools || []).indexOf('createStyle') >= 0,
                      "icon": "icon-upload-module",
                      "class": controls.length == 1 && !!controls[0] && !!controls[0].settingTemplateUrl ? 'enabled' : 'disabled',
                      "title": "上传样式",
                      "desc": ""
                  },
                  "createComponent": {
                      "type": "createComponent",
                      "show": controls.length > 1,
                      "icon": "icon-upload-component",
                      "class": controls.length > 1 ? 'enabled' : 'disabled',
                      "title": "上传组件",
                      "desc": ""
                  },
                  "copy": {
                      "type": "copy",
                      "show": true,
                      "icon": "icon-copy",
                      //"class": !!controls[0] && $.grep(controls, function (n) { return n.canDelete == false }).length == 0 ? 'enabled' : 'disabled',
                      "class": !!controls[0] && $.grep(controls, function (n) { return n.canDelete != false }).length > 0 ? 'enabled' : 'disabled',
                      "title": "复制",
                      "desc": "Ctrl + C"
                  },
                  "patse": {
                      "type": "patse",
                      "show": true,
                      "icon": "icon-stick",
                      "class": !!$scope.$root.copyCache && !!$scope.$root.copyCache.length > 0 ? 'enabled' : 'disabled',
                      "title": "粘贴",
                      "desc": "Ctrl + V"
                  },
                  "fullWidth": {
                      "type": "fullWidth",
                      "show": controls.length == 1 && !!controls[0] && (controls[0].addTools || []).indexOf('stretch') >= 0,
                      "icon": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "icon-stretch" : "icon-cancel-stretch",
                      "class": "enabled",
                      "title": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "通栏" : "取消通栏",
                      "desc": ""
                  },
                  "indexUp": {
                      "type": "indexUp",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-move-up",
                      "class": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "enabled" : "disabled",
                      "title": "上一层",
                      "desc": ""
                  },
                  "indexDown": {
                      "type": "indexDown",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-move-down",
                      "class": !!controls[0] && !!controls[0].style && controls[0].style['z-index'] > 1 && controls[0].location.indexOf("-full") == -1 ? 'enabled' : 'disabled',
                      "title": "下一层",
                      "desc": ""
                  },
                  "indexTop": {
                      "type": "indexTop",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-to-the-top",
                      "class": !!controls[0] && controls[0].location.indexOf("-full") == -1 ? "enabled" : "disabled",
                      "title": "顶层",
                      "desc": ""
                  },
                  "indexBottom": {
                      "type": "indexBottom",
                      "show": controls.length == 1 && !!controls[0],
                      "icon": "icon-to-the-down",
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
                      "title": "头部设置",
                      "desc": ""
                  },
                  "settingFooter": {
                      "type": "settingFooter",
                      "show": !controls[0] && $('.lanh-control-toolbar-rightmenu').attr('panelType') === 'content-footer-body',
                      "icon": "icon-automatic-configuration",
                      "class": 'enabled',
                      "title": "底部设置",
                      "desc": ""
                  }
              }
          }
          _buildBtns([]);

          $scope.$on("framework.control.toolbar.get", function (e, model) {
              $scope.controls = !!model ? angular.copy(model) : [];
              _buildBtns($scope.controls);
          });

          $scope.btnSave = function () {
              $scope.$broadcast("framework.header.event.save");
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
      }
  ]);
