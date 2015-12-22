'use strict';

/**
 * @ngdoc directive
 * @name lanhKdesignApp.directive:photoGalleryManage
 * @description
 * # photogallerymanage
 */
angular.module('lanhKdesignApp')
  .directive('photoGalleryManage', ["$http", "$timeout", "lanhWindow", "$compile",
      function ($http, $timeout, lanhWindow, $compile) {
          return {
              template: '<button class="btn btn-primary" ng-click="selectPhotoGallery()">{{ _title }}</button>',
              restrict: 'E',
              scope: true,
              link: function postLink($scope, $element, attrs) {
                  /*
                    attrs:
                        title           //按钮名称
                        callback        //点击确定回调事件名称 (仅仅是名称，不加括号）
                  */

                  $scope._title = attrs.title || "图集管理";

                  $scope.selectPhotoGallery = function () {
                      $http.get("/views/common/photogallerymanage.tpl.html")
                          .success(function (result) {
                              lanhWindow.create({
                                  title: "图集设置",
                                  template: result
                              }, $scope);
                          });
                  }

                  $scope.btnToggleImage = function (image) {
                      image.focus = image.focus == "on" ? "" : "on";
                  }

                  var _jssorTemplate = "<div u=\"slides\" style=\"cursor: move; position: absolute; left: 0px; top: 0px; width: 523px; height: 120px; overflow: hidden;\">\
                                              <div ng-repeat=\"image in thumbnails\"><img u=\"image\" ng-src=\"{{ image.src }}\" title=\"{{ image.title }}\" /></div>\
                                          </div>\
                                          <span u=\"arrowleft\" class=\"jssora03l\" style=\"top: 123px; left: 8px;\">\
                                          </span>\
                                          <span u=\"arrowright\" class=\"jssora03r\" style=\"top: 123px; right: 8px;\">\
                                          </span>";
                  var _initJssor = function () {
                      if (!!$scope.thumbnails && $scope.thumbnails.length > 0) {
                          $("#photogallery_container").html($compile(_jssorTemplate)($scope));
                          $timeout(function () {
                              var jssor_slider1 = new $JssorSlider$('photogallery_container', {
                                  $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
                                  $AutoPlaySteps: 4,                                  //[Optional] Steps to go for each navigation request (this options applys only when slideshow disabled), the default value is 1
                                  $AutoPlayInterval: 4000,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
                                  $PauseOnHover: 1,                               //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

                                  $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
                                  $SlideDuration: 160,                                //[Optional] Specifies default duration (swipe) for slide in milliseconds, default value is 500
                                  $MinDragOffsetToSlide: 20,                          //[Optional] Minimum drag offset to trigger slide , default value is 20
                                  $SlideWidth: 120,                                   //[Optional] Width of every slide in pixels, default value is width of 'slides' container
                                  //$SlideHeight: 150,                                //[Optional] Height of every slide in pixels, default value is height of 'slides' container
                                  $SlideSpacing: 3, 					                //[Optional] Space between each slide in pixels, default value is 0
                                  $DisplayPieces: 4,                                  //[Optional] Number of pieces to display (the slideshow would be disabled if the value is set to greater than 1), the default value is 1
                                  $ParkingPosition: 0,                              //[Optional] The offset position to park slide (this options applys only when slideshow disabled), default value is 0.
                                  $UISearchMode: 1,                                   //[Optional] The way (0 parellel, 1 recursive, default value is 1) to search UI components (slides container, loading screen, navigator container, arrow navigator container, thumbnail navigator container etc).
                                  $PlayOrientation: 1,                                //[Optional] Orientation to play slide (for auto play, navigation), 1 horizental, 2 vertical, 5 horizental reverse, 6 vertical reverse, default value is 1
                                  $DragOrientation: 1,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)

                                  $BulletNavigatorOptions: {                                //[Optional] Options to specify and enable navigator or not
                                      $Class: $JssorBulletNavigator$,                       //[Required] Class to create navigator instance
                                      $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                                      $AutoCenter: 0,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                                      $Steps: 1,                                      //[Optional] Steps to go for each navigation request, default value is 1
                                      $Lanes: 1,                                      //[Optional] Specify lanes to arrange items, default value is 1
                                      $SpacingX: 0,                                   //[Optional] Horizontal space between each item in pixel, default value is 0
                                      $SpacingY: 0,                                   //[Optional] Vertical space between each item in pixel, default value is 0
                                      $Orientation: 1                                 //[Optional] The orientation of the navigator, 1 horizontal, 2 vertical, default value is 1
                                  },

                                  $ArrowNavigatorOptions: {
                                      $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                                      $ChanceToShow: 1,                               //[Required] 0 Never, 1 Mouse Over, 2 Always
                                      $AutoCenter: 2,                                 //[Optional] Auto center navigator in parent container, 0 None, 1 Horizontal, 2 Vertical, 3 Both, default value is 0
                                      $Steps: 4                                       //[Optional] Steps to go for each navigation request, default value is 1
                                  }
                              });

                              function ScaleSlider() {
                                  var bodyWidth = document.body.clientWidth;
                                  if (bodyWidth)
                                      jssor_slider1.$ScaleWidth(Math.min(bodyWidth, 523));
                                  else
                                      window.setTimeout(ScaleSlider, 30);
                              }
                              ScaleSlider();
                          });
                      }
                  }

                  $scope.btnSelectPhoto = function () {
                      $http.get("/views/common/photogallerymanage-library.tpl.html")
                          .success(function (result) {
                              lanhWindow.create({
                                  title: "图集库",
                                  template: result,
                                  open: function () {
                                      _initJssor();
                                  }
                              }, $scope);
                          });
                  }

                  $scope.btnSelectedPhoto = function (photo) {
                      $.each($scope.photoList, function (i, _photo) {
                          _photo.focus = "";
                      });
                      photo.focus = "on";
                      $scope.thumbnails = photo.images;
                      _initJssor();
                  }

                  $scope.btnSelected = function ($event) {
                      var _selected = $.grep($scope.photoList, function (n) { return n.focus == "on" });
                      if (_selected.length > 0) {
                          $scope.selectedPhoto = angular.copy(_selected[0]);
                      } else {
                          $scope.selectedPhoto = {};
                      }

                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }

                  $scope.btnOK = function ($event) {
                      if (!!attrs.callback) {
                          $scope.$emit(attrs.callback, $scope.selectedPhoto);
                      }
                      $($event.currentTarget).parents(".lanh-modal").dialog("close");
                  }

                  //mock data
                  $scope.photoList = [{
                      src: "../../images/no_image_220x220.jpg",
                      title: "图集1",
                      desc: "图集1的说明",
                      focus: "",
                      images: [{
                          title: "图片1",
                          href: "link1",
                          desc: "图片1 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片2",
                          href: "link2",
                          desc: "图片2 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片3",
                          href: "link3",
                          desc: "图片3 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片4",
                          href: "link4",
                          desc: "图片4 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片5",
                          href: "link5",
                          desc: "图片5 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片6",
                          href: "link6",
                          desc: "图片6 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片7",
                          href: "link7",
                          desc: "图片7 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片8",
                          href: "link8",
                          desc: "图片8 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片9",
                          href: "link9",
                          desc: "图片9 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }]
                  }, {
                      src: "../../images/no_image_220x220.jpg",
                      title: "图集2",
                      desc: "图集2的说明, 图集2的说明, 图集2的说明, 图集2的说明, 图集2的说明",
                      focus: "",
                      images: [{
                          title: "图片5",
                          href: "link5",
                          desc: "图片5 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片6",
                          href: "link6",
                          desc: "图片6 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片7",
                          href: "link7",
                          desc: "图片7 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }, {
                          title: "图片8",
                          href: "link8",
                          desc: "图片8 desc",
                          src: "../../images/no_image_220x220.jpg",
                          focus: "on"
                      }]
                  }]

                  $scope.selectedPhoto = {}
              }
          };
      }
]);
