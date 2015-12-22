'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:RecyleCtrl
 * @description
 * # ManuscriptCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('ComponentCtrl', ["$scope", "$element", "recyleService", "loginService", "lanhWindow", "messengerService", "componentService", "$http", "$location", "storage",
      function ($scope, $element, recyleService, loginService, lanhWindow, messengerService, componentService, $http, $location, storage) {
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
              $scope.componentCondition.editTime = "";
              $(event.target).closest(".datetimepicker").find("input").val("");
          }

          $scope.styleData = {
              status: true,
              isDelete: false
          }

          $scope.host = lanh.apiHost;


          /*toggle 更多条件*/
          $scope.moreCondition = false;
          $scope.showMoreCondition = function () {
              $scope.moreCondition = !$scope.moreCondition;
          }


          $scope.roleStatus = {
              role: loginService.getLoginInfo().role,
              isKplusUser: storage.session.get("isKplusUser")
          }

          /*新建*/
          $scope.createComponent = function () {
              $scope.createFormData = {
                  title: "",
                  type: "Web",
                  description: ""
              }
              $http.get("/views/templates/management-component-create.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "基本设置",
                      template: result
                  }, $scope);
              });
          }

          $scope.createFormData = {
              title: "",
              type: "Web",
              description: ""
          }
          $scope.btnCreate = function ($event) {
              var loginInfo = loginService.getLoginInfo();
              $scope.createFormData.creator = loginInfo.userName;
              if ($scope.createFormData.title == "") {
                  $($event.currentTarget).parents(".lanh-modal").find("#componentTitle").focus();
                  messengerService.success("组件名称不能为空");
              } else {
                  componentService.createComponent($scope.createFormData,
                     function (result) {
                         if (result.code == 200) {
                             messengerService.success("创建组件成功");
                         } else {
                             var errorMsg = '创建组件时发生错误。';
                             /*是否重复Title提示*/
                             if (result.dataObject.isDuplicateTitle) {
                                 errorMsg = '创建组件失败，名称重复！';
                             }
                             messengerService.error(errorMsg);
                         }
                         $scope.refreshList();
                     }
                 );
                  $($event.currentTarget).parents(".lanh-modal").dialog("close");
              }
          }

          /*删除提示框*/
          $scope.deleteData = {};
          $scope.deleteRemark = "";
          $scope.deleteDialog = function (component) {
              $scope.remark = "";
              $scope.isDelete = true;
              $scope.deleteData = component;
              $http.get("/views/templates/management-component-info.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "删除",
                      template: result
                  }, $scope);
              });
          }

          /*删除*/
          $scope.deleteComponent = function ($event) {
              var data = {
                  id: $scope.deleteData.id,
                  deleteRemark: $scope.deleteRemark,
                  isRadicalDelete: false
              }
              componentService.deleteComponent(data,
                          function (result) {
                              if (result.code == 200) {
                                  messengerService.success("删除成功");
                              } else {
                                  messengerService.success("删除成功");
                              }
                              $scope.refreshList();
                          });
              $scope.btnClose($event);
          }

          /*关闭删除框*/
          $scope.btnClose = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          /*复制列表*/
          $scope.copyAllManuscript = function () {
              $http.get("/views/templates/management-component-shelve.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "组件库",
                      template: result
                  }, $scope);
              });
          }

          /*复制*/
          $scope.componentInfo = {};
          $scope.copyComponent = function (component) {
              $scope.seeInfo = false;/*区别查看和复制*/
              var data = angular.copy(component);
              $scope.componentInfo.title = data.title;
              $scope.componentInfo.type = data.type;
              $scope.componentInfo.description = data.description;
              $scope.componentInfo.componentId = data.componentId;
              $http.get("/views/templates/management-component-info.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "基本设置",
                      template: result
                  }, $scope);
              });
          }
          /*保存复制信息*/
          $scope.uploadInfo = function ($event) {
              var loginInfo = loginService.getLoginInfo();
              $scope.componentInfo.creator = loginInfo.userName;
              if ($scope.seeInfo) {/*查看编辑*/
                  $scope.componentInfo.operation = "Edit";
                  componentService.uploadInfo($scope.componentInfo,
                    function (result) {
                        if (result.code == 200) {
                            messengerService.success("编辑成功");
                            $scope.refreshList();
                            $scope.isdelete = "false";
                        } else {
                            var errorMsg = '编辑失败。';
                            /*是否重复Title提示*/
                            if (result.dataObject.isDuplicateTitle) {
                                errorMsg = '编辑失败，名称重复！';
                            }
                            messengerService.error(errorMsg);
                        }
                    }
                );
              } else {/*复制*/
                  //$scope.componentInfo.operation = "Copy";
                  componentService.copyComponent($scope.componentInfo,
                     function (result) {
                         if (result.code == 200) {
                             messengerService.success("复制成功");
                             $scope.refreshList();
                         } else {
                             var errorMsg = '复制组件时发生错误。';
                             /*是否重复Title提示*/
                             if (result.dataObject.isDuplicateTitle) {
                                 errorMsg = '复制组件失败，名称重复！';
                             }
                             messengerService.error(errorMsg);
                         }
                     }
                 );
                  $($event.currentTarget).parents(".lanh-modal").dialog("close");
              }
          }

          /*查看*/
          $scope.seeComponent = function (component) {
              $scope.seeInfo = true;/*区别查看和复制*/
              $scope.isdelete = "false";
              $scope.componentInfo = angular.copy(component);
              if ($scope.componentInfo.type == "Web") {
                  $scope.componentInfo.type1 = "PC";
              } else if ($scope.componentInfo.type == "Wap") {
                  $scope.componentInfo.type1 = "MB";
              }
              if ($scope.componentInfo.previewImg) {
                  $scope.componentInfo.previewImg = $scope.host + $scope.componentInfo.previewImg;
              }
              $http.get("/views/templates/management-component-info.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "基本设置",
                      template: result
                  }, $scope);
              });
          }

          /*编辑*/
          $scope.editComponentInfo = function (component) {
              component.editAction = "InEdit";
              componentService.uploadInfo(component,
                    function (result) {
                        $scope.refreshList();
                    }
                );
              console.log(component)
              window.open("../#/framework?componentid=" + component.componentId);

          }

          /*上传图片*/
          $scope.uploadImage = function (component) {
              $scope.condition = component;
              $scope.condition.operation = "UploadImg";
              $scope.condition.isCategory = "componentUpload";
              $http.get("../../views/templates/management-style-image.tpl.html")
                  .success(function (result) {
                      lanhWindow.create({
                          title: "图片管理",
                          template: result
                      }, $scope);
                  });
          }

          $scope.imageInfo = {};
          /*上传预览图片*/
          $scope.uploadImage = function (component) {
              $scope.imageInfo = component;
          }

          $scope.$on("uploadImageCallback", function (e, data) {
              if (data) {
                  $scope.imageInfo.imgStream = data[0].src;
                  $scope.imageInfo.imgSuffix = data[0].suffix;
                  $scope.imageInfo.operation = "UploadImg";
                  componentService.uploadInfo($scope.imageInfo, function (result) {
                      if (result.code == 200) {
                          $scope.componentInfo.previewImg = $scope.host + result.dataObject.previewImg;
                          messengerService.success("上传成功")
                          $scope.refreshList();
                      }
                  });
              }
          });


          /*申请上架*/
          $scope.componentShelve = function (component) {
              if (component.previewImg == null || component.previewImg == "") {
                  messengerService.confirm("请先上传预览图片!", function (confirm) {
                  }, $scope);
              } else {
                  messengerService.confirm("是否确定要申请上架?", function (confirm) {
                      if (confirm == true) {
                          component.operation = "ApplyShelve";
                          component.prcoessStatus = 'Check';
                          componentService.uploadInfo(component,
                             function (result) {
                                 if (result.code == 200) {
                                     messengerService.success("申请上架成功");
                                     $scope.refreshList();
                                 } else {
                                     messengerService.success("申请上架失败");
                                 }
                             }
                         );
                      }
                  }, $scope);
              }
          }

          /*上架*/
          $scope.checkSuccess = function (component) {
              messengerService.confirm("是否确定要上架?", function (confirm) {
                  if (confirm == true) {
                      component.operation = "Shelve";
                      component.prcoessStatus = 'Active';
                      componentService.uploadInfo(component,
                         function (result) {
                             if (result.code == 200) {
                                 messengerService.success("上架成功");
                                 $scope.refreshList();
                             } else {
                                 messengerService.success("上架失败");
                             }
                         }
                     );
                  }
              }, $scope);
          }

          /*拒绝上架*/
          $scope.checkFailure = function (component) {
              $scope.opinion = "";
              $scope.process = "failure";
              $scope.processInfo = component;
              $http.get("/views/templates/management-audit.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "审核",
                      template: result
                  }, $scope);
              });
          }

          $scope.opinion = "";
          $scope.btnOpinion = function ($event) {
              if ($scope.opinion == "" || $scope.opinion == null) {
                  $($event.currentTarget).parent().siblings(".opinion").find("textarea").focus();
              } else {
                  $scope.processInfo.operation = "RejectShelve";
                  $scope.processInfo.prcoessStatus = 'CheckFailed';
                  $scope.processInfo.CheckFailedRemark = $scope.opinion;
                  componentService.uploadInfo($scope.processInfo,
                    function (result) {
                        if (result.code == 200) {
                            messengerService.success("提交成功");
                            $scope.refreshList();
                        } else {
                            messengerService.success("提交失败");
                        }
                    });
                  $scope.btnClose($event);
              }
          }

          /*获取用户列表*/
          loginService.getUserInfo(function (result) {
              $scope.userInfo = result.dataList;
              for (var i = 0; i < $scope.userInfo.length; i++) {
                  if ($scope.userInfo[i].loginName === loginService.getLoginInfo().userName) {
                      $scope.userInfo.splice(i, 1);
                  }
              }
          });


          /*下架*/
          $scope.componentInfoShelve = {
              unShelveRemark: "0",
              editor: ""
          }

          $scope.unShelve = function (component) {
              $scope.process = "unshelve";
              $scope.componentInfoShelve.editor = "";
              $scope.processInfo = component;
              $http.get("/views/templates/management-component-unShevle.tpl.html")
              .success(function (result) {
                  lanhWindow.create({
                      title: "下架",
                      template: result
                  }, $scope);
              });
          }
          /*下架确认按钮*/
          $scope.btnUnShelve = function ($event) {
              if ($scope.componentInfoShelve.unShelveRemark === "0") {
                  $scope.processInfo.operation = "UnShelve";
              } else if ($scope.componentInfoShelve.unShelveRemark === "1") {
                  $scope.processInfo.operation = "ReturnToEditor";
              } else if ($scope.componentInfoShelve.unShelveRemark === "2") {
                  $scope.processInfo.editor = $scope.componentInfoShelve.editor;
                  $scope.processInfo.operation = "Assign";
              }
              componentService.uploadInfo($scope.processInfo,
                  function (result) {
                      if (result.code == 200) {
                          messengerService.success("下架成功");
                          $scope.refreshList();
                          $($event.currentTarget).parents(".lanh-modal").dialog("close");
                      }
                  });
          }

          /*状态切换*/
          $scope.changeStatus = function ($event, status) {
              $scope.componentCondition.prcoessStatus = status;
              $scope.componentStatus = "";
              $scope.componentCondition.isRemoved = false;

              var html = "<s class='active'><i></i></s>";
              $($event.currentTarget).addClass("active").siblings().removeClass("active");
              $($event.currentTarget).parent().find("s.active").remove();
              $($event.currentTarget).find("a").append(html);

              $scope.refreshList();
          }

          $scope.componentKeyword = "";
          $scope.componentStatus = "";

          $scope.componentPage = {
              total: 0,
              pageIndex: 1,
              pageSize: 12
          };

          $scope.componentCondition = {
              type: "Web",
              prcoessStatus: "",
              title: "",
              editTime: "",
              isRemoved: false,
          };

          $scope.refreshList = function () {
              var data = {}, loginInfo = loginService.getLoginInfo();
              if ($scope.componentStatus == "") {
                  $scope.componentStatus = $scope.componentCondition.prcoessStatus;
              }

              if (!$scope.roleStatus.isKplusUser && $scope.roleStatus.role == 'admin') {
                  if ($scope.componentCondition.prcoessStatus == '') {
                      $scope.componentStatus = "Check";
                  }
                  data = {
                      pageIndex: $scope.componentPage.pageIndex,
                      pageSize: $scope.componentPage.pageSize,
                      editor: "",
                      prcoessStatus: $scope.componentStatus,
                      type: $scope.componentCondition.type,
                      keyWord: $scope.componentKeyword,
                      editTime: $scope.componentCondition.editTime || "",
                      isRemoved: $scope.componentCondition.isRemoved,
                      isDelete: false
                  };
              } else {
                  data = {
                      pageIndex: $scope.componentPage.pageIndex,
                      pageSize: $scope.componentPage.pageSize,
                      editor: loginInfo.userName,
                      prcoessStatus: $scope.componentStatus,
                      type: $scope.componentCondition.type,
                      keyWord: $scope.componentKeyword,
                      editTime: $scope.componentCondition.editTime || "",
                      isRemoved: $scope.componentCondition.isRemoved,
                      isDelete: false
                  };
              }
              if ($scope.componentCondition.isRemoved == true && $scope.componentCondition.prcoessStatus == "") {
                  $scope.componentStatus = "Removed";
              }
              componentService.getList(data,
                  function (result) {
                      console.log(result)
                      $scope.componentList = result.list;
                      $scope.componentPage.total = result.totalCount;
                  }
              );
          }

          /*分页查询*/
          $scope.pageChanged = function () {
              $scope.refreshList();
          }

          /*关键字查询*/
          $scope.searchKeyword = function () {
              $scope.refreshList();
          }

          /*条件查询*/
          $scope.searchCondition = function () {
              $scope.componentKeyword = "";
              if ($scope.componentStatus === "Removed") {
                  $scope.componentCondition.prcoessStatus = "";
                  $scope.componentStatus = "";
                  $scope.componentCondition.isRemoved = true;
              } else {
                  $scope.componentCondition.isRemoved = false;
              }
              $scope.refreshList();
          }

          $scope.$on("refreshComponentList", function () {
              $scope.refreshList();
          });
      }

  ]);
