'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:imageManage
 * @description
 * # imageManage
 */
angular.module('lanhKdesignApp')
  .directive('imageManage', ["$compile", "$http", "$timeout", "lanhWindow",
      function ($compile, $http, $timeout, lanhWindow) {
          return {
              //template: '<button class="btn btn-primary" ng-click="selectImages()">{{ _title }}</button>',
              restrict: 'EA',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs:
                        title           //按钮名称
                        selectetype     //单选或多选 single | multiple
                        callback        //点击确定回调事件名称 (仅仅是名称，不加括号）
                        kid             //k+ ID，传递后，固定用此ID获取素材库的数据
                  */
                  $scope._kid = attrs.kid;
                  var _callback = null;
                  if ($element.get(0).tagName.toLowerCase() == "image-manage") {
                      $element.html($compile('<button class="btn btn-primary" ng-click="selectImages()">{{ _title }}</button>')($scope));
                      _callback = attrs.callback;
                  } else {
                      $element.on("click.selectImageManage", function (e) {
                          $timeout(function () {
                              $scope.selectImages();
                          })
                      });
                      _callback = attrs.imageManage;
                  }

                  $scope._title = attrs.title || "图片管理";

                  var model = $scope.model = {
                      resource: {
                          server: {
                              files: []
                          },
                          local: {
                              files: []
                          }
                      }
                  }

                  var tpl_status = $scope.tpl_status = {
                      mode: "server", //local or server
                      selectetype: attrs.selectetype || "single", //single | multiple
                      pageSize: '40',
                      pageIndex: 1,
                      total: 0,
                      isDesc: 'true',
                      titleKey: ''
                  }

                  $scope.resetTplStatus = function () {
                      tpl_status.mode = "server";
                      tpl_status.selectetype = attrs.selectetype || "single";
                      tpl_status.pageSize = '40';
                      tpl_status.pageIndex = 1;
                      tpl_status.total = 0;
                      tpl_status.isDesc = 'true';
                      tpl_status.titleKey = '';
                      _getImages();
                  }

                  $scope.searchImages = function () {
                      tpl_status.pageIndex = 1;
                      _getImages();
                  }

                  var _getImages = function () {
                      var url = lanh.apiPath + "/proxy?isImage=true&kid="
                          + (!!attrs.kid ? attrs.kid : "")
                          + "&pageSize=" + tpl_status.pageSize
                          + "&pageIndex=" + tpl_status.pageIndex
                          + "&isDesc=" + tpl_status.isDesc
                          + "&titleKey=" + (!!tpl_status.titleKey ? tpl_status.titleKey : "");
                      $http.get(url)
                      .success(function (result) {
                          var _result = JSON.parse(result.jsonText),
                              _files = [];
                          if (!!_result.channel.item && _result.channel.item != "0") {
                              if (!angular.isArray(_result.channel.item)) _result.channel.item = [_result.channel.item];
                              $.each(_result.channel.item, function (i, _item) {
                                  _files.push({
                                      id: _item.id.text,
                                      link: _item.link.text,
                                      websiteid: _item.websiteid.text,
                                      title: _item.title.text,
                                      isdelete: _item.isdelete.text,
                                      src: "http://" + _result.channel.host + _item.url.text,
                                      size: _item.size.text
                                  });
                              });
                          }
                          debugger;
                          tpl_status.total = _result.channel.allcount;
                          model.resource.server = {
                              files: _files
                          }
                      });
                  }

                  $scope.selectImages = function () {
                      $http.get("../../views/common/imagemanage.tpl.html")
                      .success(function (result) {
                          lanhWindow.create({
                              title: "图片管理",
                              template: result
                          }, $scope);
                          _getImages();
                      });
                  }

                  $scope.pageChanged = function () {
                      _getImages();
                  }

                  $scope.btnSelectedFile = function (file, $flow) {
                      var _files = null;
                      if (tpl_status.mode == "local") {
                          _files = $flow.files;
                      } else {
                          _files = model.resource[tpl_status.mode].files;
                      }
                      if (tpl_status.selectetype == "single") {
                          $.each(_files, function (i, file) {
                              file.focus = "";
                          });
                          file.focus = "on";
                      } else if (tpl_status.selectetype == "single") {
                          if (file.focus == "on") {
                              file.focus = "";
                          } else {
                              file.focus = "on";
                          }
                      }
                      /*样式库添加src*/
                      $("#styleImage").val(file.src);
                  }

                  $scope.selectAll = function (e) {
                      $("#styleImage").select();
                  }

                  $scope.btnDeleteFile = function (file, $flow) {
                      if (tpl_status.mode == "local") {
                          $flow.files = $.grep($flow.files, function (n) { return n.$$hashKey != file.$$hashKey });
                      } else {
                          model.resource[tpl_status.mode].files = $.grep(model.resource[tpl_status.mode].files, function (n) { return n.id != file.id });
                      }
                      //todo: delete server image
                  }

                  $scope.fileAdded = function ($file, $event, $flow) {
                      //$file.hideProgress = true;
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
                                      var _i = i;
                                      (function (index) {
                                          $http.post(lanh.apiPath + "/proxy", {
                                              filePath: imgSrc,
                                              fileName: encodeURIComponent(flowFiles[index].name),
                                              KID: !!attrs.kid ? attrs.kid : ""
                                          }).success(function (result) {
                                              if (result && result.jsonText) {
                                                  var resultObj = JSON.parse((result.jsonText || "")
                                                      .replace(new RegExp('\'', 'gm'), '\"'));
                                                  flowFiles[index].src = result.host + '/' + resultObj.url;
                                                  flowFiles[index].hideProgress = true;
                                              }
                                          });
                                      })(i);
                                  }
                              }
                          }, 500);
                      }
                  }

                  $scope.btnOk = function ($event, $flow) {
                      if (!!_callback) {
                          var _files = [];
                          if (tpl_status.mode == "local") {
                              //_files = $flow.files;
                              $.each($flow.files, function (i, file) {
                                  _files.push({
                                      //id: file.id,
                                      //link: file.link,
                                      //websiteid: file.websiteid,
                                      title: file.name,
                                      isdelete: "-1",
                                      src: file.src,
                                      size: file.size,
                                      focus: file.focus
                                  });
                              })
                          } else {
                              _files = model.resource[tpl_status.mode].files;
                          }
                          var _selected = angular.copy($.grep(_files, function (n) { return n.focus == "on" }));
                          if (tpl_status.selectetype == "single") {
                              _selected = _selected[0];
                          }
                          $scope.$emit(_callback, _selected);
                      }
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }
              }
          };
      }
  ]);
