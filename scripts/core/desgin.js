(function () {
    function baseContext() {

    }
    baseContext.prototype.selectable = function (element, options) {
        var options = $.extend({
            filter: "[id^='oper_'].realWidth",
            distance: 10,
            tolerance: 'fit',//被选元素完全覆盖的时候才会框选
            start: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('marquee', 'begin');
            },
            selecting: function (event, ui) {
                $(ui).each(function () {
                    $(this.selecting).addClass('on');
                })
            },
            unselecting: function (event, ui) {
                $(ui).each(function () {
                    $(this.unselecting).removeClass('on');
                })
            },
            selected: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('marquee', 'ing');
            },
            stop: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('marquee', 'end');
            }
        }, options || {});

        $(element).selectable(options);
    }

    baseContext.prototype.resizable = function (element, options) {
        var options = $.extend({
            autoHide: false,
            handles: "s",
            stop: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('resize', 'end');
            },
            resize: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('resize', 'ing');
            }
        }, options || {});

        $(element).resizable(options);
    }

    baseContext.prototype.droppable = function (element, options) {
        var options = $.extend({
            tolerance: "pointer",
            drop: function (event, ui) {
                //TODO：这里直接传入了this，需要统一优化
                Kdo.trigger.call(this, event, ui)('drop', 'ing');
                //Kdo.trigger.call(ui.helper, event, ui)('drop', 'ing');
            },
            over: function (event, ui) {
                //TODO：这里直接传入了this，需要统一优化
                Kdo.trigger.call(this, event, ui)('drop', 'end');
                //Kdo.trigger.call(ui.helper, event, ui)('drop', 'end');
            },
            out: function (event, ui) {
                $(this).removeClass("drop-state-active");
            },
            deactivate: function (event, ui) {
                $(this).removeClass("drop-state-active");
            }
        }, options || {});

        $(element).droppable(options);
    }

    baseContext.prototype.draggable = function (element, options) {
        var options = $.extend({
            snap: true,
            snapTolerance: 10,
            addClasses: false,
            containment: "#content",
            cursor: "move",
            refreshPositions: true,
            start: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('drag', 'begin');
            },
            stop: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('drag', 'end');
            },
            drag: function (event, ui) {
                Kdo.trigger.call(ui.helper, event, ui)('drag', 'ing');
            }
        }, options);
        $(element).draggable(options);
    }

    var eventContext = function () {
        var self = this,
            events = {
                sys: {},
                uniqued: {}
            },
            EVENT_PROP = 'events',
            EVENT_SYMBOL = '::';


        var getEventContext = function (isUniqued) {
            return !!isUniqued ? events.uniqued : events.sys
        }

        this.reg = function (key, handler, uniqued, require) {
            if (!key) {
                console.error('事件名称不能为:' + key);
                return false;
            }
            var eventContext = getEventContext(uniqued),
                registedEvents = eventContext[key];
            if (!registedEvents) registedEvents = eventContext[key] = [];
            if (!!handler) {
                registedEvents.push({
                    require: require,
                    handler: handler
                });
            }
        }
        var getElementId = function (element) {
            //顺序不能变
            var id = $(element).attr('id');
            if (!id) {
                id = $(element).attr('name');
            }
            if (!id) {
                id = ($(element).attr('class') || '').replace(' ', '_');
            }
            if (!id) {
                id = $(element).prop("tagName");
            }
            return id;
        },
        addElementEvents = function (element, eventName) {
            var events = $(element).data(EVENT_PROP) || [];
            events.push(eventName);
            $(element).data(EVENT_PROP, events);
        },
        getElementEvents = function (element) {
            return $(element).data(EVENT_PROP) || null;
        },
        generatorEventId = function (element, type) {
            return getElementId(element) + EVENT_SYMBOL + type;
        }

        this.on = function (selector, type, handler, uniqued, require) {
            if (uniqued && selector) {
                //唯一事件会针对每个元素进行注册
                $(selector).each(function () {
                    var eventId = generatorEventId(this, type);
                    self.reg(eventId, handler, true, require);
                    //[*1]记录每个元素被注册过的事件，已经支持一个事件多个处理函数
                    //[*2]这里只记录了事件的注册类型  
                    addElementEvents(this, type);
                });
            }
            else {
                self.reg(type, handler, false, require);
            }
        }



        var invokeMethod = function (method, name, event, ui) {
            if (typeof method === 'function') {
                method(name, events, self.trigger, event, ui)
            }
            else if (typeof method === 'string') {
                var eventArr = method.split(',');
                for (var i = 0, ii = eventArr.length; i < ii; i++) {
                    this.trigger(event, ui)(eventArr[i], name);
                }
            }
        }

        var arraySlice = [].slice;

        var callHandler = function (handler, eventName) {
            if (!handler) console.debug('无效的事件处理函数', handler);
            if (typeof handler === 'function') {
                handler.apply(this, arraySlice.call(arguments, 1));
            }
            else if (typeof handler === 'object') {
                var handlerKeys = Object.keys(handler);
                for (var m = 0, mm = handlerKeys.length; m < mm; m++) {
                    handlerName = handlerKeys[m];
                    if (handlerName === eventName) {
                        handler[handlerName].apply(this, arraySlice.call(arguments, 2))
                    }
                }
            }
        }

        var callEvent = function (eventObject, name, event, ui) {
            var require = eventObject.require, prevEvent, nextEvent;
            if (typeof require === 'function' || typeof require === 'string') {
                nextEvent = require; //如果是传了一个函数，就直接默认为调用本身之后再调用这个事件函数
            }
            else if (!!require && typeof require === 'object') {
                prevEvent = require.prev;
                nextEvent = require.next;
            }
            invokeMethod(prevEvent, name, event, ui);
            callHandler.call(this, eventObject.handler, name, event, ui);
            invokeMethod(nextEvent, name, event, ui);
        }





        this.trigger = function (event, ui) {
            var target = this,
                definedEvents = getElementEvents(target),
                isUniqued = !!definedEvents && definedEvents.length > 0,
                eventContext = getEventContext(isUniqued);

            return function (type, name) {
                if (isUniqued) {
                    var canTrigger = false;
                    for (var i = 0, ii = definedEvents.length; i < ii; i++) {
                        if (definedEvents[i] === type) {
                            canTrigger = true;
                        }
                    }
                    if (canTrigger) {
                        //根据已经定义的事件类型，对应[*2]，来触发当前元素正在触发的事件
                        var eventId = generatorEventId(target, type),
                            eventObjects = eventContext[eventId];//触发同一个事件的多个处理函数,对应[*1]
                        for (var j = 0, jj = eventObjects.length; j < jj; j++) {
                            callEvent.call(target, eventObjects[j], name, event, ui);
                        }
                    }
                }
                else {
                    var events = eventContext[type] || [];
                    for (var m = 0, mm = events.length; m < mm; m++) {
                        callEvent.call(target, events[m], name, event, ui);
                    }
                }
            }
        }

        this.off = function (element) {
            //TODO
        }
    }


    var Kdo = this.Kdo = (function () {
        this.container;
        this.selectable;
        this.dropable;
        this.draggable;

        var event = new eventContext(),
            storage = [],
            context = new baseContext(),
            on = function (name, handler, uniqued, require) {
                event.on('', name, handler, require);
                return { on: Kdo.on };
            },
            layoutInit = function () {
                var contentDom = this.container.find('#content-header,#content-body,#content-footer');
                //这里初始化的顺序不能修改
                this.resizable = context.resizable(contentDom);
                this.dropable = context.droppable(contentDom, { accept: "[id^='oper_'].fullWidth" });
                this.dropable = context.droppable(this.container.find('#content-header-body,#content-body-body,#content-footer-body'), {
                    accept: "[id^='oper_'].realWidth,#oper_selectedPanel,[id^='oper_group']"
                });
                this.selectable = context.selectable(contentDom);

                //bindEvent(this.container);
                //bindEvent(contentDom);
                $(contentDom).on('mousedown', function (event) {
                    Kdo.trigger.call(event.currentTarget, event, event.currentTarget)('mousedown', event);
                    //event.stopPropagation && event.stopPropagation();
                });

                $(this.container).on('mouseup', function (event) {


                })


            },
            bindEvent = function (element) {

            },
            init = function (container) {
                this.container = container;
                layoutInit.call(this);
            },
            wrapper = function (target) {
                var currentTarget = $(target);
                var regEvent = function (type, handler, uniqued, require) {
                    if (!handler) {
                        return {
                            on: function (handler, uniqued, require) {
                                event.on(currentTarget, type, handler, uniqued, require);
                                return config;
                            }
                        }
                    }
                    event.on(currentTarget, type, handler, uniqued, require);
                    return config;
                },
                calledParas = function () {
                    var paras = {
                        handler: null,
                        options: {},
                        uniqued: false,
                        require: null
                    };
                    if (arguments.length === 1) {
                        paras.handler = arguments[0];
                    }
                    else if (arguments.length === 2) {
                        paras.handler = arguments[0];
                        paras.uniqued = arguments[1];
                    }
                    else if (arguments.length === 3) {
                        paras.handler = arguments[0];
                        paras.uniqued = arguments[1];
                        paras.options = arguments[2]
                    }
                    else if (arguments.length === 4) {
                        paras.handler = arguments[0];
                        paras.uniqued = arguments[1];
                        paras.require = arguments[2];
                        paras.options = arguments[3]
                    }
                    return paras;
                },
                config = {
                    selectable: function () {
                        var paras = calledParas.apply(this, Array.prototype.slice.call(arguments, 0));
                        context.selectable(currentTarget, paras.options);
                        return regEvent('marquee', paras.handler, paras.uniqued, paras.require);
                    },
                    resizable: function () {
                        var paras = calledParas.apply(this, Array.prototype.slice.call(arguments, 0));
                        context.resizable(currentTarget, paras.options);
                        return regEvent('resize', paras.handler, paras.uniqued, paras.require)
                    },
                    droppable: function () {
                        var paras = calledParas.apply(this, Array.prototype.slice.call(arguments, 0));
                        context.droppable(currentTarget, paras.options);
                        return regEvent('drop', paras.handler, paras.uniqued, paras.require)
                    },
                    draggable: function () {
                        var paras = calledParas.apply(this, Array.prototype.slice.call(arguments, 0));
                        context.draggable(currentTarget, paras.options);
                        return regEvent('drag', paras.handler, paras.uniqued, paras.require)
                    }
                }
                return config;
            };


        var crud = function (dataArr) {
            dataArr = dataArr || [];
            return {
                add: function (dataItem) {
                    dataArr.push(dataItem);
                },
                del: function (dataItem) {
                    var index = dataArr.indexOf(dataItem);
                    dataArr.splice(index, 1);
                },
                clear: function () {
                    dataArr = [];
                },
                get: function () {
                    return dataArr;
                }
            }
        }

        return {
            $: function (seletor) {
                return wrapper($(seletor));
            },
            on: on,
            init: init,
            trigger: event.trigger,
            ctrls: crud(storage)
        };
    })();
}).call(this);




(function () {
    // 这个方式是暂时放在这个位置的，需要重新优化
    Kdo.getContentPosition = function (currentOffset) {
        var headerTop = $('#content-body-body').offset().top,
            footerTop = $('#content-footer-body').offset().top;
        if (currentOffset.top < headerTop) {
            return $.extend(currentOffset, {
                name: 'header',
                selector: '#content-header-body'
            });
        }
        else if (currentOffset.top > footerTop) {
            return $.extend(currentOffset, {
                name: 'footer',
                selector: '#content-footer-body'
            });
        }
        else {
            return $.extend(currentOffset, {
                name: 'body',
                selector: '#content-body-body'
            });
        }
    };

    // add by clark 显示模块拖动时的辅助线（头部、中部、底部单独控制）
    Kdo.guideLine = (function () {
        var MIN_DISTANCE = 10; // 吸附到辅助性的距离值
        var guides = []; // 初始化需要显示辅助线的模块 
        var innerOffsetX, innerOffsetY; // 拖动的时候需要用这个值来进行计算
        var currentOpistionObj = document.body;

        var create = function (event, currentOffset, selector) {
            var currentOpistion = Kdo.getContentPosition(currentOffset);
            if (currentOpistion && currentOpistion.selector) {
                currentOpistionObj = $(currentOpistion.selector);
            }

            if (currentOpistionObj.find('#guide-h').length <= 0) {
                $('<div id="guide-h" class="guide"></div>'
                    + '<div id="guide-v" class="guide"></div>').appendTo(currentOpistionObj);
            }
            guides = $.map(currentOpistionObj.find(selector || '[id^="oper_control_"]').not(this), computeGuidesForElement);
            innerOffsetX = event.originalEvent.offsetX;
            innerOffsetY = event.originalEvent.offsetY;
        }


        function computeGuidesForElement(elem, pos, w, h) {
            if (elem != null) {
                var $t = $(elem);
                pos = {
                    top: parseFloat($t.get(0).style.top),
                    left: parseFloat($t.get(0).style.left)
                }
                //间距设置为1个像素，如果有空白间距则需要进行手工微调（已对齐）
                w = $t.outerWidth() - 1;//由于左右的圆圈没有padding值，只有边框线所占的1像素，所以就是1+1=2个像素的空位
                h = $t.outerHeight() - 1;//由于上下的圆圈的直径有5个像素，padding了2个像素+直径的1像素边线就是3个像素，两个模块叠在一起的时候就6个像素的空位
            }
            return [
                { type: "h", left: pos.left, top: pos.top },
                { type: "h", left: pos.left, top: pos.top + h },
                { type: "v", left: pos.left, top: pos.top },
                { type: "v", left: pos.left + w, top: pos.top },
                // you can add _any_ other guides here as well (e.g. a guide 10 pixels to the left of an element)
                { type: "h", left: pos.left, top: pos.top + h / 2 },
                { type: "v", left: pos.left + w / 2, top: pos.top }
            ];
        }

        var showLine = function (event, ui) {
            // iterate all guides, remember the closest h and v guides
            var guideV, guideH, distV = MIN_DISTANCE + 1, distH = MIN_DISTANCE + 1, offsetV, offsetH;
            var chosenGuides = { top: { dist: MIN_DISTANCE + 1 }, left: { dist: MIN_DISTANCE + 1 } };
            var $t = $(this);
            var pos = {
                top: event.originalEvent.pageY - innerOffsetY - currentOpistionObj.offset().top,
                left: event.originalEvent.pageX - innerOffsetX - currentOpistionObj.offset().left
            };
            var w = $t.outerWidth() - 1;
            var h = $t.outerHeight() - 1;
            var elemGuides = computeGuidesForElement(null, pos, w, h);
            $.each(guides, function (i, guide) {
                $.each(elemGuides, function (i, elemGuide) {
                    if (guide.type == elemGuide.type) {
                        var prop = guide.type == "h" ? "top" : "left";
                        var d = Math.abs(elemGuide[prop] - guide[prop]);
                        if (d < chosenGuides[prop].dist) {
                            chosenGuides[prop].dist = d;
                            chosenGuides[prop].offset = elemGuide[prop] - pos[prop];
                            chosenGuides[prop].guide = guide;
                        }
                    }
                });
            });

            if (chosenGuides.top.dist <= MIN_DISTANCE) {
                var guideTop = chosenGuides.top.guide.top;
                $(currentOpistionObj).find("#guide-h").css("top", guideTop).show();

                ui.position.top = chosenGuides.top.guide.top - chosenGuides.top.offset;
            }
            else {
                $(currentOpistionObj).find("#guide-h").hide();
                //吸附到辅助线不能执行
                //ui.position.top = pos.top;
            }

            if (chosenGuides.left.dist <= MIN_DISTANCE) {
                var guideLeft = chosenGuides.left.guide.left;

                $(currentOpistionObj).find("#guide-v").css("left", guideLeft).show();
                ui.position.left = chosenGuides.left.guide.left - chosenGuides.left.offset;
            }
            else {
                $(currentOpistionObj).find("#guide-v").hide();
                //吸附到辅助线不能执行
                //ui.position.left = pos.left;
            }
            /*限制模块元素不能拖到边界之外*/
            if (ui.position.left < 0) ui.position.left = 0;
            if (ui.position.left + w > currentOpistionObj.width())
                ui.position.left = currentOpistionObj.width() - w;

        }

        var hideLine = function () {
            $(currentOpistionObj).find("#guide-v").hide();
            $(currentOpistionObj).find("#guide-h").hide();
        }

        return {
            init: create,
            show: showLine,
            hide: hideLine
        };
    })();
}).call(this);