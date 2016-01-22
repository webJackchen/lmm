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

                  $scope.bindHtml = function (htmlString) {
                      return $sce.trustAsHtml(htmlString);
                  }
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
                      $element.html($compile('<button class="btn btn-primary btn-fontSize" ng-click="selectImages()">{{ _title }}</button>')($scope));
                      _callback = attrs.callback;
                  } else {
                      $element.on("click.selectImageManage", function (e) {
                          $timeout(function () {
                              $scope.selectImages();
                          })
                      });
                      _callback = attrs.imageManage;
                  }

                  $scope._title = attrs.title || "选择";

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
                      pageSize: 12,
                      pageIndex: 1,
                      total: 0,
                      sortBy: 'id_desc',
                      titleKey: ''
                  }

                  $scope.resetTplStatus = function () {
                      tpl_status.mode = "server";
                      tpl_status.selectetype = attrs.selectetype || "single";
                      tpl_status.sortBy = 'id_desc';
                      tpl_status.titleKey = '';
                      _getImages();
                  }

                  $scope.searchImages = function () {
                      tpl_status.pageIndex = 1;
                      _getImages();
                  }

                  var getImageWidth = function (obj, callback) {
                      var img = new Image();
                      img.src = obj.srcTrue;
                      // 如果图片被缓存，则直接返回缓存数据
                      if (img.complete) {
                          obj.size = img.width + '*' + img.height;
                      } else {
                          // 完全加载完毕的事件
                          img.onload = function () {
                              obj.size = img.width + '*' + img.height;
                              //callback(img.width, img.height);
                              $timeout(function () {
                                  $scope.$apply();
                              })
                          }
                      }
                  }

                  var _getImages = function () {
                      var url = lanh.apiPath + "proxy/images?kid="+ (!!attrs.kid ? attrs.kid : "")
                          + "&pageSize=" + $scope.tpl_status.pageSize
                          + "&pageIndex=" + $scope.tpl_status.pageIndex
                          + "&titleKey=" + (!!tpl_status.titleKey ? tpl_status.titleKey : "")
                          + "&sortBy=" + tpl_status.sortBy;
                      $http.get(url)
                      .success(function (result) {
                          var _result = JSON.parse(result.jsonText),
                              _files = [];
                          if (!!_result.channel.item && _result.channel.item != "0") {
                              if (!angular.isArray(_result.channel.item)) _result.channel.item = [_result.channel.item];
                              $.each(_result.channel.item, function (i, _item) {
                                  var size, src = "http://" + _result.channel.host + _item.url.text;

                                  var newImageItem = {
                                      id: _item.id.text,
                                      link: _item.link.text,
                                      websiteid: _item.websiteid.text,
                                      allTitle: _item.alltitle.text,
                                      title: _item.alltitle.text,
                                      isdelete: _item.isdelete.text,
                                      src: "http://" + _result.channel.host + "/250_0_1_60_0_fff" + _item.url.text,
                                      srcTrue: "http://" + _result.channel.host  + _item.url.text,
                                      size: size
                                  }
                                  getImageWidth(newImageItem, function (w, h) {
                                      size = w + "*" + h;
                                  });
                                  _files.push(newImageItem);
                              });
                          }
                          $scope.tpl_status.total = parseInt(_result.channel.allcount);
                          model.resource.server = {
                              files: _files
                          }
                      });
                  }

                  $scope.imagesUp = function (template) {
                      $http.get("../../views/common/imageUploading.tpl.html")
                         .success(function (template) {
                             lanhWindow.create({
                                 title: "图片上传",
                                 template: template
                             }, $scope);
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

                  $scope.btnSelectedFile = function ($event, file, $flow) {
                      var myEl = angular.element($event.target);
                      var _h = '<span class="K-imgSelected-icon K-VHcenter"><i class="iconfont icon-ok K-VHcenter"></i></span>';
                      if (!myEl.hasClass('K-imgSelected'))
                          myEl = myEl.parent();
                      if (!myEl.hasClass('K-imgSelected'))
                          myEl = myEl.parent();
                      if (!myEl.hasClass('K-imgSelected'))
                          myEl = myEl.parent();
                      var data = myEl.attr("data-imgSelected");
                      $(".K-imgSelected").removeAttr("data-imgSelected");
                      $(".K-imgSelected .K-imgSelected-icon").remove();
                      if (!data)
                          myEl.append(_h).attr('data-imgSelected', "0");
                      else
                          myEl.removeAttr("data-imgSelected");
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
                      $("#styleImage").val(file.srcTrue);
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
                  $scope.upImgDel = function (file, $flow) {
                      $flow.files = $.grep($flow.files, function (n) { return n.$$hashKey != file.$$hashKey });
                      if ($flow.files.length != 0)
                          $(".uplength").html($flow.files.length + "张图片等待上传");
                      else {
                          $('.upimgAddH').show();
                          $('.upimgListTop').hide();
                      }
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
                          $('.upimgAddH').hide();
                          $('.upimgListTop').show();
                          $(".uplength").html($flow.files.length + "张图片等待上传");
                          var flowFiles = [];
                          $.each($flow.files, function () {
                              var flowFile = this;
                              if (!flowFile.isUploading() && !isUploadedImgs(flowFile.$$hashKey)) {
                                  flowFiles.push(flowFile);
                              }
                          });
                          flowFiles.push($scope.flowFiles);
                          $scope.flowFiles = flowFiles;
                          /*开始上传
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
                          }, 500);*/
                      }
                  }

                  $scope.btnUploadImageOK = function ($event) {
                      var flowFiles = $scope.flowFiles;
                      if (!!flowFiles && flowFiles.length > 0) {
                          var imgs = $("#localImages .image-column");
                          var needUploadImgs = imgs;
                          for (var i = 0; i < needUploadImgs.length; i++) {
                              var imgSrc = $(needUploadImgs[i]).find("img").attr("src");
                              var _i = i,
                                  num = 0;
                              (function (index) {
                                  $http.post(lanh.apiPath + "/proxy", {
                                      filePath: imgSrc,
                                      fileName: encodeURIComponent(flowFiles[index].name),
                                      KID: !!attrs.kid ? attrs.kid : ""
                                  }).success(function (result) {
                                      if (result && result.jsonText) {
                                          num++;
                                          console.log(num);
                                          var resultObj = JSON.parse((result.jsonText || "")
                                              .replace(new RegExp('\'', 'gm'), '\"'));
                                          flowFiles[index].src = result.host + '/' + resultObj.url;
                                          flowFiles[index].hideProgress = true;
                                          if (num == needUploadImgs.length)
                                              _getImages();
                                      }
                                  });
                              })(i);
                          }

                      }
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }
                  $scope.clearupimgList = function ($event, file, $flow) {
                      $('.upimgAddH').show();
                      $('.upimgListTop').hide();
                      $scope.flowFiles = [];
                      $flow.files = $scope.flowFiles

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
                                      src: file.srcTrue,
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
