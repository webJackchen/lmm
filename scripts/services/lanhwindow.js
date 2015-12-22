'use strict';

/**
 * @ngdoc service
 * @name lanhKdesignApp.lanhWindow
 * @description
 * # lanhWindow
 * Factory in the lanhKdesignApp.
 */
angular.module('lanhKdesignApp')
  .factory('lanhWindow', ["$compile",
      function ($compile) {
          // Service logic
          // ...

          var meaningOfLife = 42;

          //option: { title: '', template: '' }
          var _create = function (option, $scope) {
              var dialog = $("<div class=\"lanh-modal\"></div>").append($compile(option.template)($scope)),
                  position = {
                      my: "center top+20px",
                      at: "center top+20px",
                      of: $("#content")
                  }
              if (position.of.length == 0) {
                  position = {
                      my: "center top+20%",
                      at: "center top+20%",
                      of: $("body")
                  }
              }

              var _option = {
                  title: "设置",
                  resizable: false,
                  width: "auto",
                  position: position,
                  modal: true,
                  maxHeight: 680
              }

              var _open = function (event, ui) {                  
                  if (!!option.open && typeof (option.open) == "function") {
                      option.open();
                  }
                  //open function
              }

              var _close = function () {
                  if (!!option.close && typeof (option.close) == "function") {
                      option.close();
                  }
                  $(this).dialog("destroy");
              }

              _option = $.extend(_option, option);
              if (!!_option.open) {
                  var _openFn = _option.open;
                  setTimeout(function () {
                      var _zIndex = _dialog.parent()[0].style.zIndex;
                      if (_dialog.parent().next().hasClass(".ui-widget-overlay")) {
                          _dialog.parent().next().css("z-index", _zIndex - 1);
                      }
                  },1000);
                  _option.open = function (event, ui) {
                      _openFn(event, ui);
                      _open(event, ui);
                  }
              } else {
                  _option.open = _open;
              }

              if (!!_option.close) {
                  var _closeFn = angular.copy(_option.close);
                  _option.close = function () {
                      _closeFn();
                      _close()
                  }
              } else {
                  _option.close = _close;
              }

              var _dialog = dialog.dialog($.extend(_option, option));

          }

          // Public API here
          return {
              create: _create
          };
      }
  ]);