'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingglobalCtrl
 * @description
 * # SettingglobalCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingglobalCtrl', ['$scope', '$element',
      function ($scope, $element) {
          this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];
          var data = $scope.data = {
              turnedPurchase: 'false',
              turnedOrder: 'false',
              turnedArticleComments: 'false',
              turnedJobApplication: 'false'
          };

          if ($scope.$parent.turnedOptions) {
              for (var prop in data) {
                  if ($scope.$parent.turnedOptions[prop] !== undefined) {
                      $scope.data[prop] = $scope.$parent.turnedOptions[prop].toString();
                  }
              }
          }
          $scope.btnOK = function () {
              $scope.$parent.turnedOptions = $scope.data;
              $element.parent().dialog("close");
          }
      }]);
