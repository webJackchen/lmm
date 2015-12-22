'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FrameworkleftmenuCtrl
 * @description
 * # FrameworkleftmenuCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkLeftMenuCtrl', ["$scope", "$element", "storage", "loginService", "$timeout", "FrameworkLeftMenuService",
      function ($scope, $element, storage, loginService, $timeout, frameworkLeftMenuService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.editorInfo = $scope.$parent.editorInfo;

          var model = $scope.model = {
              menus: frameworkLeftMenuService.getLeftMenuJson()
          };

          var _foucsLeftMenus = false;

          var _hideMenus = function (_menus) {
              $.each(_menus || model.menus, function (i, _menu) {
                  _menu.foucs = "";
              });
              $element.find("#leftMenus").find("i").css("height", "40px")
          }
          var _createControl = function (option) {
              $scope.$emit("framework.selectedControl", [option]);
          }

          $scope.foucsMenuOptions = function (menu, menus, location, event) {
              if (!!menus) {
                  $.each(menus, function (i, _menu) {
                      _menu.foucs = "";
                  });
              }
              if (!!menu.childs && menu.childs.length > 0) {
                  menu.foucs = "on";
                  $(event.currentTarget).find("i").css("height","50px")
              } else {
                  _foucsLeftMenus == false;
                  var _menu = angular.copy(menu);
                  switch (_menu.action) {
                      case "setting":
                          if (!_menu.settingTemplateUrl) return;
                          break;
                      case "window":
                      case "select":
                      case "default":
                      default:
                          if (!_menu.defaultTemplate && !_menu.settingTemplateUrl) return;
                          break;
                  }

                  _menu.location = _menu.location || "body";
                  if (_menu.controlId == "pageBackground") {
                      _menu.controlId = _menu.controlId + "." + _menu.location;
                  }
                  _menu._createNew = true;
                  _createControl(_menu);
                  _hideMenus();
              }
              event.stopPropagation();
          }

          $timeout(function () {
              $element.find("#leftMenus").children("li")
                  .on("mouseenter", function (e) {
                      $timeout(function () {
                          _foucsLeftMenus = true;
                      });
                  }).on("mouseleave", function (e) {
                      $timeout(function () {
                          _foucsLeftMenus = false;
                      });
                  });
          });

          $(document).on("click", function () {
              $timeout(function () {
                  if (_foucsLeftMenus == false) {
                      _hideMenus();
                  }
              });
          });

          $scope.showLocation = function (event) {
              $(event.currentTarget).children(".location").stop(true, false).fadeIn();
          }

          $scope.hideLocation = function (event) {
              $(event.currentTarget).children(".location").stop(true, false).fadeOut();
          }

          $scope.btnClose = function (menus, event) {
              _hideMenus(menus);
              event.stopPropagation();
          }

          $scope.openSysManage = function () {
              window.open(loginService.getLoginInfo().kplusPath);
          }

          $scope.$on("framework.attachControl", function (e, options) {
              $.each(options, function (i, option) {
                  option = $.extend(frameworkLeftMenuService.getMenuInfo(option.key), option);
                  option._createNew = option._createNew || false;
                  //option._banlog = true;
                  _createControl(option);
              });
          });
      }
  ]);
