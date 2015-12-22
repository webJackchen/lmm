'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:styleImageCtr
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('styleImageCtr', ["$scope", "$element", "styleService", "$timeout", "$http","messengerService","manuscriptService","componentService",
function ($scope, $element, styleService, $timeout, $http, messengerService, manuscriptService, componentService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          console.log($scope.$parent.condition)

          $scope.fileAdded = function ($file, $event, $flow) {
              var canExtension = $.grep(["png", "gif", "jpg", "jpeg"], function (n) { return n == $file.getExtension() }).length > 0;
              if (!canExtension) return false;
          }

          var uploadedImgs = {};
          var isUploadedImgs = function (hashKey) {
              var isUploaded = false;
              if (!uploadedImgs[hashKey]) {
                  uploadedImgs[hashKey] = true;
              } else {
                  isUploaded = true;
              }
              return isUploaded;
          }

          $scope.fileComplete = function ($file, $event, $flow) {
              if ($flow.files.length) {
                  var flowFiles = [];
                  $.each($flow.files, function () {
                      var flowFile = this;
                      if (!flowFile.isUploading() && !isUploadedImgs(flowFile.$$hashKey)) {
                          flowFiles.push(flowFile);
                      }
                  });

                  /*开始上传*/
                  $timeout(function () {
                      if (!!flowFiles && flowFiles.length > 0) {
                          var imgs = $("#localImages .image-column");
                          var needUploadImgs = imgs.slice(imgs.length - flowFiles.length, imgs.length);
                          for (var i = 0; i < needUploadImgs.length; i++) {
                              var imgSrc = $(needUploadImgs[i]).find("img").attr("src");
                              var ImgSuffix = /\.[^\.]+$/.exec(flowFiles[i].name);
                              var _i = i;
                              var data = {};
                              if ($scope.$parent.condition.isCategory === 'styleUpload') {
                                  data = {
                                      customSkins: [{
                                          id: $scope.$parent.condition.id,
                                          customSkinAction: "UploadImg",
                                          moduleType: $scope.$parent.condition.moduleType,
                                          skinName: $scope.$parent.condition.skinName,
                                          ImgStream: imgSrc,
                                          ImgSuffix: ImgSuffix[0]
                                      }]
                                  };
                                  (function (index) {
                                      styleService.saveStyle(data, function (result) {
                                          if (result.code == 200) {
                                              $scope.$parent.styleTemplate.previewImg = lanh.apiHost + result.dataObject.customSkins[0].previewImg;
                                              messengerService.success("上传成功");
                                              $element.parent().dialog("close");
                                              $scope.$parent.refreshList();
                                          }
                                      });
                                  })(i);
                              } else if ($scope.$parent.condition.isCategory === 'manuscriptUpload') {
                                  data = $scope.$parent.condition;
                                  data.imgStream = imgSrc;
                                  data.imgSuffix = ImgSuffix[0];
                                  data.operation = "UploadImg";
                                  manuscriptService.submitManuscript(data, function (result) {
                                      if (result.code == 200) {
                                          $scope.$parent.createFormData.previewImg = result.dataObject.previewImg;
                                          $scope.$parent.createFormData.previewImg1 = lanh.apiHost+result.dataObject.previewImg;
                                          messengerService.success("上传成功");
                                          $element.parent().dialog("close");
                                          $scope.$parent.refreshList();
                                      }
                                  });
                              } else if ($scope.$parent.condition.isCategory === 'componentUpload') {
                                  data = $scope.$parent.condition;
                                  data.imgStream = imgSrc;
                                  data.imgSuffix = ImgSuffix[0];
                                  componentService.uploadInfo(data, function (result) {
                                      if (result.code == 200) {
                                          $scope.$parent.componentInfo.previewImg = lanh.apiHost + result.dataObject.previewImg;
                                          messengerService.success("上传成功");
                                          $element.parent().dialog("close");
                                          $scope.$parent.refreshList();
                                      }
                                  });
                              }
                              
                          }
                      }
                  }, 500);
              }
          }

      }

  ]);
