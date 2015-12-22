$(function () {
    var controlId = '_panelId_',
        _SlideshowTransitions = [
            {
                $Duration: 1200,
                x: 0.3,
                $During: {
                    $Left: [0.3, 0.7]
                },
                $Easing: {
                    $Left: $JssorEasing$.$EaseInCubic,
                    $Opacity: $JssorEasing$.$EaseLinear
                },
                $Opacity: 2
            }
        ],
        options = {
            $AutoPlay: true,                                    //[Optional] Whether to auto play, to enable slideshow, this option must be set to true, default value is false
            $AutoPlayInterval: 1500,                            //[Optional] Interval (in milliseconds) to go for next slide since the previous stopped if the slider is auto playing, default value is 3000
            $PauseOnHover: 1,                                //[Optional] Whether to pause when mouse over if a slider is auto playing, 0 no pause, 1 pause for desktop, 2 pause for touch device, 3 pause for desktop and touch device, 4 freeze for desktop, 8 freeze for touch device, 12 freeze for desktop and touch device, default value is 1

            $DragOrientation: 3,                                //[Optional] Orientation to drag slide, 0 no drag, 1 horizental, 2 vertical, 3 either, default value is 1 (Note that the $DragOrientation should be the same as $PlayOrientation when $DisplayPieces is greater than 1, or parking position is not 0)
            $ArrowKeyNavigation: true,   			            //[Optional] Allows keyboard (arrow key) navigation or not, default value is false
            $SlideDuration: 800,                                //Specifies default duration (swipe) for slide in milliseconds

            $SlideshowOptions: {                                //[Optional] Options to specify and enable slideshow or not
                $Class: $JssorSlideshowRunner$,                 //[Required] Class to create instance of slideshow
                $Transitions: _SlideshowTransitions,            //[Required] An array of slideshow transitions to play slideshow
                $TransitionsOrder: 1,                           //[Optional] The way to choose transition to play slide, 1 Sequence, 0 Random
                $ShowLink: true                                    //[Optional] Whether to bring slide link on top of the slider when slideshow is running, default value is false
            },

            $ArrowNavigatorOptions: {                       //[Optional] Options to specify and enable arrow navigator or not
                $Class: $JssorArrowNavigator$,              //[Requried] Class to create arrow navigator instance
                $ChanceToShow: 1                               //[Required] 0 Never, 1 Mouse Over, 2 Always
            },

            $ThumbnailNavigatorOptions: {                       //[Optional] Options to specify and enable thumbnail navigator or not
                $Class: $JssorThumbnailNavigator$,              //[Required] Class to create thumbnail navigator instance
                $ChanceToShow: 2,                               //[Required] 0 Never, 1 Mouse Over, 2 Always

                $ActionMode: 1,                                 //[Optional] 0 None, 1 act by click, 2 act by mouse hover, 3 both, default value is 1
                $SpacingX: 8,                                   //[Optional] Horizontal space between each thumbnail in pixel, default value is 0
                $DisplayPieces: 10,                             //[Optional] Number of pieces to display, default value is 1
                $ParkingPosition: 360                          //[Optional] The offset position to park thumbnail
            }
        },
        createSlider = function () {
            var container = $('#' + controlId),
                sliderDom = $('#' + controlId + ' .thumbnail-container'),
                attr = {
                    interval: sliderDom.data('interval'),
                    autoPlay: sliderDom.data('autoplay'),
                    actionmode: sliderDom.data('actionmode') == 'click' ? 1 : 2
                },
                parentOptions = {
                    width: container.width(),
                    height: container.height(),
                };
            if (sliderDom.find("[u='slides'] img").length == 0) return;
            options.$AutoPlayInterval = attr.interval;
            options.$AutoPlay = attr.autoPlay;
            options.$ThumbnailNavigatorOptions.$ActionMode = attr.actionmode;

            sliderDom.show();
            sliderDom.height(parentOptions.height);
            sliderDom.width(parentOptions.width);

            //兼容IE 11
            sliderDom.find(".thumbnail-region:first").width(parentOptions.width).height(parentOptions.height - 100);
            sliderDom.find("[u='thumbnavigator']").width(parentOptions.width).height(100);
            sliderDom.find("[u='thumbnavigator'] .thumbnail-region").width(parentOptions.width).height(100);


            //new $JssorSlider$(sliderDom.get(0), options);

            var jssorSlider = new $JssorSlider$(sliderDom.get(0), options),
                scaleSlider = function () {
                    if (parentOptions.width) {
                        jssorSlider.$ScaleWidth(Math.min(parentOptions.width, 1920));
                    }
                    else setTimeout(scaleSlider, 30);
                };
            $(window).unbind("load._panelId_").bind("load._panelId_", scaleSlider);
            $(window).unbind("resize._panelId_").bind("resize._panelId_", scaleSlider);
            $(window).unbind("orientationchange._panelId_").bind("orientationchange._panelId_", scaleSlider);
        },
        reloadThumbnail = function (sender, ctrlId) {
            if (controlId === ctrlId) {
                createSlider();
            }
        };
    setTimeout(createSlider, 300);

    // $(document)
    //     .off('gallery.thumbnail.reload._panelId_')
    //     .on('gallery.thumbnail.reload._panelId_', reloadThumbnail);
});
