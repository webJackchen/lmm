'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:locationSizeManage
 * @description
 * # locationSizeManage
 */
angular.module('lanhKdesignApp')
  .directive('locationSizeManage',["$compile", "$http", "$timeout", "lanhWindow",
      function ($compile, $http, $timeout, lanhWindow) {
          return {
              templateUrl: "../../views/common/locationsizemanage.tpl.html",
              restrict: 'E',
              link: function postLink($scope, $element, attrs) {
              }
          };
      }
  ]);
