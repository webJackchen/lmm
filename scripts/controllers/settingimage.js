'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingimageCtrl
 * @description
 * # SettingimageCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingImageCtrl', ["$scope", "$element", "baseService",
      function ($scope, $element, baseService) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }

          $scope.isCompontent = true; 
          $scope.$emit("framework.get.editorInfo", function (result) {
              $scope.isCompontent = result.type != "component"
          });


          $scope.data = $.extend({
              src: "../../images/no_image_220x220.jpg",
              target: "_self",
              href: "javascript:void(0);",
              value: "",
              selected: "javascript:void(0);",
              position: 'center',
              customlinkData:'http://',
              customlink: false
          }, $scope.data);


          if (!!$scope.data.href) {
              $scope._hrefName = $scope.data.href;
          }

          var list = [
             {
                 text: '无链接',
                 href: 'javascript:void(0);'
             }, {
                 text: '自定义链接',
                 href: 'customlink'
             }];

          baseService.get('proxy', { isSection: true }).then(function (result) {
              var kplusObj = result.jsonText && JSON.parse(result.jsonText) || {},
              dataList = kplusObj.channel.item;
              if (dataList != "0") {
                  $scope.data.value = getLinkListData(dataList);
              } else {
                  $scope.data.value = list;
              }
          });

          
          var getLinkListData = function (menu) {
              if (!angular.isArray(menu)) {
                  menu = [menu];
              }
              if (menu.length > 0) {
                  for (var i = 0; i < menu.length; i++) {
                      var menuIte = menu[i],
                          parentItem = {
                              text: menuIte.title.text,
                              href: "/web" + menuIte.url
                          };
                      if (menuIte.title.text == "首页")
                          parentItem.href = "/web/default.html";
                      list.push(parentItem);
                      if (menuIte.item) {
                          if (!angular.isArray(menuIte.item)) {
                              menuIte.item = [menuIte.item];
                          }
                          var menuItem = menuIte.item;
                          for (var j = 0; j < menuItem.length; j++) {
                              var childItem = menuItem[j];
                              menuItem[j].selected = false;
                              list.push({
                                  text: "└─  " + childItem.title.text,
                                  href: "/web" + childItem.url
                              });
                          }
                      }
                  }
              }
              return list;
          }
          //image manage控件的回调事件
          $scope.$on("selectedImage", function (e, selected) {
              if (!!selected) {
                  $scope.data.src = selected.srcTrue;
              }
          });

          $scope.$on("linkCallback", function (e, linkData) {

              $scope._linkData = linkData;
              $scope.data.href = linkData.value;
              //$scope._hrefName = linkData.title;
              $scope._hrefName = linkData.title || linkData.value;

              $scope.data = $.extend(linkData, $scope.data, { type: linkData.type, value: linkData.value });
          });

          $scope.imgSize = function () {
              if ($scope.data.position == "center")
                  $scope.data.style = "max-width:100%;max-height:100%;";
              else
                  $scope.data.style = "width:100%;height:100%;";
          }

          $scope.imgLink = function () {
              if ($scope.data.selected == "customlink") {
                  $scope.data.customlink = true;
                  $scope.data.href = "";
              } else {                  
                  $scope.data.href = $scope.data.selected;
                  $scope.data.selected = $scope.data.selected;
                  $scope.data.customlink = false;
              }
          }

          $scope.customlinkData = function () {
              $scope.data.href = $scope.data.customlinkData;
          }

          $scope.btnOK = function () {
              //固定实现, 触发该事件传递设定对象给目标元素
              console.log($scope.data.target);
              if ($scope.data.href == "") {
                  window.alert('自定义链接不能为空！');
              }
              else {
                  $scope.data._href = "";
                  $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, {
                      data: $scope.data, template: $scope.template, style: $scope.style
                  });

                  $element.parent().dialog("close");    //固定方法, 关闭弹窗.
              }
          }
      }
  ]);
