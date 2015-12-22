'use strict';

/**
 * @ngdoc function
 * @name lanhKdesignApp.controller:SettingtextCtrl
 * @description
 * # SettingtextCtrl
 * Controller of the lanhKdesignApp
 */
angular.module('lanhKdesignApp')
  .controller('SettingtextCtrl', ['$scope', '$element',
      function ($scope, $element) {
          $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
          ];

          var summernote = $element.find('.summernote').summernote({
              toolbar: [
                  ['style', ['style']],
                  ['font', ['bold', 'italic', 'underline', 'clear']],
                  // ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
                  ['fontname', ['fontname']],
                  ['fontsize', ['fontsize']],
                  ['color', ['color']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['height', ['height']],
                  ['table', ['table']],
                  ['insert', ['lanh_link', 'picture', 'hr']],
                  ['view', ['fullscreen', 'codeview']],
                  ['help', ['help']]
              ],
              lang: "zh-CN",
              height: 300,                 // set editor height
              minHeight: 200,             // set minimum height of editor
              maxHeight: 500,             // set maximum height of editor
              width: 900, //lilingna
              focus: true,                 // set focus to editable area after initializing summernote
          });

          $element.find('.summernote')
              .on('lanhlink.click', function (sender, e) {
                  if (e) {
                      var $editor = e.layoutInfo.editor(),
                          $editable = e.layoutInfo.editable(),
                          linkText = e.editor.createRange($editable),
                          linkInfo = e.editor.getLinkInfo($editable);

                      $scope.$broadcast('link.opensetting', {
                          editor: e.editor,
                          $editor: $editor,
                          $editable: $editable,
                          linkText: linkText,
                          linkInfo: linkInfo
                      });
                  }
              });

          var data = $scope.data = {
              settingContext: '请输入文字'
          };


          $scope.$on("linkCallback", function (e, linkData) {
              var args = linkData.editorArgs, linkInfo;
              if (args) {
                  if (args.linkText) {
                      linkInfo = $.extend(args.linkInfo, {
                          url: linkData.value, text: args.linkText.toString(), newWindow: linkData.isNewWindow
                      });
                  }
                  args.editor.createLink(args.$editable, linkInfo, args.$editor.data('options'));
              }
          });

          //*********以下代码可以通用*********
          //$scope.$parent.model[$scope.$parent.currentId] 固定对象, 获取当前元素对象
          var _currentObj = angular.copy($scope.$parent.model[$scope.$parent.currentId]);
          for (var property in _currentObj) {
              $scope[property] = $.extend($scope[property], _currentObj[property]);
          }

          if (data.settingContext) $element.find('.summernote').code(data.settingContext);

          $scope.applySetting = function () {
              data.settingContext = $element.find('.summernote').code();
              $scope.$parent.$broadcast("framework.setting." + $scope.$parent.currentId, { data: $scope.data });
              $element.parent().dialog("close");
          }
      }]);
