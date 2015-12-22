'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.keyboardFeature
 * @description
 * # keyboardFeature
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('keyboardFeature', ["history",
      function (history) {
          // AngularJS will instantiate a singleton by calling "new" on this function
          
          var self = this;
          self.keys = {
              //13: "回车",       //回车
              //17: "ctrl",       //ctrl
              37: "left",       //小键盘左
              38: "top",        //小键盘上
              39: "right",      //小键盘右
              40: "down",       //小键盘下
              67: "c",          //c
              86: "v",          //v
              90: "z",          //z
              89: "y",          //y
              46: "del"         //del
          }

          self.keydownKeys = {
              37: "left",       //小键盘左
              38: "top",        //小键盘上
              39: "right",      //小键盘右
              40: "down"        //小键盘下
          }

          self.keyupKeys = {
              67: "c",          //c
              86: "v",          //v
              90: "z",          //z
              89: "y",          //y
              46: "del"         //del
          }

          var _position = function (keyCode, target) {
              var isSuccess = false;
              $.each(target, function (i, el) {
                  var offset = $(el).offset(),
                      position = $(el).position(),
                      parentoffset = $(el).parent().offset();

                  switch (keyCode) {
                      case 37:
                          position.left = position.left - 1;
                          offset.left = offset.left - 1;
                          break;
                      case 38:
                          position.top = position.top - 1;
                          offset.top = offset.top - 1;
                          break;
                      case 39:
                          position.left = position.left + 1;
                          offset.left = offset.left + 1;
                          break;
                      case 40:
                          position.top = position.top + 1;
                          offset.top = offset.top + 1;
                          break;
                  }

                  if (offset.top >= parentoffset.top &&     //top border
                      offset.left > parentoffset.left &&   //left border
                      (offset.left + $(el).width() + 2) < (parentoffset.left + $(el).parent().width()) &&  //right border
                      (offset.top + $(el).height() + 3) < (parentoffset.top + $(el).parent().height())) {   //bottom border
                      $(el).css({
                          "top": position.top,
                          "left": position.left
                      });
                      isSuccess = true;
                  }
              });
              return isSuccess;
          }

          self.copy = function (target) {
              self.$scope.$root.copyCache = [];
              $.each(target, function (i, el) {
                  var copyCache = angular.copy(self.$scope.model[$(el).find("[id^='control_']").attr("id")]);
                  if (copyCache.canDelete != false) {
                      copyCache.controlId = null;
                      copyCache.style["z-index"] = null;
                      copyCache.locked = false;

                      self.$scope.$root.copyCache.push(copyCache);
                  }
              });
              return true;
          }

          self.paste = function () {
              if (!!self.$scope.$root.copyCache) {
                  //坐标偏移值设置
                  var isOffset = false;
                  $.each(self.$scope.$root.copyCache, function (i, _model) {
                      for (var key in self.$scope.model) {
                          var style = self.$scope.model[key]["style"];
                          if (!!style) {
                              if (style["left"] == _model.style["left"] &&
                                  style["top"] == _model.style["top"]) {
                                  isOffset = true;
                                  return false;
                              }
                          }
                      }
                  });
                  if (isOffset) {
                      var offsetVal = 50;
                      $.each(self.$scope.$root.copyCache, function (i, _model) {
                          var pageSize = null;
                          switch (_model.location) {
                              case "header-full":
                                  pageSize = angular.copy(self.$scope.pageSize.pageHeader);
                                  pageSize.width = "100%";
                                  break;
                              case "header":
                                  pageSize = self.$scope.pageSize.pageHeader;
                                  break;
                              case "body-full":
                                  pageSize = angular.copy(self.$scope.pageSize.pageBody);
                                  pageSize.width = "100%";
                                  break;
                              case "body":
                                  pageSize = self.$scope.pageSize.pageBody;
                                  break;
                              case "footer-full":
                                  pageSize = angular.copy(self.$scope.pageSize.pageFooter);
                                  pageSize.width = "100%";
                                  break;
                              case "footer":
                                  pageSize = self.$scope.pageSize.pageFooter;
                                  break;
                          }
                          if (!pageSize) return true;
                          if (pageSize.width != "100%") {
                              var right = _model.style["left"] + _model.style["width"];
                              if (right + offsetVal > pageSize.width) {
                                  _model.style["left"] = parseFloat(_model.style["left"]) - offsetVal;
                              } else {
                                  _model.style["left"] = parseFloat(_model.style["left"]) + offsetVal;
                              }
                          }
                          
                          if (pageSize.height != "100%") {
                              var bottom = _model.style["top"] + _model.style["height"];
                              if (bottom + offsetVal > pageSize.height) {
                                  _model.style["top"] = parseFloat(_model.style["top"]) - offsetVal;
                              } else {
                                  _model.style["top"] = parseFloat(_model.style["top"]) + offsetVal;
                              }
                          }
                      });
                  }
                  self.$scope.$broadcast("framework.createControl", self.$scope.$root.copyCache);
              }
              return true;
          }

          var _prev = function () {
              history.prev();
              return true;
          }

          var _next = function () {
              history.next();
              return true;
          }

          self.del = function (target) {
              var models = [];
              $.each($(target).find("[id^='control_']"), function (i, el) {
                  var _id = $(el).attr("id");
                  if (self.$scope.model[_id].canDelete != false) {
                      $(el).parents("#oper_" + _id).remove();
                      models.push(angular.copy(self.$scope.model[_id]));
                      delete self.$scope.model[_id];
                  }
              });
              if (models.length > 0) {
                  history.log();
              }
              return true;
          }

          self.buildEvent = function (event, target) {
              switch (event.keyCode) {
                  case 37:  //left
                  case 38:  //top
                  case 39:  //right
                  case 40:  //bottom
                      if (!!target && !event.ctrlKey) return _position(event.keyCode, target);
                      break;
                  case 67:  //c
                      if (!!target && event.ctrlKey) return self.copy(target);
                      break;
                  case 86:  //v
                      if (event.ctrlKey) return self.paste();
                      break;
                  case 90:  //z
                      if (event.ctrlKey) return _prev();
                      break;
                  case 89:  //y
                      if (event.ctrlKey) return _next();
                      break;
                  case 46:  //delete
                      if (!!target && !event.ctrlKey) return self.del(target);
                      break;
              }
          }

          self.attachScope = function ($scope) {
              self.$scope = $scope;
          }

          self.checkKeys = function (event) {
              switch (event.keyCode) {
                  case 37:
                  case 38:
                  case 39:
                  case 40:
                  case 46:
                      return true;
                  case 67:
                  case 86:
                  case 90:
                  case 89:
                      return event.ctrlKey == true;
              }
          }
      }
  ]);
