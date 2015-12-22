'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingformCtrl
 * @description
 * # SettingformCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingFormCtrl', ["$scope", "$element", "$http",
      function ($scope, $element, $http) {
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

          $scope.data = $.extend({
              title: "",
              verificationCode: "1",
              link: "",
              form: null
          }, $scope.data);

          $http.get(lanh.apiPath + "/proxy?isForm=true").success(function (result) {
              var _result = JSON.parse(result.jsonText),
                  item = [];
              if (!!_result && !!_result.channel && !!_result.channel.item) {
                  item = _result.channel.item;
                  if (!angular.isArray(_result.channel.item) && angular.isObject(_result.channel.item)) {
                      item = [_result.channel.item];
                  }
                  if (angular.isArray(item))
                      $scope.formList = item;
              }
          });

          var reLoadMulitControl = function (formFileds) {
              $(formFileds || []).each(function () {
                  if (this.type === 'checkbox' || this.type === 'radio') {
                      if (!this.source) this.source = [];
                      for (var i = 0, arr = this.default.text.split(',') ; i < arr.length;) {
                          this.source.push({
                              text: arr[i],
                              number: (++i).toString()
                          });
                      }
                  }
              });
          }

          $scope.btnOK = function () {
              debugger
              $scope.data.form = $.grep($scope.formList, function (n) { return n.link.text == $scope.data.link })[0];
              console.log($scope.data.form);

              if (!angular.isArray($scope.data.form.questions.item) && angular.isObject($scope.data.form.questions.item)) {
                  $scope.data.form.questions.item = [$scope.data.form.questions.item];
              }
              reLoadMulitControl($scope.data.form.questions.item);

              //固定实现, 触发该事件传递设定对象给目标元素
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, {
                  data: $scope.data, template: $scope.template, style: $scope.style
              });

              $element.parent().dialog("close");    //固定方法, 关闭弹窗.
          }
      }
  ]);
