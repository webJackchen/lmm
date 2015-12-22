'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:bindHtmlUnsafe
 * @description
 * # bindHtmlUnsafe
 */
angular.module('lanhKdesignApp')
  .directive('bindHtmlUnsafeNew', ["$compile",
      function ($compile) {
          return {
              link: function postLink($scope, $element, attrs) {
                  var compile = function (newHTML) { // Create re-useable compile function
                      if (newHTML) {
                          if (newHTML.indexOf('<') !== 0) newHTML = '<span>' + newHTML + '</span>';
                          newHTML = $compile(newHTML)($scope); // Compile html
                          $element.html('').append(newHTML); // Clear and append it
                      }
                  };

                  var htmlName = attrs.bindHtmlUnsafeNew,
                      oldHtml = $element.html(); // Get the name of the variable 
                  // Where the HTML is stored

                  $scope.$watch(htmlName, function (newHTML) { // Watch for changes to 
                      // the HTML
                      //console.log(newHTML);
                      compile(newHTML || oldHtml);   // Compile it
                  });
              }
          };
      }
  ]);
