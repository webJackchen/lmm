/*
Description: $.fn.dialog
Author: Kris Zhang
*/
; (function ($) {
    $.fn.dialog = function (options) {
        var self = this
          , $this = $(self)
          , $body = $(document.body)
          , $msgbox = $this.closest(".dialog")
          , parentDataName = "dialog-parent"
          , arg1 = arguments[1]
          , arg2 = arguments[2];

        var create = function () {
            var msghtml
              = '<div class="dialog modal fade" role="dialog" aria-labelledby="myModalLabel">'
              + '<div class="modal-dialog" role="document">'
              + '<div class="modal-content">'
              + '<div class="modal-header">'
              + '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
              + '<h4 class="modal-title" id="myModalLabel"></h4>'
              + '</div>'
              + '<div class="modal-body" id="modal"></div>'
              + '<div class="modal-footer"></div>'
              + '</div>'
              + '</div>'
              + '</div>';

            $msgbox = $(msghtml);
            $body.append($msgbox);
            $msgbox.find(".modal-header").append($this);
        };
        var createButton = function (_options) {
            var buttons = (_options || options || {}).buttons || {}
              , $btnrow = $msgbox.find(".modal-footer");
            //clear old buttons
            $btnrow.empty();
            var isButtonArr = buttons.constructor == Array;
            for (var button in buttons) {
                var btnObj = buttons[button]
                  , id = ""
                  , text = ""
                  , classed = "btn-default"
                  , click = "";
                if (btnObj.constructor == Object) {
                    id = btnObj.id;
                    text = btnObj.text;
                    classed = btnObj["class"] || btnObj.classed || classed;
                    click = btnObj.click;
                } else if (!isButtonArr && btnObj.constructor == Function) {
                    //Buttons should be an object, etc: { "close": function { } }
                    text = button;
                    click = btnObj;
                } else {
                    continue;
                }
                //<button data-bb-handler="danger" type="button" class="btn btn-danger">Danger!</button>
                $button = $('<button type="button" class="btn">').addClass(classed).html(text);
                id && $button.attr("id", id);
                if (click) {
                    (function (click) {
                        $button.click(function () {
                            click.call(self);
                        });
                    })(click);
                }
                $btnrow.append($button);
            }
            $btnrow.data("buttons", buttons);
        };
        var show = function () {
            // call the bootstrap modal to handle the show events (fade effects, body class and backdrop div)
            $msgbox.modal("show");
        };
        var close = function (destroy) {
            // call the bootstrap modal to handle the hide events and remove msgbox after the modal is hidden
            $msgbox.one("hidden.bs.modal", function () {
                if (destroy) {
                    $this.data(parentDataName).append($this);
                    $msgbox.remove();
                    $("body").css("padding-right", 0);
                    $("body").hasClass("modal-open") ? $("body").removeClass("modal-open") : "";
                }
            }).modal("hide");
        };
        if (options.constructor == Object) {
            !$this.data(parentDataName) && $this.data(parentDataName, $this.parent());
            if ($(".modal:visible").length < 1 || options.moreWindow == true) {
                create();
            }
            createButton();
            $(".modal-title", $msgbox).html(options.title || "");
            if (options.content) {
                $(".modal-body", $msgbox).append(options.content);
            }
            var $modalDialog = $(".modal-dialog", $msgbox).addClass(options.dialogClass || "");
            $(".modal-header .close", $msgbox).click(function () {
                var closeHandler = options.onClose || close;
                closeHandler.call(self);
            });
            if (options.footer) {
                $(".modal-footer", $msgbox).addClass("hide");
            }
            (options["class"] || options.classed) && $msgbox.addClass(options["class"] || options.classed);
            /*
            Passing the options, etc: backdrop, keyboard
            */
            options.autoOpen === false && (options.show = false);
            options.width && $modalDialog.width(options.width);
            options.height && $modalDialog.height(options.height);
            options.backdrop = false;
            options.keyboard = false;
            $msgbox.modal(options);
        }
        if (options == "destroy") {
            close(true);
        }
        if (options == "close") {
            close();
        }
        if (options == "open") {
            show();
        }
        if (options == "option") {
            if (arg1 == "buttons") {
                if (arg2) {
                    createButton({ buttons: arg2 });
                    show();
                } else {
                    return $msgbox.find(".modal-footer").data("buttons");
                }
            }
        }
        return self;
    };
})(jQuery);
