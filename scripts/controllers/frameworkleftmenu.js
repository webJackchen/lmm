'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FrameworkleftmenuCtrl
 * @description
 * # FrameworkleftmenuCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkLeftMenuCtrl', ["$scope", "$element", "storage", "loginService", "$timeout", "FrameworkLeftMenuService", '$filter', 'pageService', 'messengerService', 
      function ($scope, $element, storage, loginService, $timeout, frameworkLeftMenuService, $filter, pageService, messengerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];


          $(".framework ").bind("selectstart", function () {
              return false;
          });

          storage.session.set("pageAlias", "default");
          $scope.editorInfo = $scope.$parent.editorInfo;
          var model = $scope.model = {
              menus: frameworkLeftMenuService.getLeftMenuJson($scope.editorInfo.type)
          };

          var _foucsLeftMenus = false;

          var _hideMenus = function (_menus) {
              $.each(_menus || model.menus, function (i, _menu) {
                  _menu.foucs = "";
              });
              // $element.find("#leftMenus").find("i").css("height", "40px")
          }
          var _createControl = function (option) {
              $scope.$emit("framework.selectedControl", [option]);
          }

          $scope.selectPage = "default";
          $scope.savedModel = {};
          var _getPages = function () {
              pageService.getPages(function (result) {
                  $scope.source = result;
                  $scope.$root.$broadcast("framework.header.event.togglepage", $scope.source.groupPages[0]);
              });
          }

          if ($scope.editorInfo.type == "web" || $scope.editorInfo.type == "mobile") {
              if (loginService.getLoginInfo().isKplusUser != "true") {
                  pageService.getKPlusId($scope.editorInfo.id, function (result) {
                      storage.session.set("manuscript_kid", result.dataObject.sKID);
                      _getPages();
                  })
              } else {
                  storage.session.set("manuscript_kid", loginService.getLoginInfo().userName);
                  _getPages();
              }
          }
          var refreshPage = function (menuItem, type) {
              if (!menuItem) return false;
              $scope.$root.$broadcast("framework.header.event.togglepage", menuItem);
              $scope.$root.currentPageItem = menuItem;
              model = $scope.model = {
                  menus: frameworkLeftMenuService.getLeftMenuJson($scope.editorInfo.type, type, menuItem)
              };
              draggableMenus();
          }

          $scope.pageData = {};
          $scope.togglePage = function (menuItem, pageType, $event) {
              $event.stopPropagation();
              $scope.pageData = menuItem;
              $(".lanh-control-toolbar").removeClass("on");
              if (!pageType && !menuItem.single) return;
              menuItem = pageService.convertToPageData(menuItem, pageType);
              messengerService.confirm({
                  title: "提示",
                  message: "<span>请确保页面已经保存</span></br><span style='color: red;'>如不保存将丢失数据</span>",
                  btnOK: "是",
                  btnNo: "否",
                  btnCancel: "取消"
              }, function (confirm) {
                  if (confirm == true) {
                      $scope.$root.$broadcast("framework.header.event.save", function (result) {
                          if (result.code == "200") {
                              refreshPage(menuItem, pageType);
                          } else {
                              messengerService.error(result.message);
                          }
                      });
                  } else if (confirm == "no") {
                      refreshPage(menuItem, pageType);
                      //$scope.currentPage = $scope.selectPage;
                      //$scope.$root.$broadcast("framework.header.event.togglepage", $.grep($scope.source.groupPages, function (n) { return n.key == $scope.currentPage })[0]);
                  } else {
                      $scope.selectPage = $scope.currentPage;
                  }
              }, $scope);

              //判断是否改变了内容
              //$scope.$root.$broadcast("framework.editor.model.get", function (pageModel) {
              //    if (JSON.stringify(pageModel) === JSON.stringify($("#content").html())) {
              //        refreshPage(menuItem, pageType);
              //    } else {
              //        messengerService.confirm({
              //            title: "提示",
              //            message: "<span>网站设计已更改，是否立即保存？</span></br><span style='color: red;'>如不保存将丢失数据</span>",
              //            btnOK: "是",
              //            btnNo: "否",
              //            btnCancel: "取消"
              //        }, function (confirm) {
              //            if (confirm == true) {
              //                $scope.$root.$broadcast("framework.header.event.save", function (result) {
              //                    if (result.code == "200") {
              //                        refreshPage(menuItem, pageType);
              //                    } else {
              //                        messengerService.error(result.message);
              //                    }
              //                });
              //            } else if (confirm == "no") {
              //                $scope.currentPage = $scope.selectPage;
              //                $scope.$root.$broadcast("framework.header.event.togglepage", $.grep($scope.source.groupPages, function (n) { return n.key == $scope.currentPage })[0]);
              //            } else {
              //                $scope.selectPage = $scope.currentPage;
              //            }
              //        }, $scope);
              //    }

              //});


          }

          $scope.$on('leftmenu.expand', function (e, args) {
              _foucsLeftMenus = true;
              if (args.menuKey) {
                  var menuItem = $filter('filter')(model.menus, function (menuItem) { return menuItem.key === args.menuKey });
                  if (menuItem && menuItem[0]) {
                      $scope.foucsMenuOptions(menuItem[0], model.menus);
                  }
              }
          });

          var getCurrentMenuItem = function (key) {
              var menuItem = $filter('filter')(model.menus, function (menuItem) { return menuItem.key === 'controls'; });
              if (menuItem && menuItem[0]) {
                  var childItems = menuItem[0].childs;
                  for (var i = 0, ii = (childItems || []).length; i < ii; i++) {
                      var thiredItems = childItems[i].childs,
                          queriedArr = $filter('filter')(thiredItems, function (childItem) { return childItem.key === key; }) || [];
                      if (queriedArr.length > 0)
                          return queriedArr[0];
                  }
              }
              return null;
          }


          var showMovingMouseTarget = function (event, dragTarget) {
              var dataKey =
                  $(dragTarget.helper.context).data('key'),
                  dataItem = getCurrentMenuItem(dataKey),
                  initStyle = dataItem.style;

              var targetDom = $('<div class="dragging-target-mouse"></div>');
              if ($(document.body).find('.dragging-target-mouse').length > 0) {
                  $(document.body).find('.dragging-target-mouse').css({
                      top: dragTarget.offset.top,
                      left: dragTarget.offset.left
                  });
              }
              else {
                  var controlText = $(dragTarget.helper.context).clone().text();
                  targetDom.html(controlText)
                  targetDom.css({
                      top: dragTarget.offset.top,
                      left: dragTarget.offset.left,
                      width: initStyle.width,
                      height: initStyle.height
                  }).appendTo(document.body);
              }

              $('.menu-modules .ui-draggable.ui-draggable-handle.ui-draggable-dragging').html(controlText);
              $('.menu-modules .ui-draggable.ui-draggable-handle.ui-draggable-dragging').css({
                  width: initStyle.width,
                  height: initStyle.height
              });
          }

          var removeMovingMouseTarget = function () {
              $(document.body).find('.dragging-target-mouse').remove();
          }

          var draggableMenus = function () {
              $timeout(function () {
                  $('.menu-modules > li').draggable({
                      helper: "clone",
                      iframeFix: true,
                      cursor: "move",
                      drag: function (event, ui) {
                          $scope.$apply(function () {
                              showMovingMouseTarget(event, ui);
                          });
                      },
                      stop: function () {
                          $scope.$apply(function () {
                              removeMovingMouseTarget();
                          });
                      }
                  });

                  $('#content').droppable({
                      //activeClass: "ui-state-default",
                      //hoverClass: "ui-state-hover",
                      drop: function (event, ui) {
                          $scope.$apply(function () {
                              var controlKey = $(ui.draggable.context).data('key');
                              createElement(controlKey, Kdo.getContentPosition(ui.offset))
                          });
                      }
                  });
              }, 1000);
          }
          draggableMenus();

          var createElement = function (controlKey, currentPosition) {
              var currentItem = getCurrentMenuItem(controlKey),
                  positionOffset = $(currentPosition.selector || '#content-body-body').offset();
              if (currentItem && currentPosition.top > positionOffset.top && currentPosition.left > positionOffset.left) {
                  if (!currentItem.style) currentItem.style = {};
                  currentItem.style.top = currentPosition.top - positionOffset.top;
                  currentItem.style.left = currentPosition.left - positionOffset.left;
                  currentItem.location = currentPosition.name;
                  $scope.foucsMenuOptions(currentItem, model.menus);
              }
          }


          $scope.foucsMenuOptions = function (menu, menus, location, event) {
              $(".menu-body").mCustomScrollbar({ theme: "minimal-dark" });
              if (!!menus) {
                  $.each(menus, function (i, _menu) {
                      _menu.foucs = "";
                  });
              }
              if (!!menu.childs && menu.childs.length > 0) {
                  menu.foucs = "on";
                  // $(event.currentTarget).find("i").css("height","50px")
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
              event && event.stopPropagation();
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
                  else {
                      _foucsLeftMenus = false;
                  }
              });
          });

          $timeout(function () {
              $(".child-menu").mCustomScrollbar({ theme: "minimal-dark" });
          }, 1000)


          $scope.showLocation = function (event) {
              // $(event.currentTarget).children(".location").stop(true, false).fadeIn();
              $(event.currentTarget).parent().addClass("on");
          }

          $scope.hideLocation = function (event) {
              //$(event.currentTarget).children(".location").stop(true, false).fadeOut();
              $(event.currentTarget).parent().removeClass("on");
          }

          /*toggle children menu*/
          $scope.toggleChildren = function (event) {
              $(event.currentTarget).siblings("ul.menu-modules").toggle();
              if ($(event.currentTarget).siblings("ul.menu-modules").is(":hidden")) {
                  $(event.currentTarget).find("i.icon-down-arrow").show();
                  $(event.currentTarget).find("i.icon-up-arrow").hide();
              } else {
                  $(event.currentTarget).find("i.icon-down-arrow").hide();
                  $(event.currentTarget).find("i.icon-up-arrow").show();
              }
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
                  if (!!$scope.pageData.key)
                      option = $.extend(frameworkLeftMenuService.getMenuInfo(option.key, $scope.editorInfo.type, $scope.pageData), option);
                  else
                      option = $.extend(frameworkLeftMenuService.getMenuInfo(option.key, $scope.editorInfo.type), option);
                  option._createNew = option._createNew || false;
                  //option._banlog = true;
                  _createControl(option);
              });
          });

      }
  ]);
