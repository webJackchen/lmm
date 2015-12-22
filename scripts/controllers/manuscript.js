'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:ManuscriptCtrl
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ManuscriptCtrl', ["$scope", "$element", "manuscriptService", "loginService", "utilsService", "messengerService", "lanhWindow", "$http", "$location", "$timeout", "storage", "$filter",
      function ($scope, $element, manuscriptService, loginService, utilsService, messengerService, lanhWindow, $http, $location, $timeout, storage, $filter) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          $element.find("#datetimepickerMauscript").daterangepicker({
              "autoApply": true,
              "startDate": new Date(),
              "endDate": new Date(),
              "locale": {
                  "format": "YYYY.MM.DD"
              }
          });
          /*清空时间值*/
          $scope.removeDate = function ($event) {
              $(event.target).closest(".datetimepicker").find("input").val("");
          }

          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
          }

          /*行业类别转换格式*/
          var convertToArray = function (kplusObj) {
              if (!kplusObj || !kplusObj.channel) return [];
              var resultArr = [],
                  items = kplusObj.channel.item;
              if (items == 0) return [];

              for (var i = 0; i < items.length; i++) {
                  var item = items[i];
                  resultArr.push({
                      key: item.link.text || item.link,
                      text: item.title.text
                  });
              }
              return resultArr;
          }
          /*行业类别初始化*/
          manuscriptService.getIndustryList(function (result) {
              if (result && result.jsonText) {
                  var kplusObj = JSON.parse(result.jsonText);
                  $scope.industryList = convertToArray(kplusObj);
              }
          });

          $scope.OriginalSKID = "";
          $scope.templateList = [];

          var _createFormData = {
              terminal: "Web",
              pageWidth: 1200
          }

          $scope.createFormData = angular.copy(_createFormData);


          $scope.btnOpenCreateForm = function () {
              $scope.isDelete = false;
              $scope.createFormData.edit = false;
              $scope.createFormData.styleClass = "";
              $scope.createFormData.industry = "";
              $scope.createFormData.color = "";
              $scope.createFormData.title = "";
              // $scope.createFormData.templateType = "";
              $http.get("/views/templates/management-manuscript-create.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "新建",
                      template: result
                  }, $scope);
              });
          }

          $scope.btnOpenInfoForm = function (template) {
              $scope.isDelete = false;
              var templateInfo = angular.copy(template);
              $scope.OriginalSKID = template.sKID;
              if (templateInfo.previewImg) {
                  templateInfo.previewImg1 = $scope.host + templateInfo.previewImg;
              }
              if (templateInfo.webType === "Web") {
                  templateInfo.webType1 = "PC";
              } else if (templateInfo.webType === "WAP") {
                  templateInfo.webType1 = "MB";
              }
              $scope.createFormData = templateInfo;

              $http.get("/views/templates/management-manuscript-info.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "稿件信息",
                      template: result
                  }, $scope);
              });

              $($scope.industryList).each(function (i, val) {
                  if (val.key == template.sKID) {
                      $scope.createFormData.industry = $scope.industryList[i];
                  }
              });


              $scope.inputShow = 0;
              $scope.editState = function () {
                  $scope.inputShow = 1;
              }
          }


          $scope.host = lanh.apiHost;

          /*创建稿件*/
          $scope.btnCreate = function ($event) {
              var loginInfo = loginService.getLoginInfo(),
                  formData = $scope.createFormData;

              if (!formData.terminal ||
                  !formData.title ||
                  !formData.color ||
                  !formData.industry ||
                  !formData.styleClass ||
                  !formData.pageWidth) {
                  messengerService.info("信息输入不完整，无法创建稿件。");
                  return false;
              }
              if (formData.pageWidth < 800 || formData.pageWidth > 1400) {
                  messengerService.info("页面宽度必须设定在800~1400区间。");
                  return false;
              }

              var data = {
                  number: (formData.terminal + '').toLowerCase() + utilsService.uniqueId(),
                  title: formData.title,
                  author: '',
                  creator: loginInfo.userName,
                  webType: formData.terminal,
                  pageWidth: formData.pageWidth,
                  color: formData.color,
                  SKID: formData.industry.key,
                  industryName: formData.industry.text,
                  styleClass: formData.styleClass,
                  isDesigner: true,
                  kplusFolders: ['news', 'product', 'video', 'download', 'article', 'job', 'imagepic', 'contact', 'flink', 'goods']
              }
              if ($scope.createFormData.edit) {/*复制*/
                  data.number = $scope.createFormData.editNumber;
                  data.OriginalSKID = $scope.OriginalSKID;
                  manuscriptService.copyManuscript(data, function (result) {
                      if (result.code == 200) {
                          messengerService.success("复制成功！");
                          $scope.refreshList();
                          $($event.currentTarget).parents(".lanh-modal").dialog("close");
                      } else {
                          var errorMsg = '复制稿件时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '复制稿件失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              } else {/*创建*/
                  manuscriptService.createManuscript(data,
                  function (result) {
                      if (result.code == 200) {
                          messengerService.success("稿件添加成功。");
                          $scope.refreshList();
                          $scope.createFormData = angular.copy(_createFormData);
                          $($event.currentTarget).parents(".lanh-modal").dialog("close");
                      } else {
                          var errorMsg = '创建稿件时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '创建稿件失败，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
              }

          }

          /*复制所有稿件*/
          $scope.copyAllManuscript = function () {
              $http.get("/views/templates/management-manuscript-copy.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "稿件库",
                      template: result
                  }, $scope);
              });
          }


          $scope.btnEditor = function (template) {
              $location.search({ templateid: template.number });
              $location.path("/framework");
          }

          /*修改稿件*/
          $scope.btnCreateEdit = function ($event) {

              var loginInfo = loginService.getLoginInfo(),
                  formData = $scope.createFormData;
              if (!formData.webType ||
                  !formData.title ||
                  !formData.color ||
                  !formData.industry ||
                  !formData.styleClass ||
                  !formData.pageWidth) {
                  messengerService.info("信息输入不完整，无法创建稿件。");
                  return false;
              }


              if (formData.pageWidth < 800 || formData.pageWidth > 1400) {
                  messengerService.info("页面宽度必须设定在800~1400区间。");
                  return false;
              }

              var data = {
                  id: formData.id,
                  number: formData.number,
                  title: formData.title,
                  author: '',
                  editor: loginInfo.userName,
                  webType: formData.webType,
                  pageWidth: formData.pageWidth,
                  color: formData.color,
                  SKID: formData.industry.key,
                  industryName: formData.industry.text,
                  styleClass: formData.styleClass,
                  isDesigner: true,
                  previewImg: formData.previewImg,
                  createTime: formData.createTime,
                  kplusFolders: ['news', 'product', 'video', 'download', 'article', 'job', 'imagepic', 'contact', 'flink', 'goods'],
                  operation: "edit"
              }
              if (formData.industry.key !== $scope.OriginalSKID) {
                  data.originalSKID = $scope.OriginalSKID;
              }

              manuscriptService.submitManuscript(data,
                  function (result) {
                      if (result.code == 200) {
                          messengerService.success("稿件修改成功。");
                          $scope.refreshList();
                          $scope.inputShow = 2;
                      } else {
                          var errorMsg = '修改稿件时发生错误。';
                          /*是否重复Title提示*/
                          if (result.dataObject.isDuplicateTitle) {
                              errorMsg = '修改稿件时发生错误，名称重复！';
                          }
                          messengerService.error(errorMsg);
                      }
                  });
          }


          /*稿件提交*/
          $scope.btnSubmit = function (template) {
              console.log(template)
              if (template.previewImg == null || template.previewImg == "") {
                  messengerService.confirm("请先上传预览图片!", function (confirm) {
                  }, $scope);
              } else {
                  messengerService.confirm("是否确定要上架稿件?", function (confirm) {
                      if (confirm == true) {
                          template.operation = "ApplyShelve";
                          manuscriptService.submitManuscript(template,
                              function (result) {
                                  if (result.code == 200) {
                                      messengerService.success("上架成功");
                                      $scope.refreshList();
                                  }
                              });
                      }
                  }, $scope);
              }
          }

          $scope.btnCancel = function (template) {
              messengerService.confirm("是否确定要下架稿件?", function (confirm) {
                  if (confirm == true) {
                      template.operation = "UnShelve";
                      manuscriptService.submitManuscript(template,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("下架成功");
                                  $scope.refreshList();
                              }
                          });
                  }
              }, $scope);
          }

          $scope.imageInfo = {};
          /*上传预览图片*/
          $scope.uploadImage = function (template) {
              $scope.imageInfo = template;
          }

          $scope.$on("uploadImageCallback", function (e, data) {
              if (data) {
                  $scope.imageInfo.imgStream = data[0].src;
                  $scope.imageInfo.imgSuffix = data[0].suffix;
                  $scope.imageInfo.operation = "UploadImg";
                  console.log($scope.imageInfo)
                  manuscriptService.submitManuscript($scope.imageInfo, function (result) {
                      if (result.code == 200) {
                          $scope.createFormData.previewImg1 = $scope.host + result.dataObject.previewImg;
                          messengerService.success("上传成功")
                          $scope.refreshList();
                      }
                  });
              }
          });



          /*删除*/
          $scope.deleteManuscript = {};
          $scope.remark = "";
          $scope.btnDelete = function (template) {
              $scope.remark = "";
              $scope.isDelete = true;
              $scope.deleteManuscript = template;
              $http.get("/views/templates/management-manuscript-info.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "删除",
                      template: result
                  }, $scope);
              });
          }
          /*删除*/
          $scope.btnDeleteManus = function ($event) {
              var data = {
                  id: $scope.deleteManuscript.id,
                  remark: $scope.remark,
                  isRadicalDelete: false
              }
              manuscriptService.deleteManuscript(data,
                function (result) {
                    if (result.code == 200) {
                        messengerService.success("删除成功");
                        $scope.refreshList();
                    }
                });
              $scope.btnClose($event);
          }

          /*关闭删除框*/
          $scope.btnClose = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*复制*/
          $scope.copyManuscriptInfo = function (template) {
              $scope.createFormData = angular.copy(template);
              $scope.OriginalSKID = template.sKID;
              $scope.createFormData.edit = true;
              $scope.createFormData.terminal = template.webType;
              $scope.createFormData.editIndustryName = template.industryName;
              $scope.createFormData.editNumber = template.number;
              $http.get("/views/templates/management-manuscript-create.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "复制",
                      template: result
                  }, $scope);
              });
              $($scope.industryList).each(function (i, val) {
                  if (val.key == template.sKID) {
                      $scope.createFormData.industry = $scope.industryList[i];
                  }
              });

          }

          /*稿件状态切换*/
          $scope.showStatus = true;
          $scope.manuscriptStatus = "";/*状态*/
          $scope.switchStatue = function ($event, statue) {
              var html = "<s class='active'><i></i></s>";
              $scope.manuscriptInfo.webType = "";
              $scope.manuscriptInfo.styleClass = "";
              $scope.manuscriptInfo.industry = "";
              $scope.manuscriptInfo.color = "";
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.manuscriptInfo.key = "";
              $scope.manusKeyword = "";
              $scope.manuscriptInfo.isRemoved = false;
              $scope.manuscriptInfo.status = "";
              $scope.manuscriptStatus = statue;
              $($event.currentTarget).addClass("active").siblings().removeClass("active");
              $($event.currentTarget).parent().find("s.active").remove();
              $($event.currentTarget).find("a").append(html);
              $scope.refreshList();
              if ($scope.manuscriptStatus === "") {
                  scope.showStatus = true;
              } else {
                  $scope.showStatus = false;
              }
          }

          /*刷新列表*/
          $scope.templatePage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };
          /*关键字*/
          $scope.manusKeyword = "";
          $scope.manuscriptInfo = {
              webType: "",
              styleClass: "",
              industry: "",
              color: "",
              lastEditTime: "",
              key: "",
              status: "",
              isRemoved: false
          }
          $scope.refreshList = function () {
              var loginInfo = loginService.getLoginInfo(), data = {};
              data = {
                  pageIndex: $scope.templatePage.pageIndex,
                  pageSize: $scope.templatePage.pageSize,
                  id: "",
                  number: "",
                  webType: $scope.manuscriptInfo.webType,
                  isDelete: false,
                  title: "",
                  editor: loginInfo.userName,
                  styleClass: $scope.manuscriptInfo.styleClass,
                  sKID: $scope.manuscriptInfo.key,
                  color: $scope.manuscriptInfo.color,
                  lastEditTime: $scope.manuscriptInfo.lastEditTime,
                  lastUploadTime: "",
                  prcoessStatus: $scope.manuscriptStatus,
                  keyword: $scope.manusKeyword,
                  isRemoved: $scope.manuscriptInfo.isRemoved
                  //   templateType: $scope.manuscriptInfo.templateType
              }
              manuscriptService.getList(data,
                    function (result) {
                        $scope.templateList = result.dataList;
                        $scope.templatePage.total = result.totalCount;
                    }
                );
          }
          /*条件查询*/
          $scope.queryList = function () {
              $scope.showStatus = true;
              $scope.manusKeyword = "";
              $scope.manuscriptInfo.lastEditTime = $("#datetimepickerMauscript").val();
              if ($scope.manuscriptInfo.industry != "" && $scope.manuscriptInfo.industry != null) {
                  $scope.manuscriptInfo.key = $scope.manuscriptInfo.industry.key;
              } else {
                  $scope.manuscriptInfo.key = "";
              }
              if ($scope.manuscriptInfo.status === "Removed") {
                  $scope.manuscriptInfo.isRemoved = true;
                  $scope.manuscriptStatus = "";
              } else {
                  $scope.manuscriptStatus = $scope.manuscriptInfo.status;
                  $scope.manuscriptInfo.isRemoved = false;
              }
              $scope.refreshList();
          }

          /*关键字查询*/
          $scope.keyword = function () {
              $scope.manuscriptInfo.webType = "";
              $scope.manuscriptInfo.styleClass = "";
              $scope.manuscriptInfo.industry = "";
              $scope.manuscriptInfo.color = "";
              $scope.manuscriptInfo.lastEditTime = "";
              $scope.manuscriptInfo.key = "";
              //     $scope.manuscriptInfo.templateType = "";
              $scope.refreshList();
          }

          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshList();
          }


          $scope.logManuscriptInfo = function (template) {
              storage.session.set("manuscript_kid", template.sKID);
              window.open("../#/framework?templateid=" + template.number);
          }

          $scope.refreshList();

          $scope.$on("refreshManuscriptList", function () {
              $scope.refreshList();
          });
      }
  ]);
