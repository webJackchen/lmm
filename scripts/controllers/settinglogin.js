'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingformCtrl
 * @description
 * # SettingformCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingLoginCtrl', ["$scope", "$element", "$http", "lanhWindow",
      function ($scope, $element, $http, lanhWindow) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = _currentObj[property];
          }

          var orderRegisterFields = function () {
              $scope.data.registerFields.sort(function (a, b) { return b.sort - a.sort; });
          }

          orderRegisterFields();
          $scope.btnAdd = function () {
              $http.get("/views/settings/registerfield.tpl.html")
                  .success(function (result) {
                      lanhWindow.create({
                          title: "注册信息",
                          template: result,
                          open: loadRegisterField
                      }, $scope);
                  });
          }

          var isExistsRegisterField = function (obj) {
              var arr = $.grep($scope.data.registerFields, function (field, index) {
                  return field.key === obj.alias[0];
              });

              return arr && arr.length > 0;
          }

          var loadRegisterField = function () {
              $http.get(lanh.apiPath + "/proxy/registerfield").success(function (result) {
                  var _result = JSON.parse(result.jsonText);
                  var _items = _result.channel.item;
                  if (!angular.isArray(_result.channel.item) && angular.isObject(_result.channel.item)) {
                      _items = [_result.channel.item];
                  }
                  $.each(_items, function (i, v) {
                      if (!isExistsRegisterField(v)) {
                          var item = [];
                          if (v.default && v.default.value && v.default.value.length > 0) {
                              $.each(v.default.value, function (index, obj) {
                                  item.push({ "text": obj.text });
                              })
                          }

                          $scope.data.registerFields.push({
                              "key": v.alias[0],
                              "title": v.title.text,
                              "required": v.isNotNull == "1",
                              "type": v.type,
                              "default": false,
                              "selected": false,
                              'sort': 0,
                              "display": true,
                              "item": item
                          });
                      }
                  });
                  orderRegisterFields();
              });
          }

          $scope.changeDisplay = function (field) {
              field.display = !field.display;
              field.sort = 0;
          }

          $scope.changeRequired = function (field) {
              field.required = !field.required;
          }

          $scope.changeDeleted = function (field) {
              field.selected = !field.selected;
          }

          /*关闭选择注册信息*/
          $scope.btnCloseRegisterfield = function ($event) {
              $($event.currentTarget).parents(".lanh-modal").dialog("close");
          }

          $scope.btnOK = function () {
              orderRegisterFields();
              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, {
                  data: $scope.data, template: $scope.template, style: $scope.style
              });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
