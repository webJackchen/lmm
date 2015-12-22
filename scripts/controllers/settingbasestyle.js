'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingbasestyleCtrl
 * @description
 * # SettingbasestyleCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingBaseStyleCtrl', ["$scope", "$element", "$timeout", "spectrumService",
      function ($scope, $element, $timeout, spectrumService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          var controlId = $scope.controlId = $scope.$parent.currentId;

          var model = $scope.model = angular.copy($scope.$parent.model[controlId]);

          if (!model.style) {
              model.style = {
                  "background-color": "",
                  "background-image": "",
                  "background-repeat": "repeat",
                  "background-position": ""
              }
          } else {
              for (var key in model.style) {
                  switch (key) {
                      case "border-width":
                      case "border-radius":
                      case "opacity":
                          model.style[key] = parseFloat(model.style[key]);
                          break;
                  }
              }
          }
          if (model.key === 'setting_footer') {
              model.style.height = $scope.$parent.pageSize.pageFooter.height;
          }
          else if (model.key === 'setting_header') {
              model.style.height = $scope.$parent.pageSize.pageHeader.height;
          }
          else if (model.key === 'setting_body') {
              model.style.height = $scope.$parent.pageSize.pageBody.height;
          }


          if (!model.style["background-image"]) {
              model.style["background-image"] = "../../images/no_image_220x220.jpg";
          }

          $scope._opacity = 100;

          //show or hide column
          var tpl_status = $scope.tpl_status = {}
          if (!!model.settingBaseStyle) {
              $.each(model.settingBaseStyle, function (i, name) {
                  tpl_status[name] = true;
              });
          }

          $element.find("#pageColorPicker").spectrum($.extend(spectrumService.options, {
              color: model.style["background-color"],
              change: function (color) {
                  $timeout(function () {
                      model.style["background-color"] = !!color ? color.toHexString() : "";
                  });
              }
          }));

          $element.find("#borderColorPicker").spectrum($.extend(spectrumService.options, {
              color: model.style["border-color"],
              change: function (color) {
                  $timeout(function () {
                      model.style["border-color"] = !!color ? color.toHexString() : "";
                  });
              }
          }));

          $scope.btnDelBackgroundImage = function () {
              model.style["background-image"] = "../../images/no_image_220x220.jpg";
          }

          $scope.selectBackgroundPosition = function (posName) {
              model.style["background-position"] = (posName || '');
          }

          var sliderEvent = {
              reg: function (modelName) {
                  var sender = this;
                  //sender.on('slide', function () {
                  //    $scope.$apply(function () {
                  //        if (sender.$element.attr("id") == "opacity") {
                  //            $scope._opacity = sender.getValue();
                  //            model.style[sender.$element.attr("id")] = sender.getValue() / 100;
                  //        } else {
                  //            model.style[sender.$element.attr("id")] = sender.getValue();
                  //        }
                  //    })
                  //});
                  sender.on('change', function (args) {
                      $scope.$apply(function () {
                          if (sender.$element.attr("id") == "opacity") {
                              $scope._opacity = args.newValue;
                              model.style[sender.$element.attr("id")] = args.newValue / 100;
                          } else {
                              model.style[sender.$element.attr("id")] = args.newValue;
                          }
                      })
                  });
              }
          };
          var sliderWidth = new Slider($element.find('#border-width')[0]);
          var sliderRadius = new Slider($element.find('#border-radius')[0]);
          var backgroundOpacity = new Slider($element.find('#opacity')[0]);
          sliderEvent.reg.call(sliderWidth);
          sliderEvent.reg.call(sliderRadius);
          sliderEvent.reg.call(backgroundOpacity);

          $scope.changeBorderNumber = function (styleName) {
              switch (styleName) {
                  case "border-width":
                      sliderWidth && sliderWidth.setValue(model.style["border-width"]);
                      break;
                  case "border-radius":
                      sliderRadius && sliderRadius.setValue(model.style["border-radius"]);
                      break;
                  case "opacity":
                      model.style["opacity"] = $scope._opacity / 100;
                      backgroundOpacity && backgroundOpacity.setValue($scope._opacity);
                      break;
              }
          }

          $scope.changeBorderNumber("border-width");
          $scope.changeBorderNumber("border-radius");
          if (model.style["opacity"] != null) {
              $scope._opacity = model.style["opacity"] * 100;
          }
          model.style["opacity"] = $scope._opacity / 100;
          $scope.changeBorderNumber("opacity");
          model.isHide=model.style["display"]==='none';

          $scope.btnOK = function () {
              var _model = angular.copy(model);
              if (!_model.style["background-color"]) _model.style["background-color"] = "";

              if (_model.style["background-image"] == "../../images/no_image_220x220.jpg") {
                  _model.style["background-image"] = "";
              }

              if (!_model.style["background-position"]) _model.style["background-position"] = "";
              if (!_model.style["background-repeat"]) _model.style["background-repeat"] = "repeat";

              //format
              //if (!!_model.style['opacity']) _model.style['opacity'] = _model.style['opacity'];
              //if (!!_model.style['border-width']) _model.style['border-width'] = _model.style['border-width'];
              //if (!!_model.style['border-radius']) _model.style['border-radius'] = _model.style['border-radius'];

              if (!!_model.style['border-width'] || !!_model.style['border-radius']) {
                  if (!_model.style['border-style'] || !!_model.style['border-style'] == "none") {
                      _model.style['border-style'] = "solid";
                  }
              }

              $scope.$parent.$broadcast("framework.setting.baseStyle", _model);

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }

          $scope.$on("imageManageCallback", function (e, data) {
              if (!!data) {
                  model.style["background-image"] = data.src;
              }
          });

          $scope.setHide = function () {
              model.style["display"] = !!model.isHide && 'none' || 'block';
          }
      }
  ]);
