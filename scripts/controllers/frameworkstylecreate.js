'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:FrameworkStyleCreateCtrl
 * @description
 * # LoginctrlCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('FrameworkStyleCreateCtrl', ["$scope","$element", "messengerService",
      function ($scope, $element, messengerService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $scope.data = {
              title: "",
              previewImg: "../../images/no_image_220x220.jpg",
              imgSuffix: ""
          }

          $scope.btnOK = function () {
              if ($scope.data.title == "") {
                  messengerService.info("请填写样式名称");
                  return false;
              } else if ($scope.data.previewImg == "" || $scope.data.previewImg == "../../images/no_image_220x220.jpg") {
                  messengerService.info("请上传预览图");
                  return false;
              }
              $scope.$parent.$broadcast("framework.style.create", $scope.data);
              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }

          $scope.$on("uploadImageComplete", function (e, result) {
              if (result.length > 0) {
                  $scope.data.previewImg = result[0].src;
                  $scope.data.imgSuffix = result[0].suffix;
              }
          });
      }
  ]);
