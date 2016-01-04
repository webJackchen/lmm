'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FrameworkpageeditorCtrl
 * @description
 * # FrameworkpageeditorCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkPageEditorCtrl', ["$scope", "$filter", "$element", "$timeout", "$compile", "$http", "$location", "lanhWindow", "keyboardFeature", "history", "alignService", "utilsService", "pageService", "componentService", "messengerService", "FrameworkLeftMenuService", "styleService", "loginService",
      function ($scope, $filter, $element, $timeout, $compile, $http, $location, lanhWindow, keyboardFeature, history, alignService, utilsService, pageService, componentService, messengerService, frameworkLeftMenuService, styleService, loginService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          keyboardFeature.attachScope($scope);
          history.attachScope($scope);
          alignService.attachScope($scope);

          Kdo.init($element);


          var model = $scope.model = {};
          $scope.editorInfo = $scope.$parent.editorInfo;

          var _mouseEnterTarget = null,
              _clickTarget = [],
              _isRightMenuPanel = false,
              _mouseEnterEditorPanel = false;

          /*系统事件入口点绑定 modify by clark*/
          Kdo.on('marquee', {
              begin: function (event, ui) {
                  _mouseSeletable = true;
                  _clickTarget = [];
              },
              ing: function (event, ui) {
                  _clickTarget.push(ui.selected);
                  $(ui.selected).addClass("on");
              },
              end: function (event, ui) {
                  _showToolbar(_clickTarget);
                  $scope.checkedModuleStyle(_clickTarget);
                  Kdo.elementGroup.createTempGroup();
              }
          })
        .on('resize', {
            ing: function (event, ui) {
                _maxHeightFn(ui.helper);
                if ($(ui.helper).attr('id') === '#content-footer') {
                    var scrollTop = $(document).scrollTop();
                    $(document).scrollTop($(document).height());
                }
            },
            end: function (event, ui) {
                _maxHeightFn(ui.helper);
            }
        })
        .on('drop', {
            ing: function (event, ui) {
                var self = this;
                $timeout(function () {
                    var targetLocation = "";
                    switch ($(self).attr("id")) {
                        case "content-header":
                            targetLocation = "header-full";
                            break;
                        case "content-header-body":
                            targetLocation = "header";
                            break;
                        case "content-body":
                            targetLocation = "body-full";
                            break;
                        case "content-body-body":
                            targetLocation = "body";
                            break;
                        case "content-footer":
                            targetLocation = "footer-full";
                            break;
                        case "content-footer-body":
                            targetLocation = "footer";
                            break;
                    }
                    var _models = [],
                        diffPosition = { left: 0, top: 0 };
                    $.each(ui.helper.find("[id^='control_']"), function (i, el) {
                        var id = $(el).attr("id"),
                            _model = angular.copy($scope.model[id]);
                        if (_model.location != targetLocation) {
                            _model.location = targetLocation;
                            _model.style.left = ui.helper.position().left;
                            _model.style.top = ui.helper.offset().top - $(self).offset().top;
                            if (ui.helper.attr("id") == "oper_selectedPanel") {
                                var position = $(el).parent().position();
                                _model.style.left += position.left;
                                _model.style.top += position.top;
                            }

                            //if (_model.style.left < 0) {
                            //    _model.style.left = 0;
                            //} else if (_model.style.left + ui.helper.outerWidth() > $(self).width()) {
                            //    _model.style.left = $(self).width() - ui.helper.outerWidth();
                            //}
                            //if (_model.style.top < 0) {
                            //    _model.style.top = 0;
                            //} else if (_model.style.top + ui.helper.outerHeight() > $(self).height()) {
                            //    _model.style.top = $(self).height() - ui.helper.outerHeight();
                            //}
                            if (_model.style.left < 0) {
                                diffPosition.left = Math.min(diffPosition.left, _model.style.left);
                            }
                            if (_model.style.top < 0) {
                                diffPosition.top = Math.min(diffPosition.top, _model.style.top);
                            }
                            delete $scope.model[id];
                            _models.push(_model);
                            //history.log();
                        }
                    });
                    if (_models.length > 0) {
                        //模块顶部修正
                        $.each(_models, function (i, _model) {
                            if (diffPosition.left < 0) {
                                _model["style"].left -= diffPosition.left;
                            }
                            if (diffPosition.top < 0) {
                                _model["style"].top -= diffPosition.top;
                            }
                        });
                        ui.helper.remove();
                        _clickTarget = [];
                        $scope.$broadcast("framework.createControl", _models);
                    }
                });
            },
            end: function (event, ui) {
                var self = this;
                $timeout(function () {
                    var id = ui.helper.find("[id^='control_']").attr("id"),
                        targetLocation = "";
                    switch ($(self).attr("id")) {
                        case "content-header":
                            targetLocation = "header-full";
                            break;
                        case "content-header-body":
                            targetLocation = "header";
                            break;
                        case "content-body":
                            targetLocation = "body-full";
                            break;
                        case "content-body-body":
                            targetLocation = "body";
                            break;
                        case "content-footer":
                            targetLocation = "footer-full";
                            break;
                        case "content-footer-body":
                            targetLocation = "footer";
                            break;
                    }
                    if ($scope.model[id].location != targetLocation) {
                        $(self).addClass("drop-state-active");
                    }
                });
            }
        })
        .on('mousedown', function (e) {
            $('#content-header').removeClass('selected');
            $('#content-body').removeClass('selected');
            $('#content-footer').removeClass('selected');
            $(this).addClass('selected');
            //if (event.which == 1) {
            //    Kdo.elementGroup.unGroup($(e.target));
            //}
        });
          /*系统事件入口点绑定 end modify by clark*/


          var _showMouseRightMenu = function (event) {
              if (_isRightMenuPanel == true) return true;
              var $toolbar = $(".lanh-control-toolbar-rightmenu");
              $toolbar.removeClass("on");
              var containerId = $(event.target).attr("id");

              var _width = ($(event.target).width() - $(event.target).find("[id^='content-']").width()) / 2;
              var _screenWidth = event.screenX - parseInt($(".left-menu").width());

              if (_screenWidth < _width || _screenWidth > _width + parseInt($("#" + containerId + "-body").width())) {/*当前点击区域在虚线两侧*/
                  $toolbar.attr("panelType", containerId);
              } else {
                  $toolbar.attr("panelType", containerId + "-body");
              }

              if (event.which == 3) {
                  $toolbar.addClass("on");
                  var position = {
                      left: event.pageX,
                      top: event.pageY,
                      offsetLeft: 1,
                      offsetTop: 1
                  }
                  if ((position.left + $toolbar.width()) > $(window).width()) {
                      position.left = position.left - $toolbar.width();
                      position.offsetLeft = -1;
                  }
                  if ((position.top + $toolbar.height()) > $(window).height()) {
                      position.top = position.top - $toolbar.height();
                      position.offsetTop = -1;
                  }
                  $toolbar.css({
                      "left": position.left + position.offsetLeft,
                      "top": position.top + position.offsetTop,
                  });
              }
              _showToolbar(_clickTarget);
          }

          //键盘点击执行流程
          var _keyEvent = function (event) {
              if (event.keyCode == 46) {/*键盘删除事件*/
                  $scope.updateModelZIndex(_clickTarget);
              }
              var isSuccess = keyboardFeature.buildEvent(event, _clickTarget);
              if (isSuccess == true && !!_clickTarget) {
                  if (angular.isArray(_clickTarget)) {
                      $.each(_clickTarget, function (i, target) {
                          var id = $(target).find("[id^='control_']").attr("id");
                          _updateModel(id);
                      });
                  } else {
                      var id = $(_clickTarget).find("[id^='control_']").attr("id");
                      _updateModel($(_clickTarget).find("[id^='control_']").attr("id"));
                  }
                  _showToolbar(_clickTarget);
              }
              return isSuccess;
          }
          var _keydownIsSuccess = false,
              _mouseDraggable = false,
              _mouseSeletable = false,
              _focusControlTarget = "realWidth";

          var _unlockControls = function (target) {
              $timeout(function () {
                  if (!!target) {
                      if (target == _focusControlTarget) return true;
                      else _focusControlTarget = target;
                  }

                  $element.find("[id^='oper_'].fullWidth").draggable({ disabled: true }).resizable({ disabled: true });
                  $element.find("[id^='oper_'].realWidth").draggable({ disabled: true }).resizable({ disabled: true });

                  switch (_focusControlTarget) {
                      case "fullWidth":
                          $element.find("[id^='oper_'].realWidth").removeClass("on");
                          $element.find("[id^='oper_'].fullWidth").css({ "z-index": 1 });
                          $element.find("#content-header,#content-body,#content-footer").selectable("option", "disabled", true);
                          $element.find("[id^='oper_'].realWidth").find(".ui-resizable-handle").hide();
                          break;
                      case "realWidth":
                          $element.find("[id^='oper_'].fullWidth").removeClass("on");
                          $element.find("[id^='oper_'].fullWidth").css({ "z-index": 0 });
                          $element.find("#content-header,#content-body,#content-footer").selectable("option", "disabled", false);
                          break;
                  }
                  _clickTarget = $.grep(_clickTarget, function (el) { return $(el).hasClass(_focusControlTarget) });
                  $scope.checkedModuleStyle(_clickTarget);
                  _showToolbar(_clickTarget);

                  $.each($element.find("[id^='oper_']." + _focusControlTarget), function (i, el) {
                      var _id = $(el).find("[id^='control_']").attr("id"),
                          locked = $scope.model[_id].locked;
                      $(el).draggable({ disabled: locked == true }).resizable({ disabled: locked == true });
                  });

              })
          }

          $element.on("mouseup.rightMenu", function (e) {
              $timeout(function () {
                  if (Kdo.elementGroup.elementIsGroup(e.target) === "group")
                      $scope.$emit("framework.control.toolbar.get", $(e.target));
                  else
                      _showMouseRightMenu(e);
              });
          });


          var onKeyupHooks = [];
          $(document).on("keydown", function (event) {
              if ((event.ctrlKey && event.keyCode == 65) || event.keyCode == 18) {/*屏蔽ctrl+a*/
                  return false;
              }
              if (_mouseEnterEditorPanel == true && keyboardFeature.checkKeys(event)) {
                  if (keyboardFeature.keydownKeys[event.keyCode]) {
                      $timeout(function () {
                          _keydownIsSuccess = _keyEvent(event);
                      });
                  }
                  //查询有效快捷键，阻止事件冒泡。
                  return false;
              }
          })
          .on("keyup", function (event) {
              if (onKeyupHooks.length > 0) {
                  for (var i = 0, ii = onKeyupHooks.length; i < ii; i++) {
                      if (typeof onKeyupHooks[i] === 'function') {
                          onKeyupHooks[i](event);
                      }
                  }
              }

              if (event.keyCode == 18) {
                  return false;
              }
              if (_mouseEnterEditorPanel == true && keyboardFeature.checkKeys(event)) {
                  $timeout(function () {
                      var isSuccess = _keydownIsSuccess;   //如果是keydown执行事件成功，则在keyup时需要记录日志。
                      if (keyboardFeature.keyupKeys[event.keyCode]) {
                          isSuccess = _keyEvent(event);
                      }
                      if (isSuccess == true) {
                          if (event.keyCode == 46) {
                              _clickTarget = [];
                          } else if (event.keyCode != 67 && event.keyCode != 86 && event.keyCode != 90 && event.keyCode != 89) {
                              history.log();
                          }
                      }
                  });
                  //查询有效快捷键，阻止事件冒泡。
                  return false;
              }
          })
          .on("mousemove", function (event) {
              if (event.ctrlKey == false && $(event.target).parents("div.fullWidth").length < 0) {
                  _unlockControls("realWidth");
              }
          })
          /* 通栏可以直接选择，没有点击对象，并且没有按住ctrl时执行让对应模块解锁 */
         //mousemove改为 mouseup通栏后无法框选其他模块；
          .on("mouseup", function (event) {
              if (event.ctrlKey == false) {
                  if ($(event.target).parents("div.realWidth").length > 0 && _clickTarget.length == 0) {
                      _unlockControls("realWidth");
                      $(event.target).parents(".realWidth").addClass("hover");
                      return false;
                  } else if ($(event.target).parents("div.fullWidth").length > 0 && _clickTarget.length == 0) {
                      _unlockControls("fullWidth");
                      $(event.target).parents(".fullWidth").addClass("hover");
                      return false;
                  }
              }
          });

          $element.on("mousedown.controlFocus", function (e) {
              /* 通栏可以直接选择，点击通栏的时候让通栏解锁，点击模块让模块解锁 */
              if (event.ctrlKey == false) {
                  if ($(event.target).parents("div.fullWidth").length > 0)
                      _unlockControls("fullWidth");
                  else
                      _unlockControls("realWidth");
              }
              $timeout(function () {
                  if ($scope.$root._attachMouseEvents == "alignSize") return true;
                  if (!!_mouseEnterTarget && !$(_mouseEnterTarget).hasClass(_focusControlTarget)) return true;
                  if (_isRightMenuPanel) return true;
                  //if ($(e.target).attr("id") == "alignMenu" || $(e.target).parents("#alignMenu").length > 0) return true;
                  $element.find("[id^='oper_']").removeClass("new");

                  if (e.which == 1 || e.which == 3) {
                      if (e.which == 1 && e.ctrlKey) {
                          if (!!_mouseEnterTarget) {
                              var focus = $(_mouseEnterTarget).hasClass("on");
                              if (focus) {
                                  $(_mouseEnterTarget).removeClass("on");
                                  _clickTarget = $.grep(_clickTarget, function (n) { return $(n).hasClass("on") });
                              } else {
                                  $(_mouseEnterTarget).addClass("on");
                                  if ($.grep(_clickTarget, function (n) { return $(n).attr("id") == $(_mouseEnterTarget).attr("id") }).length == 0) {
                                      _clickTarget.push(_mouseEnterTarget);
                                  }
                              }
                          }
                      } else {
                          //  if (!!_mouseEnterTarget && _clickTarget.length <= 1) {/*去掉_clickTarget.length <= 1，满足框选单选摸个模块 lilingna*/
                          if (!!_mouseEnterTarget) {
                              $element.find("[id^='oper_']").removeClass("on");
                              $(_mouseEnterTarget).addClass("on");
                              _clickTarget = $(_mouseEnterTarget);
                              _showToolbar(_clickTarget);
                              $scope.checkedModuleStyle(_clickTarget);
                          } else if (_mouseEnterTarget == null) {
                              $element.find("[id^='oper_']").removeClass("on");
                              _showToolbar(_clickTarget);
                              _clickTarget = [];
                              Kdo.elementGroup.unGroup($(e.target));
                              $(".ui-widget-content .ui-resizable-handle").hide();
                          }
                      }
                  }
              });
          })
          .on("mouseup.controlFocus", function (e) {
              $timeout(function () {
                  if ($scope.$root._attachMouseEvents == "alignSize") return true;
                  if (_isRightMenuPanel) return true;
                  //if ($(e.target).attr("id") == "alignMenu" || $(e.target).parents("#alignMenu").length > 0) return true;
                  if (!!_mouseEnterTarget && !$(_mouseEnterTarget).hasClass(_focusControlTarget)) return true;
                  if (_mouseDraggable) {
                      _mouseDraggable = false;
                      return true;
                  }
                  if ((e.which == 1 && !e.ctrlKey && _mouseSeletable == false) ||
                      e.which == 3 && _clickTarget.length == 1) {
                      $element.find("[id^='oper_']").removeClass("on");
                      $(_mouseEnterTarget).addClass("on");
                      //Kdo.elementGroup.unGroup($(e.target));
                      hideModuleTopTip(_mouseEnterTarget);

                      //设计师编辑界面模块宽、高值有时无法设置bug;
                      //原因鼠标放开后失去_clickTarget被重置
                      if ($(':focus').length == 0) {
                          _clickTarget = $(_mouseEnterTarget);
                      }
                      _showToolbar(_clickTarget);
                      $scope.checkedModuleStyle(_clickTarget);
                  }
              });
          })

          var _maxHeightFn = function (target) {
              var maxHeight = 0;
              $.each($(target).find("[id^='oper_']"), function (i, control) {
                  maxHeight = Math.max(maxHeight, $(control).position().top + $(control).height());
              });
              if ($(target).height() < maxHeight)
                  $(target).height(maxHeight);
              $scope.pageSize = {
                  pageHeader: { width: $element.find("#content-header-body").width(), height: $element.find("#content-header-body").height() },
                  pageBody: { width: $element.find("#content-body-body").width(), height: $element.find("#content-body-body").height() },
                  pageFooter: { width: $element.find("#content-footer-body").width(), height: $element.find("#content-footer-body").height() }
              }
              //todo: 需优化
              if (!!$scope.model["pageBackground.header"]) {
                  var style = $scope.model["pageBackground.header"]["style"];
                  if (!!style) style.height = $scope.pageSize.pageHeader.height;
              }
              if (!!$scope.model["pageBackground.body"]) {
                  var style = $scope.model["pageBackground.body"]["style"];
                  //if (!!style) style.height = $scope.pageSize.pageBody.height;
              }
              if (!!$scope.model["pageBackground.footer"]) {
                  var style = $scope.model["pageBackground.footer"]["style"];
                  if (!!style) style.height = $scope.pageSize.pageFooter.height;
              }
          }

          var _resizeControlHeightFn = function (target) {
              for (var key in $scope.model) {
                  switch ($scope.model[key].key) {
                      case "controls_download_detail":
                      case "controls_article_detail":
                      case "controls_job_detail":
                      case "controls_news_detail":
                      case "controls_product_detail":
                      case "controls_fulltextresult":
                          $(target).find("[id='oper_" + $scope.model[key].controlId + "']").height($(target).height());
                          _updateModel($scope.model[key].controlId);
                          break;
                  }
              }
          }



          $element.on("mouseenter", function (e) {
              $timeout(function () {
                  _mouseEnterEditorPanel = true;
              });
          }).on("mouseleave", function (e) {
              $timeout(function () {
                  _mouseEnterEditorPanel = false;
              });
          });

          $timeout(function () {
              $(".lanh-control-toolbar").on("mouseenter", function () {
                  $timeout(function () {
                      var controlId = $(".lanh-control-toolbar").attr("attachControl");
                      if (!!controlId) {
                          _mouseEnterTarget = $element.find("#oper_" + controlId)[0];
                      }
                  });
              }).on("mouseleave", function () {
                  $timeout(function () {
                      _mouseEnterTarget = null;
                  });
              });

              $(".lanh-control-toolbar-rightmenu")
                  .on("mouseenter.rightMenu", function (e) {
                      $timeout(function () {
                          _isRightMenuPanel = true;
                      });
                  })
                  .on("mouseleave.rightMenu", function (e) {
                      $timeout(function () {
                          _isRightMenuPanel = false;
                      });
                  })
                  .on("mouseup.rightMenu", function (e) {
                      if (e.which == 2) return true;
                      $(".lanh-control-toolbar-rightmenu").removeClass("on");
                  });
          }, 1000);

          var _updateModel = function (id, action) {
              var $dom = $element.find("#oper_" + id);
              if ($dom.length == 0) return;
              if (!model[id].style) model[id].style = {};
              if (model[id]._createNew != true && action != "rewrite") {
                  var position = $dom.position();
                  if ($dom.parent().attr("id") == "oper_selectedPanel") {
                      var parentPosition = $dom.parent().position();
                      position.left += parentPosition.left;
                      position.top += parentPosition.top;
                  }
                  //通栏不改变宽度和left坐标
                  if (model[id].location.indexOf("-full") == -1) {
                      model[id].style.width = $dom.width();
                      model[id].style.left = position.left;
                  }
                  model[id].style.height = $dom.height();
                  model[id].style.top = position.top;
              }
              //
              if (model[id].location.indexOf("-full") != -1 && !!model[id].resizeHandles) {
                  var handles = model[id].resizeHandles.split(",");
                  if ($.grep(handles, function (n) { return n.indexOf("e") != -1 || n.indexOf("w") != -1 }).length == 0) {
                      model[id].style.width = "auto";
                  }
                  if ($.grep(handles, function (n) { return n.indexOf("n") != -1 || n.indexOf("s") != -1 }).length == 0) {
                      model[id].style.height = "auto";
                  }
              }
              return model[id].style;
          }


          var _updeteModel1 = function (json) {
              //json.id 元素id    json.action  行为    
              //json.isGoup  取值true，false   是否是组合，若是组合或临时组合的话，前面json.id 为其外层容器id
              var elemArr = []; //欲更新的元素数组
              if (json.isGoup) {//是组合
                  elemArr = $("#" + json.id).find("[id^='lock_oper_']");
              } else {//不是组合
                  elemArr.push($element.find("#oper_" + json.id));
              }
              if (elemArr.length == 0) return;

              $.each(elemArr, function (index, item) {
                  if(!!$(item).attr("id")){
                      var Index = $(item).attr("id").indexOf("control_");
                  }else{
                      return;
                  }
                  var itemId = $(item).attr("id").substring(Index);
                  if (!!$scope.model[itemId]) {
                      if (!!$scope.model[itemId].dragCallback) $(document).trigger($scope.model[itemId].dragCallback, itemId);
                  }
                  if (!model[itemId].style) model[itemId].style = {};
                  if (model[itemId]._createNew != true && json.action != "rewrite") {
                      var position = $(item).position();
                      if (json.isGoup) {
                          var parentPosition = $(item).parent().position();
                          position.left += parentPosition.left;
                          position.top += parentPosition.top;
                      }
                      //通栏不改变宽度和left坐标
                      if (model[itemId].location.indexOf("-full") == -1) {
                          model[itemId].style.width = $(item).width();
                          model[itemId].style.left = position.left;
                      }
                      model[itemId].style.height = $(item).height();
                      model[itemId].style.top = position.top;
                  }
                  if (model[itemId].location.indexOf("-full") != -1 || !!model[itemId].resizeHandles) {
                      var handles = model[itemId].resizeHandles.split(",");
                      if ($.grep(handles, function (n) { return n.indexOf("e") != -1 || n.indexOf("w") != -1 }).length == 0) {
                          model[itemId].style.width = "auto";
                      }
                      if ($.grep(handles, function (n) { return n.indexOf("n") != -1 || n.indexOf("s") != -1 }).length == 0) {
                          model[itemId].style.height = "auto";
                      }
                  }
              })

              if (elemArr.length == 1) {
                  if($(elemArr[0]).attr("id")){
                      var _id = $(elemArr[0]).attr("id").replace('oper_', '');
                      return model[_id].style;
                  }
              }
          }

          var _showSettingWindow = function () {
              var _target = _clickTarget[0];
              if (!!_target) {
                  var settingTemplateUrl = model[$(_target).children("[id^='control_']").attr("id")].settingTemplateUrl;
                  //如果正常流程没有设置，在组件编辑时也不能设置。
                  if (!!settingTemplateUrl && $scope.editorInfo.type == "component") {
                      settingTemplateUrl = "./../views/common/settingcustomstyle.tpl.html";
                  }
                  if (!!settingTemplateUrl) {
                      $http.get(settingTemplateUrl).success(function (template) {
                          $scope.currentId = $(_target).children("[id^='control_']").attr("id");
                          lanhWindow.create({
                              title: "设置",
                              template: template
                          }, $scope);
                      });
                  }
              }
          }

          //基础样式设置
          var _setControlStyle = function (id, style, controlId) {
              switch (controlId) {
                  case "pageBackground.header":
                      id = "content-header";
                      break;
                  case "pageBackground.body":
                      id = "content-body";
                      break;
                  case "pageBackground.footer":
                      id = "content-footer";
                      break;
                  case "pageBackground.page":
                      id = "content";
                      break;
              }
              if (!!controlId && controlId.indexOf("pageBackground") != -1 && !style) {
                  //$("#" + id).css()
                  var _targetContent = null;
                  switch ($scope.model[controlId].location) {
                      case "header":
                          _targetContent = "content-header";
                          break;
                      case "footer":
                          _targetContent = "content-footer";
                          break;
                      case "body":
                          _targetContent = "content-body";
                          break;
                      default:
                          _targetContent = "content";
                          break;
                  }
                  $("#" + _targetContent).css({
                      "background-color": "",
                      "background-image": "",
                      "background-repeat": "repeat",
                      "background-position": ""
                  });

              } else {
                  if (!style) style = $scope.model[id].style = {};
                  //坐标位置修正
                  if (!!$scope.model[id] && $scope.model[id].location == "body") {
                      if (parseFloat(style["left"]) < 0) style["left"] = 0;
                      if (parseFloat(style["top"]) < 0) style["top"] = 0;
                      var outerRight = parseFloat(style["left"]) + parseFloat(style["width"]) - $scope.pageSize.pageBody.width;
                      if (outerRight > 0) {
                          style["left"] = parseFloat(style["left"]) - outerRight;
                          if (style["left"] < 0) {
                              style["width"] = parseFloat(style["width"]) - style["left"];
                              style["left"] = 0;
                          }
                          $scope.model[id].style = style;
                      }
                  }
                  //自增长z-index
                  if (style["z-index"] == null) {
                      if (!(!!controlId && controlId.indexOf("pageBackground") != -1)) {
                          style["z-index"] = $element.find("[id^='control_']").length;
                      }

                  }
                  for (var name in style) {
                      var $dom = $("#" + id),
                          value = style[name];
                      switch (name) {
                          case "background-image":
                              value = "url(" + style[name] + ")";
                              break;
                          case "width":
                          case "height":
                              if ((id || '').indexOf('control_') >= 0) {//modify by clark 此赋值逻辑只应用于控件类型，否则针对容器（头部、底部）的设置将无法控制
                                  if (name == "width" && $scope.model[id].location.indexOf("-full") != -1) {   //通栏只会把宽度设置为100%;
                                      value = "100%";
                                  } else if (style[name] != "auto") {
                                      value = (parseFloat(style[name]) + 2) + "px";
                                  }
                                  $dom = $("#oper_" + id);
                              }
                              else {
                                  if (id === 'content-header') {
                                      $scope.pageSize.pageHeader.height = value;
                                  }
                                  else if (id === 'content-footer') {
                                      $scope.pageSize.pageFooter.height = value;
                                  }
                              }
                              break;
                          case "border-width":
                          case "border-radius":
                              value = parseFloat(style[name]) + "px";
                              break;
                              //case "opacity":
                              //    value = style[name] / 100;
                              //    break;
                          case "left":
                          case "top":
                              $dom = $("#oper_" + id);
                              if (name == "left" && $scope.model[id].location.indexOf("-full") != -1) {   //通栏只会把left设置为0;
                                  value = "0px";
                              } else {
                                  value = parseFloat(style[name]) + "px";
                              }
                              break;
                          case "z-index":
                              if ($scope.model[id].location.indexOf("-full") != -1) {   //通栏只会把z-index设置为0;
                                  value = 0;
                              }
                              $dom = $("#oper_" + id);
                              break;
                      }
                      $dom.css(name, value);
                  }
              }
              $timeout(function () {
                  //禁用跳转链接
                  $element.find("#" + id + " a").attr("href", "javascript:void(0);");
              });
          }

          var draggableMethod = function (type) {
              return {
                  stop: function (event, ui) {
                      $element.find("#content-header,#content-body,#content-footer").css({ "overflow": "hidden", "z-index": "0" });
                      $(ui.helper).find('a').css({ "cursor": "pointer" });
                      var zIndex = parseFloat(ui.helper.css("z-index")) - 100;
                      ui.helper.css("z-index", zIndex);
                      $timeout(function () {
                          var $json = {};
                          if(Kdo.elementGroup.elementIsGroup(ui.helper) || Kdo.elementGroup.elementIsTempGroup(ui.helper)){
                              $json.id = $(ui.helper).attr("id");
                              $json.isGoup = true;
                          }else{
                              $json.id = $(ui.helper).find("[id^='control_']").attr("id");
                          }
                          _updeteModel1($json);
                          // $.each(ui.helper.find("[id^='control_']"), function (i, el) {
                          //     var id = $(el).attr("id");
                          //     if (!!$scope.model[id]) {
                          //         if (ui.helper.position().top < 0) {
                          //             ui.helper.css("top", 0);
                          //         }
                          //         if (!!$scope.model[id].dragCallback) $(document).trigger($scope.model[id].dragCallback, id);
                          //         // _updateModel(id);
                          //         _updeteModel1({ "id": id });
                          //     }
                          // });
                          //如果改变了区域(比如:body -> header), model会被删除，则不会进入下面的流程，(history会在drop中记录)。
                          if (ui.helper.find("[id^='control_']").length > 0 && !!$scope.model[ui.helper.find("[id^='control_']").attr("id")]) {
                              _showToolbar(_clickTarget);
                              $scope.checkedModuleStyle(_clickTarget);
                              history.log();
                              ui.helper.parents("[id^='content-'].ui-resizable").addClass('selected');
                          } else {
                              _clickTarget = [];
                              _showToolbar(_clickTarget);
                              $scope.checkedModuleStyle(_clickTarget);
                          }
                      });
                      if (!($(ui.helper).hasClass('fullWidth'))) {
                          Kdo.guideLine.hide();/*结束隐藏辅助线*/
                      }
                  },
                  drag: function (event, ui) {
                      $(ui.helper).find('a').css({ "cursor": "move" });
                      var borderWidth = type == "single" ? 2 : 0;
                      if (ui.position.left < 0) {
                          ui.helper.css({ "left": 0 });
                          ui.position.left = 0;
                      } else if ((ui.position.left + ui.helper.width() + borderWidth) > ui.helper.parent().width()) {
                          var left = ui.helper.parent().width() - (ui.helper.width() + borderWidth);
                          ui.helper.css({ "left": left });
                          ui.position.left = left;
                      }
                      _showToolbar(_clickTarget, true);
                      hideModuleTopTip();
                      $scope.checkedModuleStyle(ui.helper);
                      if (!($(ui.helper).hasClass('fullWidth'))) {
                          Kdo.guideLine.show.call(ui.helper, event, ui); /*拖动时显示辅助线*/
                      }
                  },
                  start: function (event, ui) {
                      $element.find("#content-header,#content-body,#content-footer").css({ "overflow": "", "z-index": "0" });
                      $('#content-header,#content-body,#content-footer').removeClass('selected');
                      ui.helper.parents("#content-header,#content-body,#content-footer").css("z-index", "1");
                      var zIndex = parseFloat(ui.helper.css("z-index")) + 100;
                      ui.helper.css("z-index", zIndex);
                      _mouseDraggable = true;
                      _showToolbar(_clickTarget, true);
                      if (!($(ui.helper).hasClass('fullWidth'))) {
                          Kdo.guideLine.init.call(ui.helper, event, ui.offset, '[id^="oper_control_"]');/*拖动时初始化辅助线*/
                      }
                  }
              }
          }

          //注册组合拖动选项
          Kdo.elementGroup.setDraggableOption(draggableMethod("group"));

          var _bindOper = function (id) {

              var $dom = $element.find("#oper_" + id),
                  dragOptions = draggableMethod('single'),
                  handles = $scope.model[id].location.indexOf("-full") != -1 ? "n,s" : $scope.model[id].resizeHandles;;

              // 组合恢复;
              if (Kdo.elementGroup.groupModel) {
                  for (var group in Kdo.elementGroup.groupModel) {
                      if (Kdo.elementGroup.groupModel[group]) {
                          Kdo.elementGroup.groupModel[group]["controls"].forEach(function (g, i) {
                              if (g === id) {
                                  $dom.attr("group", Kdo.elementGroup.groupModel[group]["groupId"]);
                                  $dom.on("mouseenter", function (event) {
                                      Kdo.elementGroup.activeGroup($(this).attr("group"));
                                      console.log(Kdo.elementGroup.currentActiveGroup());
                                  });
                              }
                          });
                      }
                  }
              }

              Kdo.$($dom).draggable({
                  begin: function (event, ui) {
                      dragOptions.start(event, ui);
                  },
                  ing: function (event, ui) {
                      dragOptions.drag(event, ui)
                  },
                  end: function (event, ui) {
                      dragOptions.stop(event, ui)
                  }
              }, true)
                  .resizable({
                      ing: function (event, ui) {
                          resizeShowToolbar();
                          $timeout(function () {
                              _showToolbar(_clickTarget);
                          });
                      },
                      end: function (event, ui) {
                          resizableStop(id);
                          $timeout(function () {
                              _updateModel(id);
                              history.log();
                              _showToolbar(_clickTarget);

                              if (!!$scope.model[id].resizeCallback) {
                                  $(document).trigger('framework.resized.' + id, $scope.model[id]);
                              }
                          });
                      }
                  }, true, false, {
                      containment: "parent",
                      handles: handles || "all",
                  });


              //按下键盘时，如果是按的ctrl就禁止拖动 add by clark
              $(document.body).bind('keydown', function (e) {
                  if (e.ctrlKey === true) {
                      $dom.draggable({ disabled: true });
                  }
              });
              //由于onkeyup的特殊情况，需要是用钩子方法来实现，keydown系统事件需要统一处理，TODO: by clark
              onKeyupHooks.push(function (event) {
                  if (event.ctrlKey === false) {
                      $dom.draggable({ disabled: false });
                  }
              });

              $dom.on("mouseenter", function (e) {
                  $timeout(function () {
                      _mouseEnterTarget = e.currentTarget;
                      if ($(_mouseEnterTarget).hasClass(_focusControlTarget)) {
                          $(_mouseEnterTarget).addClass($scope.$root._attachMouseEvents == "alignSize" ? "hover-target" : "hover");
                      }
                      if (!$(_mouseEnterTarget).hasClass("on")) {
                          $(_mouseEnterTarget).addClass("hover");
                          showModuleTopTip(_mouseEnterTarget);
                      }
                  });
              }).on("mouseleave", function (e) {
                  $timeout(function () {
                      _mouseEnterTarget = null;
                      $element.find("[id^='oper_']").removeClass("hover").removeClass("hover-target");
                      hideModuleTopTip($element.find("[id^='oper_']"));
                  });
              }).on("dblclick", function (e) {
                  _showSettingWindow();
              });
          }

          $scope.pageSize = {
              pageBody: { width: 1200, height: 1500 }
          }

          //create control business logic ( all default controls )
          var createControlsCount = 0, createdControlsCount = 0;
          $scope.$on("framework.createControl", function (e, options, banLog) {
              var _options = angular.copy(options);
              _clickTarget = [];
              createControlsCount += _options.length;
              $.each(_options, function (i, _option) {
                  if (!!_option.controlId && _option.controlId.indexOf("pageBackground") != -1) {
                      $scope.$broadcast("framework.setting.baseStyle", _option, true)
                  } else {
                      var defaultTemplate = _option.defaultTemplate || {};

                      var template = _option.template || {
                          previewImg: defaultTemplate.previewImg || "../../images/no_image_220x220.jpg",
                          html: null,
                          css: null,
                          js: null
                      }

                      if (!_option.template) {
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
                              $http.get(defaultTemplate.js).success(function (result) { template.js = result; });
                          } else {
                              template.js = "";
                          }
                      }
                      var hover = setInterval(function () {
                          $scope.$apply(function () {
                              if (template.html !== null && template.css !== null && template.js !== null) {
                                  clearInterval(hover);
                                  var _tempModelId = "_tempModel_" + utilsService.uniqueId("guid");
                                  $scope[_tempModelId] = $.extend(_option, {
                                      template: template,
                                      _banLog: banLog
                                  });
                                  //build control template to common directive
                                  $compile('<control-manage model="' + _tempModelId + '"></control-manage>')($scope);
                              }
                          });
                      }, 100);
                  }
              });
          });

          //代替事件，避免事件冒泡导致多余的调用。
          $scope.appendToElement = function ($el, tempModelName, isRewrite) {
              $el.css("overflow", "hidden");/*内部元素添加overflow，_$el去掉css overflow*/
              var _$el = $('<div id="oper_' + $el.attr("id") + '" class="ui-widget-content" style="position: absolute; min-width: 6px; min-height: 6px;top:0;left:0;"><span class="module-top-tip"></span></div>').append($el),
                  _targetContent = "content-body-body",
                  _model = isRewrite == true ? $scope.model[$el.attr("id")] : $scope[tempModelName];

              _$el.find("span.module-top-tip").text(_model.name);/*添加模块名称*/

              switch (_model.location) {
                  case "header":
                      _targetContent = "content-header-body";
                      _$el.addClass("realWidth");
                      break;
                  case "header-full":
                      _targetContent = "content-header";
                      _$el.addClass("fullWidth");
                      break;
                  case "footer":
                      _targetContent = "content-footer-body";
                      _$el.addClass("realWidth");
                      break;
                  case "footer-full":
                      _targetContent = "content-footer";
                      _$el.addClass("fullWidth");
                      break;
                  case "body-full":
                      _targetContent = "content-body";
                      _$el.addClass("fullWidth");
                      break;
                  case "body":
                  default:
                      _targetContent = "content-body-body";
                      _$el.addClass("realWidth");
                      break;
              }
              if (isRewrite == true) {
                  $element.find("#" + _targetContent).find("#oper_" + $el.attr("id")).find("#" + $el.attr("id")).html($el.html());
                  _model.style = _updateModel($el.attr("id"), "rewrite");
                  _setControlStyle($el.attr("id"), _model.style);
              } else {
                  $element.find("#" + _targetContent).append(_$el);

                  _model.controlId = $el.attr("id");

                  model[$el.attr("id")] = angular.copy(_model);
                  _bindOper($el.attr("id"));

                  $timeout(function () {
                      var _model2 = model[$el.attr("id")];
                      if (!_model2) return; //回撤太快时，可能会导致元素已被删除
                      //创建新的元素时，计算当前页面显示区域。设置top属性。
                      if (_model2._createNew == true && _model2.location == "body") {
                          // commit by clark 拖动创建元素时，需要根据鼠标的位置开始计算

                          //_model2.style["left"] = 0;

                          //var top = $("body").scrollTop() - $element.find("#content-header-body").height(),
                          //    bodyHeight = $element.find("#content-body-body").height();
                          //if (top + $el.height() > bodyHeight) {
                          //    top = bodyHeight - $el.height();
                          //}
                          //if (!_model2.style) _model2.style = {};
                          //_model2.style["top"] = top;
                      }

                      _setControlStyle($el.attr("id"), _model2.style);

                      if (_model2._createNew == true) {
                          $element.find("#oper_" + _model2.controlId).addClass("new");
                          if (_model2.action == "window") {
                              _clickTarget = $element.find("#oper_" + _model2.controlId);
                              _showSettingWindow();
                          }
                      }

                      if (!!_model2._selected) {
                          _$el.addClass("on");
                          _clickTarget.push(_$el[0]);
                      }
                      createdControlsCount++;

                      if (createControlsCount == createdControlsCount) {

                          if (_reloadPageJSON) {
                              history.reload($scope.model);
                          }
                          else if (!_model2._banLog) {
                              history.log()
                          }
                          //clear
                          createControlsCount = 0;
                          createdControlsCount = 0;
                          _reloadPageJSON = false;
                          _unlockControls();
                      }

                      if (_model._copy) {/*copy 新添加module 选中状态  lilingna*/
                          $element.find("[id^='oper_']").removeClass("on");
                          _$el.addClass("on");
                          _clickTarget = _$el;
                      }

                      delete model[$el.attr("id")]._createNew;
                      delete model[$el.attr("id")]._banLog;
                      delete model[$el.attr("id")]._selected;
                      delete model[$el.attr("id")]._copy;

                      $scope.$root.$broadcast("framework.header.model.savedlog", $scope.model);
                      _showToolbar(_clickTarget);
                      $scope.checkedModuleStyle(_clickTarget);
                  });
              }
          }

          //create control business logic ( all setting controls )
          $scope.$on("framework.createControl.setting", function (e, options) {
              var _option = angular.copy(options[0]);
              if (!model[_option.controlId]) model[_option.controlId] = _option;
              if (_option._createNew) {
                  $http.get(_option.settingTemplateUrl)
                      .success(function (template) {
                          $scope.currentId = _option.controlId;
                          lanhWindow.create({
                              title: _option.name,
                              template: template
                          }, $scope);
                      });
              } else {
                  $scope.$broadcast("framework.setting.baseStyle", _option, true);
                  delete model[_option.controlId]._createNew;
              }
          });

          $scope.$on("framework.createControl.select", function (e, options) {
              $http.get(options[0].settingTemplateUrl)
              .success(function (template) {
                  lanhWindow.create({
                      title: options[0].name,
                      template: template
                  }, $scope);
              });
          });

          //global control toolbar events
          $scope.$on("framework.control.toolbar.events", function (e, action) {
              var id = $(_clickTarget).find("[id^='control_']").attr("id");
              switch (action) {
                  case "lock":
                      var _businessLogic = function (target, locked) {
                          var _id = $(target).find("[id^='control_']").attr("id");
                          model[_id].locked = !locked;
                          if (model[_id].locked) {
                              $(target).attr("data-locked", "true");
                          } else {
                              $(target).attr("data-locked", "");
                          }
                          $(target).draggable({
                              disabled: model[_id].locked
                          }).resizable({
                              disabled: model[_id].locked
                          });
                      }
                      var locked = null;
                      $.each(_clickTarget, function (i, target) {
                          if (i == 0) {
                              locked = model[$(target).find("[id^='control_']").attr("id")].locked;
                          }
                          _businessLogic(target, locked);
                      });
                      history.log();
                      break;
                  case "setting":
                      _showSettingWindow();
                      break;
                  case "style":
                      $http.get("./../views/common/settingbasestyle.tpl.html")
                          .success(function (template) {
                              $scope.currentId = model[id].controlId;
                              lanhWindow.create({
                                  title: "模块样式",
                                  template: template
                              }, $scope);
                          });
                      break;
                  case "scale":
                      {
                          var currentDom = $('#' + id),
                              imgItem = currentDom.find('img'),
                              imgUrl = imgItem.attr('src');

                          if (imgItem.length > 0 && !!imgUrl && imgUrl.indexOf('no_image') < 0) {
                              var newImg = new Image();
                              newImg.src = imgUrl;
                              newImg.onload = function () {
                                  var containerWidth = $(_clickTarget).parent().width(),
                                      containerHeight = $(_clickTarget).parent().height(),
                                      imageWidth = newImg.width,
                                      imageHeight = newImg.height,
                                      currentWidth = $(_clickTarget).width(),
                                      currentHeight = $(_clickTarget).height(),
                                      currentLeft = parseInt($(_clickTarget).css('left')),
                                      currentTop = parseInt($(_clickTarget).css('top')),
                                      finalStyle = {
                                          width: Math.min(imageWidth, containerWidth),
                                          height: Math.min(imageHeight, containerHeight),
                                          left: Math.max(currentLeft - (imageWidth - currentWidth), 0),
                                          top: Math.max(currentTop - (imageHeight - currentHeight), 0)
                                      };
                                  //图片超过containerWidth时失真
                                  if (finalStyle.width == containerWidth) {
                                      $(_clickTarget).width(finalStyle.width);
                                      $(_clickTarget).height((containerWidth * imageHeight / imageWidth));
                                  } else {
                                      $(_clickTarget).width(finalStyle.width);
                                      $(_clickTarget).height(finalStyle.height);
                                  }
                                  //放大后如果超过拖动区域宽度则重置X
                                  if (currentLeft + imageWidth > containerWidth) {
                                      $(_clickTarget).css({ left: finalStyle.left });
                                  }
                                  //放大后如果超过拖动区域高度则重置Y
                                  if (currentTop + imageHeight > containerHeight) {
                                      $(_clickTarget).css({ top: finalStyle.top });
                                  }
                                  _showToolbar(_clickTarget);
                                  $scope.checkedModuleStyle(_clickTarget);
                                  _updateModel(id);
                                  history.log();
                              }
                          }
                      }
                      break;
                  case "createStyle":
                      $http.get("./../views/templates/framework-style-create.tpl.html")
                        .success(function (template) {
                            lanhWindow.create({
                                title: "上传样式",
                                template: template
                            }, $scope);
                        });
                      break;
                  case "createComponent":
                      $http.get("./../views/templates/framework-component-create.tpl.html")
                        .success(function (template) {
                            lanhWindow.create({
                                title: "上传组件",
                                template: template
                            }, $scope);
                        });
                      break;
                  case "copy":
                      keyboardFeature.copy(_clickTarget);
                      break;
                  case "patse":
                      keyboardFeature.paste();
                      break;
                  case "copyPatse":
                      keyboardFeature.copyPatse(_clickTarget);
                      break;
                  case "fullWidth": //通栏
                      var _id = $(_clickTarget).find("[id^='control_']").attr("id"),
                          _model = $scope.model[_id];
                      if (_model.location.indexOf("-full") == -1) {
                          _model.location = _model.location + "-full";
                          //_model.resizeHandles = "n,s";
                      } else {
                          _model.location = _model.location.replace("-full", "");
                          //delete _model.resizeHandles;
                      }
                      $(_clickTarget).remove();
                      $scope.$broadcast("framework.createControl", [_model]);
                      history.log();
                      break;
                  case "indexUp":
                      var _id = $(_clickTarget).find("[id^='control_']").attr("id"),
                          array = [];
                      for (var key in $scope.model) {
                          if (key.indexOf("control_") != -1) {
                              var style = $scope.model[key]["style"];
                              if (!!style && style["z-index"] > $scope.model[_id]["style"]["z-index"]) {
                                  array.push($scope.model[key]);
                              }
                          }
                      }
                      if (array.length > 0) {
                          array.sort(function (item1, item2) { return item1["style"]["z-index"] > item2["style"]["z-index"] });
                          var targetKey = array[0].controlId,
                              tempIndex = $scope.model[targetKey]["style"]["z-index"];
                          $scope.model[targetKey]["style"]["z-index"] = $scope.model[_id]["style"]["z-index"];
                          $scope.model[_id]["style"]["z-index"] = tempIndex;
                          _setControlStyle(targetKey, $scope.model[targetKey]["style"]);
                          _setControlStyle(_id, $scope.model[_id]["style"]);
                          history.log();
                      }
                      break;
                  case "indexDown":
                      var _id = $(_clickTarget).find("[id^='control_']").attr("id"),
                          array = [];
                      for (var key in $scope.model) {
                          if (key.indexOf("control_") != -1) {
                              var style = $scope.model[key]["style"];
                              if (!!style && style["z-index"] < $scope.model[_id]["style"]["z-index"]) {
                                  array.push($scope.model[key]);
                              }
                          }
                      }
                      if (array.length > 0) {
                          array.sort(function (item1, item2) { return item1["style"]["z-index"] < item2["style"]["z-index"] });
                          var targetKey = array[0].controlId,
                              tempIndex = $scope.model[targetKey]["style"]["z-index"];
                          $scope.model[targetKey]["style"]["z-index"] = $scope.model[_id]["style"]["z-index"];
                          $scope.model[_id]["style"]["z-index"] = tempIndex;
                          _setControlStyle(targetKey, $scope.model[targetKey]["style"]);
                          _setControlStyle(_id, $scope.model[_id]["style"]);
                          history.log();
                      }
                      break;
                  case "indexTop":
                      var _id = $(_clickTarget).find("[id^='control_']").attr("id"),
                          index = 0;
                      $.each($scope.model, function (i, _model) {
                          if (!!_model.style && !!_model.style["z-index"]) {
                              index = Math.max(index, _model.style["z-index"]);
                          }
                      });
                      for (var key in $scope.model) {
                          if (key.indexOf("control_") != -1) {
                              var style = $scope.model[key]["style"];
                              if (!!style && style["z-index"] > $scope.model[_id]["style"]["z-index"]) {
                                  $scope.model[key]["style"]["z-index"] = parseFloat(style["z-index"]) - 1;
                                  _setControlStyle(key, $scope.model[key]["style"]);
                              }
                          }
                      }
                      $scope.model[_id]["style"]["z-index"] = index;
                      _setControlStyle(_id, $scope.model[_id]["style"]);
                      history.log();
                      break;
                  case "indexBottom":
                      var _id = $(_clickTarget).find("[id^='control_']").attr("id"),
                          index = 1;
                      for (var key in $scope.model) {
                          if (key.indexOf("control_") != -1) {
                              var style = $scope.model[key]["style"];
                              $scope.model[key]["style"]["z-index"] = parseFloat(style["z-index"]) + 1;
                              _setControlStyle(key, $scope.model[key]["style"]);
                          }
                      }
                      $scope.model[_id]["style"]["z-index"] = index;
                      _setControlStyle(_id, $scope.model[_id]["style"]);
                      history.log();
                      break;
                  case "delete":
                      $scope.updateModelZIndex(_clickTarget);
                      keyboardFeature.del(_clickTarget);
                      $element.find("[id^='oper_']").removeClass("on");
                      _mouseEnterTarget = null;
                      _clickTarget = [];
                      _showToolbar(null);
                      break;
                  case "settingHeader":
                      $scope.$root.$broadcast('framework.attachControl', [{ key: 'setting_header', controlId: "pageBackground.header", location: 'header', '_createNew': true }]);
                      history.log();
                      break;
                  case "settingFooter":
                      $scope.$root.$broadcast('framework.attachControl', [{ key: 'setting_footer', controlId: "pageBackground.footer", location: 'footer', '_createNew': true }]);
                      history.log();
                      break;
                  case "settingBody":
                      $scope.$root.$broadcast('framework.attachControl', [{ key: 'setting_body', controlId: "pageBackground.body", location: 'body', '_createNew': true }]);
                      history.log();
                      break;
                  case "settingPage":
                      $scope.$root.$broadcast('framework.attachControl', [{ key: 'setting_backgroud', controlId: "pageBackground.page", location: 'page', '_createNew': true }]);
                      history.log();
                      break;
                  case "group":
                      Kdo.elementGroup.createGroup();
                      history.log();
                      break;
              }
              $scope.$emit("framework.control.toolbar.get", [model[id]]);
          });

          //快捷键创建组合
          $scope.$on("framework.createGroup", function (e, target) {
              Kdo.elementGroup.createGroup();
              history.log();
          });

          //global align events
          $scope.$on("framework.feature.align", function (e, type) {
              if (!!_clickTarget) {
                  var target = _clickTarget;
                  switch (type) {
                      case "top":
                          alignService.top(target);
                          break;
                      case "middle": //上下居中(单) 或 页面居中(多)
                          if (target.length == 1) {
                              alignService.pageMiddle(target);
                          } else {
                              alignService.middle(target);
                          }
                          break;
                      case "left":
                          alignService.left(target);
                          break;
                      case "center": //左右居中(单) 或 页面居中(多)
                          if (target.length == 1) {
                              alignService.pageCenter(target);
                          } else {
                              alignService.center(target);
                          }
                          break;
                      case "bottom":
                          alignService.bottom(target);
                          break;
                      case "right":
                          alignService.right(target);
                          break;
                  }
                  if (target.length == 1) {
                      _showToolbar(target);
                      $scope.checkedModuleStyle(_clickTarget);
                  }
              }
          });

          $scope.$on("framework.feature.alignSize", function (e, target) {
              //var $oper = $(target).parents("[id^='oper_']");
              if (!!_mouseEnterTarget && $(_mouseEnterTarget).hasClass(_focusControlTarget) && _clickTarget.length >= 1) {
                  var targetId = $(_mouseEnterTarget).find("[id^='control_']").attr("id"),
                      sourceModel = $scope.model[targetId],
                      sourceStyle = angular.copy(sourceModel.style),
                      isChanged = false;

                  $.each(_clickTarget, function (i, el) {
                      var _id = $(el).find("[id^='control_']").attr("id"),
                          targetModel = $scope.model[_id];
                      if (targetModel.locked != true) {
                          if (targetModel.style.width != sourceStyle.width ||
                              targetModel.style.height != sourceStyle.height) {
                              targetModel.style.width = sourceStyle.width;
                              targetModel.style.height = sourceStyle.height;
                              if (targetModel.style.left + targetModel.style.width > $(el).parent().width()) {
                                  targetModel.style.left = $(el).parent().width() - targetModel.style.width;
                              }
                              _setControlStyle(_id, targetModel.style);
                              $scope.model[_id].style = $.extend($scope.model[_id].style, targetModel.style);
                              //同步大小之后需要重新触发一下对应控件的设置事件 modify by clark
                              $scope.$root.$broadcast('framework.setting.reload.template.' + _id, targetModel);
                              isChanged = true;
                          }
                      }
                  });
                  if (isChanged) {
                      history.log();
                  }
              }
          });

          $scope.$on("framework.setting.baseStyle", function (e, _model, banLog) {
              var _model = model[_model.controlId] = angular.copy(_model),
                  $el = null;

              if (_model.controlId.indexOf("pageBackground") != -1) {
                  switch (_model.location) {
                      case "header":
                          $el = $element.find("#content-header");
                          break;
                      case "footer":
                          $el = $element.find("#content-footer");
                          break;
                      case "body":
                          $el = $element.find("#content-body");
                      default:
                          $el = $element;
                          break;
                  }
              } else {
                  $el = $element.find("#" + _model.controlId);
              }
              _setControlStyle($el.attr("id"), _model.style, _model.controlId);

              if (!banLog) {
                  history.log();
              }
          });

          /*删除元素时更新页面model*/
          $scope.updateModelZIndex = function (_clickTarget) {
              var _id = [];
              $.each(_clickTarget, function (i, _model) {
                  _id.push($(_model).find("[id^='control_']").attr("id"));
              });

              for (var key in $scope.model) {
                  if (key.indexOf("control_") != -1) {
                      var style = $scope.model[key]["style"];
                      $.each(_id, function (i, val) {
                          if (!!style && style["z-index"] > $scope.model[val]["style"]["z-index"]) {
                              $scope.model[key]["style"]["z-index"] = parseFloat(style["z-index"]) - 1;
                              _setControlStyle(key, $scope.model[key]["style"]);
                          }
                      });
                      
                  }
              }
          }

          /***************global control toolbar coordinates start*************/
          /*模块顶部工具条*/
          var _showToolbar = function (attachTarget, draggle) {
              //global control toolbar
              var $toolbar = $(".lanh-control-toolbar");
              $toolbar.removeClass("on");
              $(".ui-widget-content .ui-resizable-handle").hide();

              //fix by clark：Crtl多选时，attachTarget不是数组对象，而是一个特殊数组对象
              var _models = [];
              if (angular.isArray(attachTarget) || (attachTarget && attachTarget.length > 1)) {
                  for (var i = 0, ii = attachTarget.length; i < ii; i++) {
                      var el = attachTarget[i];
                      _models.push(model[$(el).find("[id^='control_']").attr("id")]);
                  }
              } else {
                  $.each($(attachTarget).find("[id^='control_']"), function (i, el) {
                      _models.push(model[$(el).attr("id")]);
                  });
              }

              $scope.$emit("framework.control.toolbar.get", _models);

              if ($(attachTarget).length != 0 && $(attachTarget).length <= 1 && _models[0]) {
                  $toolbar.addClass("on");
                  $(attachTarget).find(".ui-resizable-handle").show();
                  var position = $(attachTarget).offset();
                  var top = position.top - $toolbar.height() - 5;
                  var _top = _models[0].style.top;
                  if (_top <= $toolbar.height())
                      top = top + _models[0].style.height + $toolbar.height() + 10;
                  $toolbar.css({
                      "left": position.left,
                      "top": top
                  });


                  if (draggle) {/*拖动的特殊情况*/
                          $(".lanh-control-toolbar .lanh-control-toolbar-position.position").show();
                          $(".lanh-control-toolbar .lanh-control-toolbar-position.text").hide();
                          $(".lanh-control-toolbar .lanh-control-toolbar-setting").hide();
                  } else {
                      $(".lanh-control-toolbar .lanh-control-toolbar-position.position").hide();
                      if (!!attachTarget && $(attachTarget).find("span.module-top-tip").text() === "文字") {
                          $(".lanh-control-toolbar .lanh-control-toolbar-position.text").show();
                          $(".lanh-control-toolbar .lanh-control-toolbar-setting").hide();
                      } else if (!Kdo.elementGroup.elementIsTempGroup(attachTarget)) {/*框选拖动 lilingna*/
                          $(".lanh-control-toolbar .lanh-control-toolbar-setting").show();
                          $(".lanh-control-toolbar .lanh-control-toolbar-position.text").hide();
                      }
                  }
              }
          }


          function resizeShowToolbar() {
              $timeout(function () {
                  /*_showToolbar(_clickTarget);*/
                  $scope.checkedModuleStyle(_clickTarget);
              });
          }

          function resizableStop(id) {
              $timeout(function () {
                  _updateModel(id);
                  history.log();
                  /*_showToolbar(_clickTarget);*/
                  $scope.checkedModuleStyle(_clickTarget);

                  if (!!$scope.model[id].resizeCallback) {
                      $(document).trigger('framework.resized.' + id, $scope.model[id]);
                  }
              });
          }

          $scope.$on("framework.control.toolbar.coordinates", function (e, action, value) {
              var targetParent = $(_clickTarget).parent();
              var isTemporaryGroup = ((targetParent.attr("id").indexOf("oper_selectedPanel") != -1) || (targetParent.parent().attr("id").indexOf("oper_selectedPanel") != -1)) ? true : false;
              var isGroupObj = (targetParent.attr("id").indexOf("oper_group_") != -1) ? true : false;
              if (isTemporaryGroup == true) {
                  var parentObj = (targetParent.parent().attr("id").indexOf("oper_selectedPanel") != -1) ? targetParent.parent() : targetParent;
              } else {
                  var parentObj = isGroupObj ? targetParent : null;
              }
              $(".lanh-control-toolbar").removeClass("on");
              switch (action) {
                  case "X":
                      if (isTemporaryGroup || isGroupObj) {
                          parentObj.css({
                              left: value.left + "px"
                          })
                      } else {
                          var _id = $(_clickTarget).find("[id^='control_']").attr("id");
                          if (!!_id && value.left !== "" && parseInt(value.left) >= 0) {
                              $scope.model[_id]["style"]["left"] = parseFloat(value.left);
                              _setControlStyle(_id, $scope.model[_id]["style"]);
                              history.log();
                          }
                      }
                      break;
                  case "Y":
                      if (isTemporaryGroup || isGroupObj) {
                          parentObj.css({
                              top: value.top + "px"
                          })
                      } else {
                          var _id = $(_clickTarget).find("[id^='control_']").attr("id");
                          if (!!_id && value.top !== "" && parseInt(value.top) >= 0) {
                              $scope.model[_id]["style"]["top"] = value.top;
                              _setControlStyle(_id, $scope.model[_id]["style"]);
                              history.log();
                          }
                      }
                      break;
                  case "width":
                      if (isTemporaryGroup || isGroupObj) {
                          getOriginData({ id: parentObj.attr("id") });
                          parentObj.css({
                              width: value.width + "px"
                          });
                          updateDate({ id: parentObj.attr("id") });
                          elemArr = [];
                      } else {
                          var _id = $(_clickTarget).find("[id^='control_']").attr("id");
                          var parentWidth = parseInt($("#content-body").width()) - parseInt(value.left);
                          if (!!_id && value.width !== "") {
                              if (parseInt(value.width) > parseInt(parentWidth) + 2) {
                                  $scope.model[_id]["style"]["width"] = (parentWidth - 2);
                              } else {
                                  $scope.model[_id]["style"]["width"] = value.width;
                              }
                              _setControlStyle(_id, $scope.model[_id]["style"]);
                              history.log();
                          }
                      }
                      break;
                  case "height":
                      if (isTemporaryGroup || isGroupObj) {
                          getOriginData({ id: parentObj.attr("id") });
                          parentObj.css({
                              height: value.height + "px"
                          });
                          updateDate({ id: parentObj.attr("id") });
                          elemArr = [];
                      } else {
                          var _id = $(_clickTarget).find("[id^='control_']").attr("id");
                          var parentHeight = parseInt($("#content-body").height()) - parseInt(value.top);
                          if (!!_id && value.height !== "") {
                              if (parseInt(value.height) > parseInt(parentHeight) + 2) {
                                  $scope.model[_id]["style"]["height"] = (parentHeight - 2);
                              } else {
                                  $scope.model[_id]["style"]["height"] = value.height;
                              }
                              _setControlStyle(_id, $scope.model[_id]["style"]);
                              history.log();
                          }
                      }
                      break;
              }
          });
          /***************global control toolbar coordinates end*************/
          //隐藏模块提示
          function hideModuleTopTip($element) {
              var topTip = $($element).find("span.module-top-tip");
              if (topTip.length > 0)
                  topTip.hide()
          }

          //显示模块提示
          function showModuleTopTip($element) {
              var topTip = $($element).find("span.module-top-tip");
              if (topTip.length > 0)
                  topTip.show();
          }

          /*获取module的style，并且设置配置条的状态 start*/
          $scope.checkedModuleStyle = function (_mouseEnterTarget) {
              $timeout(function () {
                  if (!!_mouseEnterTarget && _mouseEnterTarget.length > 0) {
                      if ($(".module-configuration").is(":hidden")) {
                          $(".module-configuration").css({
                              right: "15%",
                              top: "15%",
                              left: "auto"
                          });
                      }
                      var style = {
                          left: !!_mouseEnterTarget[0].style.left ? parseInt(_mouseEnterTarget[0].style.left) : 0,
                          top: !!_mouseEnterTarget[0].style.top ? parseInt(_mouseEnterTarget[0].style.top) : 0,
                          width: parseInt(_mouseEnterTarget[0].style.width) - 2,
                          height: parseInt(_mouseEnterTarget[0].style.height) - 2
                      }
                      $scope.$root.$broadcast("framework.control.toolbar.coordinates.style", style);
                  }
              });
          }
          /*获取module的style，并且设置配置条的状态 end*/

          /***************pageData start*************/
          var _getPageJson = function (type) {
              var _model = angular.copy($scope.model);
              var _result = null;
              if (type == "web") {
                  var pageName = $scope.currentPage.key;
                  if (!$scope.currentPage.single) {
                      var aliasName = $scope.currentPage.alias;
                      if (!aliasName) {
                          aliasName = pageName.substring(0, pageName.indexOf('_'));
                      }
                      pageName = pageName.substring(0, pageName.lastIndexOf(aliasName));
                  }

                  var turnedOptions = angular.extend({
                      turnedPurchase: 'false',
                      turnedOrder: 'false',
                      turnedArticleComments: 'false',
                      turnedJobApplication: 'false'
                  }, $scope.turnedOptions);

                  _result = {
                      PageID: $scope.currentPage.alias,
                      TemplateId: $scope.editorInfo.id,
                      PageName: pageName,
                      PageTitle: $scope.currentPage.text,
                      PageType: "Web",
                      PageGuid: $scope.pageGuid,
                      PageSize: $scope.pageSize,
                      Single: $scope.currentPage.single,
                      SEO: $scope.seo,
                      TurnedOptions: turnedOptions,
                      Controls: []
                  }
                  //如果保存的是明细页面，则重新设置body的高度                  
                  if ((_result.PageName || '').indexOf('_detail') > 0) {
                      var contentHeight = $('#content-body').height();
                      _result.PageSize.pageBody['min-height'] = contentHeight + 'px';
                      _result.PageSize.pageBody.height = "auto";
                  }

              } else if (type == "component") {
                  _result = {
                      ComponentId: $scope.editorInfo.id,
                      PageType: "Component",
                      PageSize: $scope.pageSize,
                      Controls: []
                  }
              }
              if (!!_result) {
                  for (var _controlId in _model) {
                      _result.Controls.push({
                          locked: _model[_controlId].locked,
                          key: _model[_controlId].key,
                          controlId: _model[_controlId].controlId,
                          location: _model[_controlId].location,
                          template: _model[_controlId].template,
                          style: _model[_controlId].style,
                          data: _model[_controlId].data
                      });
                  }
              }

              //组合
              _result.Groups = [];

              var _groupModel = angular.copy(Kdo.elementGroup.groupModel);
              if (_groupModel) {
                  for (var _groupId in _groupModel) {
                      _result.Groups.push(_groupModel[_groupId]);
                  }
              }
              return _result;
          }

          var _reloadPageJSON = false;
          var _togglePageDoms = function (page, data) {
              var detailControl = null;
              switch (page) {
                  case "download_detail":
                  case "article_detail":
                  case "job_detail":
                  case "news_detail":
                  case "product_detail":
                  case "goods_detail":
                  case "fulltextresult":
                      detailControl = frameworkLeftMenuService.getMenuInfo("controls_" + page);
                      break;
              }
              if (!!data) {
                  $scope.seo = data.seo;
                  if (!data.controls) data.controls = [];
              } else {
                  data = {
                      controls: []
                  }
              }
              if (!!detailControl) {
                  if ($.grep(data.controls, function (n) { return n.key == detailControl.key }).length == 0) {
                      data.controls.push(detailControl);
                  }
              }
              $.each(data.controls, function (i, control) {
                  control._banLog = true;
              });
              _reloadPageJSON = true;
              $scope.$root.$broadcast("framework.attachControl", data.controls);
          }


          $scope.$on("framework.header.event.save", function (e, callback, state) {
              var reCallback = callback;
              callback = function (result) {
                  if (!state) {
                      if (result.code == "200") {
                          $scope.pageGuid = result.dataObject.pageGuid;
                          messengerService.success(result.message);
                          $scope.$root.$broadcast("framework.header.model.savedlog", $scope.model);
                      } else {
                          messengerService.error(result.message);
                      }
                  }
                  if (reCallback && typeof reCallback === 'function') reCallback(result);
              }
              if ($scope.editorInfo.type == "web") pageService.savePage(_getPageJson($scope.editorInfo.type), state, callback);
              if ($scope.editorInfo.type == "component") componentService.createComponentJSON(_getPageJson($scope.editorInfo.type), state, callback);
          });

          $scope.$on("framework.header.event.preview", function (e) {
              pageService.preview(_getPageJson($scope.editorInfo.type), function (result) {
                  window.open(result.previewUrl)
              });
          });

          $scope.$on("framework.header.event.release", function (e) {
              pageService.release("Web", function (result) {
                  window.open(result.visitUrl)
              });
          });

          $scope.$on("framework.setting.seo", function (e, data) {
              $scope.seo = data.seo;
          })

          $scope.$on("framework.style.create", function (e, data) {
              var id = $(_clickTarget).find("[id^='control']").attr("id"),
                  _model = $scope.model[id];
              var _data = {
                  title: data.title,
                  moduleType: _model.key,
                  moduleName: _model.name,
                  //creator: loginService.getLoginInfo().userName,
                  isDelete:false,
                   webType: loginService.getPlatformType(),
                  imgStream: data.previewImg,
                  imgSuffix: data.imgSuffix,
                  files: []
              };
              for (var property in _model.template) {
                  switch (property) {
                      case "html":
                      case "css":
                      case "js":
                          _data.files.push({
                              fileName: "style",
                              fileSuffix: property,
                              context: _model.template[property]
                          });
                          break;
                  }
              }
              //call api save style files;
              styleService.uploadStyle(_data, function (result) {
                  if (result.code == "200") {
                      messengerService.success("成功上传样式，请等待审核通过。");
                  } else {
                      messengerService.error(result.message);
                  }
              });
          });

          $scope.$on("framework.component.create", function (e, data) {
              var _data = _getPageJson("component");
              _data.ComponentId = null;
              _data.PageSize = { pageBody: _data.PageSize.pageBody }
              _data.Controls = [];
              $(_clickTarget).each(function (i, el) {
                  var _model = angular.copy($scope.model[$(el).find("[id^='control']").attr("id")]),
                      _info = frameworkLeftMenuService.getMenuInfo(_model.key);
                  //还原data对象
                  _model.data = _info.data;
                  _model.location = "body";
                  _data.Controls.push(_model);
              });
              //创建保存组件信息和组件内容。
              componentService.uploadComponent({
                  title: data.title,
                  type: "Web",
                  description: data.description,
                  imgStream: data.previewImg,
                  imgSuffix: data.imgSuffix,
                  componentPage: _data
              }, function (result) {
                  if (result.code == "200") {
                      messengerService.success("成功上传组件，请等待审核通过。");
                  } else {
                      messengerService.error(result.message);
                  }
              });
          });

          $scope.$on("framework.editor.component.select", function (e, componentId) {
              componentService.getComponentJSON(componentId, function (result) {
                  if (!!result.dataObject) {
                      var controls = result.dataObject.controls;
                      $.each(controls, function (i, control) {
                          //control._banLog = controls.length - 1 != i;
                          control.controlId = null;
                          control._selected = true;
                      });
                      $element.find("[id^='oper_']").removeClass("on");
                      _clickTarget = [];

                      $scope.$root.$broadcast("framework.attachControl", controls);
                  }
              });
          });

          $scope.$on("framework.header.event.togglepage", function (e, page) {
              //clear
              model = $scope.model = {};
              $scope.$root.$broadcast("framework.header.model.savedlog", $scope.model);
              $element.find("[id^='oper_']").remove();
              $element.attr("style", null);
              history.clear();

              //get 
              $scope.currentPage = page;
              // modify by clark ：临时保存逻辑修改
              pageService.getState($scope.editorInfo.id, $scope.currentPage.key, "Web", function (result) {
                  if (result.isTemporary === true) {
                      var dateString = $filter('date')(result.temopraryCreateTime, 'yyyy-MM-dd HH:mm:ss');
                      messengerService.confirm('发现临时保存文件' + dateString + ',是否替换?', function (confirm) {
                          getPagesData(confirm);
                      }, $scope);
                  } else {
                      getPagesData(false);
                  }
              });

              function getPagesData(isTemporary) {
                  pageService.getPage($scope.editorInfo.id, $scope.currentPage.key, "Web", isTemporary, function (result) {
                      if (!!result.dataObject) {
                          $scope.pageGuid = result.dataObject.pageGuid;
                          $scope.pageSize = {
                              pageHeader: { width: 1200, height: 200 },
                              pageBody: { width: 1200, height: 1500 },
                              pageFooter: { width: 1200, height: 200 }
                          }
                          if (!!result.dataObject.pageSize) {
                              var pageSize = result.dataObject.pageSize;
                              if (!!pageSize.pageHeader) {
                                  if (!!pageSize.pageHeader.width) $scope.pageSize.pageHeader.width = pageSize.pageHeader.width;
                                  if (!!pageSize.pageHeader.height) $scope.pageSize.pageHeader.height = pageSize.pageHeader.height;
                              }
                              if (!!pageSize.pageBody) {
                                  if (!!pageSize.pageBody.width) $scope.pageSize.pageBody.width = pageSize.pageBody.width;
                                  if (!!pageSize.pageBody.height) {
                                      if (pageSize.pageBody.height != 'auto')
                                          $scope.pageSize.pageBody.height = pageSize.pageBody.height;
                                      else $scope.pageSize.pageBody.height = pageSize.pageBody['min-height'];
                                  }
                              }
                              if (!!pageSize.pageFooter) {
                                  if (!!pageSize.pageFooter.width) $scope.pageSize.pageFooter.width = pageSize.pageFooter.width;
                                  if (!!pageSize.pageFooter.height) $scope.pageSize.pageFooter.height = pageSize.pageFooter.height;
                              }
                          }

                          if (!!result.dataObject.groups && result.dataObject.groups.length > 0) {
                              $timeout(function () {
                                  var _groupModel = angular.copy(result.dataObject.groups);
                                  $.each(_groupModel,function(index,item){
                                      var $json = {"groupId":item.groupId,"controls":item.controls}
                                      Kdo.elementGroup.groupModel.push($json);
                                  });
                              });
                          }

                          if ($scope.turnedOptions !== undefined) {
                              $scope.turnedOptions = angular.extend(result.dataObject.turnedOptions || {}, $scope.turnedOptions); //全局设置赋值 add by clark
                          }
                          else {
                              $scope.turnedOptions = result.dataObject.turnedOptions;
                          }
                          $element.find("#content-header-body").width($scope.pageSize.pageHeader.width);
                          $element.find("#content-header").height($scope.pageSize.pageHeader.height);
                          $element.find("#content-body-body").width($scope.pageSize.pageBody.width);
                          $element.find("#content-body").height($scope.pageSize.pageBody.height);
                          $element.find("#content-footer-body").width($scope.pageSize.pageFooter.width);
                          $element.find("#content-footer").height($scope.pageSize.pageFooter.height);
                      }
                      var pageKey = $scope.currentPage.key;
                      if (!$scope.currentPage.single) {
                          var aliasName = $scope.currentPage.alias;
                          if (!aliasName) {
                              aliasName = pageKey.substring(0, pageKey.indexOf('_'));
                          }
                          pageKey = pageKey.substring(0, pageKey.lastIndexOf(aliasName));
                      }
                      _togglePageDoms(pageKey, result.dataObject);
                  });
              }
          });

          $scope.$on("framework.editor.model.get", function (e, callback) {
              callback($scope.model);
          });

          if ($scope.editorInfo.type == "component") {
              componentService.getComponentJSON($scope.editorInfo.id, function (result) {
                  if (!!result.dataObject) {
                      $scope.$root.$broadcast("framework.attachControl", result.dataObject.controls);
                  }
              });
          }
          /***************pageEnd start*************/
      }
  ]);
