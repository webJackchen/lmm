'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.alignService
 * @description
 * # alignService
 * Service in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .service('alignService', ["history",
      function (history) {
          // AngularJS will instantiate a singleton by calling "new" on this function
          var self = this;

          var _align = function (type, $target) {
              var position = angular.copy($target.position());
              switch (type) {
                  case "top":    //上对齐
                      $.each($target, function (i, el) {
                          if (position.top > $(el).position().top) {
                              position.top = $(el).position().top;
                          }
                      });
                      $target.css("top", position.top);
                      break;
                  case "middle":    //上下居中
                      var top = 0, height = 0;
                      $.each($target, function (i, el) {
                          var position = $(el).position();
                          top = (i == 0) ? position.top : Math.min(top, position.top);
                      });
                      $.each($target, function (i, el) {
                          var position = $(el).position();
                          height = (i == 0) ? position.top + $(el).height() - top : Math.max(height, position.top + $(el).height() - top);
                      });
                      $.each($target, function (i, el) {
                          $(el).css("top", top + ((height - $(el).height()) / 2));
                      });
                      break;
                  case "left":
                      $.each($target, function (i, el) {
                          if (position.left > $(el).position().left) {
                              position.left = $(el).position().left;
                          }
                      });
                      $target.css("left", position.left);
                      break;
                  case "center":    //左右居中
                      var left = 0, width = 0;
                      $.each($target, function (i, el) {
                          var position = $(el).position();
                          left = (i == 0) ? position.left : Math.min(left, position.left);
                      });
                      $.each($target, function (i, el) {
                          var position = $(el).position();
                          width = (i == 0) ? position.left + $(el).width() - left : Math.max(width, position.left + $(el).width() - left);
                      });
                      $.each($target, function (i, el) {
                          $(el).css("left", left + ((width - $(el).width()) / 2));
                      });
                      break;
                  case "bottom":
                      var bottom = 0;
                      $.each($target, function (i, el) {
                          bottom = Math.max(bottom, $(el).position().top + $(el).height());
                      });
                      $.each($target, function (i, el) {
                          $(el).css("top", bottom - $(el).height());
                      });
                      break;
                  case "right":
                      var right = 0;
                      $.each($target, function (i, el) {
                          right = Math.max(right, $(el).position().left + $(el).width());
                      });
                      $.each($target, function (i, el) {
                          $(el).css("left", right - $(el).width());
                      });
                      break;
                  case "page-center":
                      $.each($target, function (i, el) {
                          var $parent = $(el).parent(),
                              width = $parent.width();
                          $(el).css("left", (width - $(el).width()) / 2);
                      });
                      break;
                  case "page-middle":
                      $.each($target, function (i, el) {
                          var $parent = $(el).parent(),
                              height = $parent.height();
                          $(el).css("top", (height - $(el).height()) / 2);
                      });
                      break;
              }
              refreshModelData($target, type);
          }

          var refreshModelData = function ($target, type) {
              $.each($target, function (i, el) {
                  var id = $(el).find("[id^='control_']:first").attr("id"),
                      currentPosition = $(el).position(),
                      parentPosition = $(el).offsetParent().position();
                  self.$scope.model[id].style["left"] = parentPosition.left + currentPosition.left;
                  self.$scope.model[id].style["top"] = parentPosition.top + currentPosition.top;
              });
              history.log();
          }


          self.attachScope = function ($scope) {
              self.$scope = $scope;
          }
          self.top = function (target) {
              _align("top", $(target));
          }
          self.left = function (target) {
              _align("left", $(target));
          }
          self.bottom = function (target) {
              _align("bottom", $(target));
          }
          self.right = function (target) {
              _align("right", $(target));
          }
          self.middle = function (target) {
              _align("middle", $(target));
          }
          self.center = function (target) {
              _align("center", $(target));
          }
          self.pageCenter = function (target) {
              _align("page-center", $(target));
          }
          self.pageMiddle = function (target) {
              _align("page-middle", $(target));
          }
      }
  ]);
