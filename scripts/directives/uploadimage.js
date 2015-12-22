'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:adManage
 * @description
 * # admanage
 */
angular.module('lanhKdesignApp')
  .directive('uploadImage', ["$http", "$timeout", "lanhWindow", "$compile", "messengerService",
      function ($http, $timeout, lanhWindow, $compile, messengerService) {
          return {
              restrict: 'A',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs.uploadImage   //回调事件名称, callback key
                  */
                  $scope.flowInitOption = {
                      singleFile: true
                  }
                  $element.off("click.uploadImage").on("click.uploadImage", function (e) {
                      $timeout(function () {
                          //调用上传控件
                          $http.get("../../views/common/uploadimage.tpl.html")
                              .success(function (template) {
                                  lanhWindow.create({
                                      title: "上传图片",
                                      template: template
                                  }, $scope);
                              });
                      });
                  }).css({ "cursor": "pointer" });

                  $scope.btnUploadImageOK = function ($event) {
                      //callback
                      $scope.$emit(attrs["uploadImage"], $scope.result);
                      //$($event.currentTarget).parents(".lanh-modal").dialog("close");
                      $(".settimg-image").parents(".lanh-modal").dialog("close");
                  }

                  //upload functions
                  $scope.result = [];

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
                      if ($flow.files.length > 0) {
                          var needUploadImgs = [],
                              flowFiles = [];
                          $scope.result = [];
                          $.each($flow.files, function () {
                              var flowFile = this;
                              if (!flowFile.isUploading() && !isUploadedImgs(flowFile.$$hashKey)) {
                                  flowFiles.push(flowFile);
                              }
                          });
                          $timeout(function () {
                              if (!!flowFiles && flowFiles.length > 0) {
                                  var imgs = $("#localImages .image-column");
                                  needUploadImgs = imgs.slice(imgs.length - flowFiles.length, imgs.length);
                                  for (var i = 0; i < needUploadImgs.length; i++) {
                                      var item = angular.copy(flowFiles[i].file);
                                      $scope.result.push($.extend(item, {
                                          src: $(needUploadImgs[i]).find("img").attr("src"),
                                          suffix: /\.[^\.]+$/.exec(flowFiles[i].name)[0]
                                      }));
                                  }
                              }
                              //auto close;
                              if ($scope.flowInitOption.singleFile == true) $scope.btnUploadImageOK();
                          }, 500);
                      }
                  }
              }
          };
      }
  ]);
