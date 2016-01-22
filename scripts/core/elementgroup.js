(function () {
    Kdo.elementGroup = (function () {
        var groupDraggableOption = {};
        var _clickTarget;
        var updeteModelByGroup = {};
        var checkedModuleStyle = {};
        var historyLog = function () { }
        var _parentTarget;

        //组合结构，内部维护页面上的组合结构
        var groupModel = [];
        var $globeContent;

        var init = function (draggableOption, _updeteModelByGroup, _checkedModuleStyle,parentTarget, _historyLog, clickTarget) {
            $globeContent = $("#content");
            registerMouseup();//注册组合全局Mouseup事件
            registerMouseDown();
            groupDraggableOption = draggableOption;
            updeteModelByGroup = _updeteModelByGroup;
            checkedModuleStyle = _checkedModuleStyle;
            historyLog = _historyLog;
            _clickTarget = clickTarget;
            _parentTarget = parentTarget;
        }

        //创建临时组合
        var createTempGroup = function (selector) {
            unGroup($globeContent);
            //获取当前选中元素
            var $selectControls = $(selector);
            $.each($selectControls, function (index, item) {//当框到一个组合元素时，自动框选该组合内的所有元素   
                if (!!$(item).attr("group")) {
                    if ($(item).attr("group").indexOf("group_") !== -1) {
                        var id = $(item).attr("group");
                        var $doms = $("#content").find("[group=" + id + "]");
                        var $doms1 = $.grep($selectControls, function (n, i) {
                            return $(n).attr("group") == id;
                        })
                        if ($doms.length != $doms1.length) {
                            $selectControls = $.grep($selectControls, function (n, i) {
                                return $(n).attr("group") != id;
                            })
                        }
                    }
                }
            });

            if ($selectControls.length <= 1)
                return;

            var id = "temp_" + new Date().getTime();
            var $groupDiv = $("<div id=\"" + id + "\" class=\"module-group\"></div>");

            _createGroup($groupDiv, $.grep($selectControls, function (val, index) {
                //排除locked元素
                return !($(val).data("locked") || false);
            }));
        }

        //创建组合
        var createGroup = function () {
            //获取当前临时组合
            var $tempGroup = $("[id^='temp_']");
            var groupData = {};
            if ($tempGroup.length <= 0)
                return;

            var id = "group_" + new Date().getTime();
            $tempGroup.addClass("module-group-activate").attr("id", id);

            $.each($tempGroup.find("[id^='oper_'][isgroup]"), function (i, el) {
                var $el = $(el);
                $el.attr("group", id);
                $el.on("mouseenter", function (event) { activeGroup(id); });
            });

            //保存组合数据
            groupData.groupId = id;
            groupData.controls = [];
            $.each($tempGroup.find("[id^='oper_'][isgroup]"), function (i, el) {
                //var elementId = $(el).attr('id').replace("lock_oper_", "");
                var elementId = $(el).attr('id');
                $el.attr("isGroup", null);
                groupData.controls.push(elementId);
            });

            !!groupData && groupModel.push(groupData);
        }

        var activeGroup = function (groupId) {
            if (!groupId) {
                return;
            }
            if (groupId.indexOf("group_") === -1 || $("[group='" + groupId + "']").parents("[id^='temp_']").length > 0)
                return;

            var $el = $("#" + groupId);
            if ($el.length > 0)
                return;

            unGroup($globeContent);
            var $selectControls = $("[group='" + groupId + "']");
            if ($selectControls.length <= 0)
                return;
            var $groupDiv = $("<div id=\"" + groupId + "\" class=\"module-group module-group-activate\"></div>");

            _createGroup($groupDiv, $selectControls);
            return $groupDiv;
        }

        var currentActiveGroup = function () {
            for (var index in groupModel) {
                var groupId = groupModel[index]["groupId"];
                if ($("#" + groupId) != null && $("#" + groupId).hasClass("module-group-activate")) {
                    return $("#" + groupId);
                }
            };
        }

        //取消组合或者临时组合
        var unGroup = function (clickTarget, isUnGroup) {
            var $clickTarget = $(clickTarget);
            //触发元素为组合边框自己就不执行release，防止缩放组合执行release
            if ($clickTarget.hasClass("ui-resizable-handle"))
                return;

            if ((isUnGroup && !_elementIsGroup($clickTarget)) || (!isUnGroup && _elementIsGroup(clickTarget)))
                return;
            var selectedPanelExp = isUnGroup ? "[id='" + ($clickTarget.attr("group") || $clickTarget.attr("id")) + "']" : "[id^='temp_'],[id^='group_']";
            var $selectedPanels = $(document.body).find(selectedPanelExp);
            if ($selectedPanels.length > 0) {
                $selectedPanels.each(function (i, selectedPanel) {
                    var $selectedPanel = $(selectedPanel);
                    var panelPosition = $selectedPanel.position();

                    var groupId = $selectedPanel.attr("id");

                    var jqExp = $selectedPanel.attr("id").indexOf("group") === -1 ? "[id^='oper_'][isgroup]" : "[group]";
                    $.each($selectedPanel.find(jqExp), function (i, el) {
                        var $el = $(el);
                        //$el.attr("id", $el.attr("id").replace("lock_", ""))
                        $el.attr("isGroup", null);
                        var position = $el.position();
                        var left = position.left + $el.parent().position().left;
                        var top = position.top + $el.parent().position().top;
                        $el.css({
                            "left": left,
                            "top": top,
                        });
                        if ($el.data("locked") != true) {
                            $el.draggable({ disabled: false });
                            $el.resizable({ disabled: false });
                        }
                        if (isUnGroup) {
                            $el.removeAttr("group");
                        }
                    });
                    if (isUnGroup) {
                        for (var item in groupModel) {//移除当前组合数据
                            if (groupModel[item].groupId == groupId) {
                                groupModel.splice(item, 1);
                            }
                        };
                    }
                    $selectedPanel.parent().append($selectedPanel.find("[id^='oper_control_']:not([isgroup])"));
                    $selectedPanel.remove();
                });

                $("[id^='oper_control_']:not([isgroup])").removeClass("on").removeClass("hover");
            }
        }

        //内部函数，创建组合内容
        var _createGroup = function ($groupDiv, $selectControls) {
            checkedModuleStyle($groupDiv);
            //当前的content容器
            var $content = $($selectControls[0]).parents("[id^='content-']:first");

            var left = 0, top = 0, width = 0, height = 0, $toptoolbar = $(".lanh-control-toolbar");

            $.each($selectControls, function (i, el) {
                var position = $(el).position();
                left = (i == 0) ? position.left : Math.min(left, position.left);
                top = (i == 0) ? position.top : Math.min(top, position.top);
            });

            $.each($selectControls, function (i, el) {
                var $el = $(el);
                var position = $el.position();
                width = (i == 0) ? position.left + $el.width() - left : Math.max(width, position.left + $el.width() - left);
                height = (i == 0) ? position.top + $el.height() - top : Math.max(height, position.top + $el.height() - top);

                $el.css({
                    "left": position.left - left,
                    "top": position.top - top
                });
                $el.draggable({ disabled: true });
                $el.resizable({ disabled: true });
                //$el.attr("id", $el.attr("id").replace("oper", "lock_oper"));
                $el.attr("isGroup", "isGroup");
            });

            registerMouseup();

            $groupDiv.css({
                "left": left,
                "top": top
            });

            $toptoolbar.removeClass("on");

            $groupDiv.width(width + 3);
            $groupDiv.height(height + 3);
            $content.append($groupDiv);
            $groupDiv.append($selectControls);
            $groupDiv.resizable({
                handles: "all",
                containment: "#content-body-body",
                start: function (event, ui) {
                    offMouseup();
                    Kdo.autoResize.getOriginData({ id: $(ui.helper).attr("id") });
                    checkedModuleStyle(ui.helper);
                },
                resize: function (event, ui) {
                    Kdo.autoResize.updateDate({ id: $(ui.helper).attr("id") });
                    checkedModuleStyle(ui.helper);
                    _parentTarget(ui.helper);
                },
                stop: function (event, ui) {
                    registerMouseup();
                    Kdo.autoResize.cleanData();
                    var $json = {};
                    if (Kdo.elementGroup.elementIsGroup(ui.helper) || Kdo.elementGroup.elementIsTempGroup(ui.helper)) {
                        $json.id = $(ui.helper).attr("id");
                        $json.isGoup = true;
                    } else {
                        $json.id = $(ui.helper).find("[id^='control_']").attr("id");
                    }
                    !!updeteModelByGroup && updeteModelByGroup($json);
                    historyLog();
                }
            });

            $groupDiv.draggable($.extend(angular.copy(groupDraggableOption), {
                start: function (event, ui) {
                    offMouseup();
                    groupDraggableOption.start(event, ui);
                },
                stop: function (event, ui) {
                    registerMouseup();
                    groupDraggableOption.stop(event, ui);
                }
            }));

            $("[id^='oper_control_']:not([isgroup])").removeClass("on").removeClass("hover");
            $("[id^='oper_control_'][isgroup]").addClass("on");
        }

        var _mouseupEvent = function (event) {
            var $target = $(event.target).parents("[id^='oper_control_'][isgroup]");
            if (event.which === 1 && !event.ctrlKey && !($target.attr('onAlignSize') === 'true'))
                unGroup($(event.target));
            $target.attr('onAlignSize', null);
        }

        var registerMouseup = function () {
            offMouseup();
            $globeContent.on("mouseup.group", _mouseupEvent);
        }

        var offMouseup = function () {
            $globeContent.off("mouseup.group");
        }

        //注册全局mousedown事件，点击空白unGroup，如果点击的是框选元素，就不会unGroup
        var registerMouseDown = function () {
            $globeContent.on("mousedown.group", function (event) {
                if (event.which === 1 && !event.ctrlKey && !(_elementIsTempGroup(event.target) || _elementIsGroup(event.target)))
                    unGroup($(event.target));
            });
        }

        var getGroupId = function (obj) {
            var $obj = $(obj);
            if ($obj.attr("id").indexOf("group_") !== -1)
                return $obj.attr("id");
            else
                return $obj.parents("[id^=group_]").attr("id");
        }

        //判断是否是组合
        var _elementIsGroup = function (target) {
            var $dom = $(target);
            return ($dom.attr("id") || "").indexOf("group_") !== -1 || ($dom.attr("group") || "").length > 0 || $dom.parents("[group]").length > 0;
        }

        //判断是否是临时组合
        var _elementIsTempGroup = function (target) {
            var $dom = $(target);
            return ($dom.attr("id") || "").indexOf("temp_") !== -1 || $dom.parents("[id^='temp_']").length > 0;
        }

        var getGroupControls = function (group) {
            var controls = [];
            if (_elementIsGroup(group) || _elementIsTempGroup(group)) {
                $.each($(group).find("[id^='oper_'][isgroup]"), function (i, el) {
                    controls.push(el);
                });
            }
            return controls;
        }

        //重新计算组合的宽高left、top
        var reCountGroupSize = function (groupId) {
            if (!groupId || groupId === '') return;

            var group = $("#" + groupId),
                controls = group.find("[id^='oper_control_']"),
                groupPosition = { x: parseFloat(group.css("left")), y: parseFloat(group.css("top")) },
                minLeft = groupPosition.x + parseFloat(controls.eq(0).css("left")),
                minTop = groupPosition.y + parseFloat(controls.eq(0).css("top")),
                maxWidth = minLeft + parseFloat(controls.eq(0).css("width")),
                maxHeight = minTop + parseFloat(controls.eq(0).css("height")),
                position = {};

            $.each(controls, function (index, item) {
                minLeft = minLeft > groupPosition.x + parseFloat($(item).css("left")) ? groupPosition.x + parseFloat($(item).css("left")) : minLeft,
                minTop = minTop > groupPosition.y + parseFloat($(item).css("top")) ? groupPosition.y + parseFloat($(item).css("top")) : minTop,
                maxWidth = maxWidth < (groupPosition.x + parseFloat($(item).css("left")) + parseFloat($(item).css("width"))) ? (groupPosition.x + parseFloat($(item).css("left")) + parseFloat($(item).css("width"))) : maxWidth,
                maxHeight = maxHeight < (groupPosition.y + parseFloat($(item).css("top")) + parseFloat($(item).css("height"))) ? (groupPosition.y + parseFloat($(item).css("top")) + parseFloat($(item).css("height"))) : maxHeight
                position = {
                    left: minLeft,
                    top: minTop,
                    maxX: maxWidth,
                    maxY: maxHeight
                }
            })

            group.css({
                left: position.left,
                top: position.top,
                width: position.maxX - position.left + 2,
                height: position.maxY - position.top + 2
            });
            $.each(controls, function (index, item) {
                $(item).css({
                    left: groupPosition.x + parseFloat($(item).css("left")) - position.left,
                    top: groupPosition.y + parseFloat($(item).css("top")) - position.top
                })
            })

        }


        /*获取临时组合的元素*/
        var getCurrentGroupControls = function ($element) {
            var controls = [];
            if (_elementIsTempGroup($element)) {
                if (!!$($element).attr("id") && $($element).attr("id").indexOf("temp_") !== -1) {
                    controls = $($element).find("[id^='oper_'][isgroup]");
                } else {
                    controls = $($element).parents("[id^='temp_']").find("[id^='oper_'][isgroup]");
                }
            }
            return controls;
        }

        return {
            init: init,
            createTempGroup: createTempGroup,
            createGroup: createGroup,
            unGroup: unGroup,
            elementIsGroup: _elementIsGroup,
            elementIsTempGroup: _elementIsTempGroup,
            groupModel: groupModel,
            getGroupControls: getGroupControls,
            getCurrentGroupControls: getCurrentGroupControls,
            activeGroup: activeGroup,
            currentActiveGroup: currentActiveGroup,
            reCountGroupSize: reCountGroupSize
        };
    }());
}).call(this);

(function () {
    //缩放内部元素自适应
    Kdo.autoResize = (function () {
        var wrapElem = null,
            rateArr = [],
            elemArr = [];
        // js计算精度修正
        function accMul(arg1, arg2) {//乘法 
            var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
            try { m += s1.split(".")[1].length } catch (e) { }
            try { m += s2.split(".")[1].length } catch (e) { }
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }
        function accDiv(arg1, arg2) {//除法
            var t1 = 0, t2 = 0, r1, r2;
            try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
            try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
            with (Math) {
                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return (r1 / r2) * pow(10, t2 - t1);
            }
        }
        function getOriginData(wrapObj) {
            var wrapObjs = $("#" + wrapObj.id);
            var oEleArr = $("#" + wrapObj.id + " [id^='oper_control_'][isgroup]");
            var groupInElementArr = [],
            wrapElem = {
                "id": wrapObj.id,
                "width": parseFloat(wrapObjs.css("width")) - 1,
                "height": parseFloat(wrapObjs.css("height")) - 1
            };

            for (var i in rateArr) {
                if (rateArr[i].wrapId == wrapObj.id) {
                    return;
                }
            }
            $.each(oEleArr, function (index, elem) {
                groupInElementArr.push({
                    "rateW": accDiv(parseFloat($(elem).css("width")), wrapElem.width),
                    "rateH": accDiv(parseFloat($(elem).css("height")), wrapElem.height),
                    "rateL": accDiv(parseFloat($(elem).css("left")), wrapElem.width),
                    "rateT": accDiv(parseFloat($(elem).css("top")), wrapElem.height)
                })
            });
            rateArr.push({
                'wrapId': wrapElem.id,
                'groupInElementArr': groupInElementArr
            })
        }

        function updateDate(wrapObj) {
            var wrapObjs = $("#" + wrapObj.id);
            var oEleArr = $("#" + wrapObj.id + " [id^='oper_control_'][isgroup]");
            elemArr = [];
            wrapElem = {
                "id": wrapObj.id,
                "width": parseFloat(wrapObjs.css("width")),
                "height": parseFloat(wrapObjs.css("height"))
            };

            for (var i in rateArr) {
                if (rateArr[i].wrapId == wrapObj.id) {
                    var rateArr1 = rateArr[i]['groupInElementArr'];
                    $.each(oEleArr, function (index, elem) {
                        elemArr.push({
                            "width": accMul(wrapElem.width, rateArr1[index].rateW) + "px",
                            "height": accMul(wrapElem.height, rateArr1[index].rateH) + "px",
                            "left": accMul(wrapElem.width, rateArr1[index].rateL) + "px",
                            "top": accMul(wrapElem.height, rateArr1[index].rateT) + "px"
                        });
                        if ($(elem).attr("style").replace(/\s+/g, "").indexOf("width:auto") !== -1) {
                            $(elem).css({
                                height: elemArr[index].height,
                                left: elemArr[index].left,
                                top: elemArr[index].top
                            })
                        } else if ($(elem).attr("style").replace(/\s+/g, "").indexOf("height:auto") !== -1) {
                            $(elem).css({
                                width: elemArr[index].width,
                                left: elemArr[index].left,
                                top: elemArr[index].top
                            })
                        } else {
                            $(elem).css({
                                width: elemArr[index].width,
                                height: elemArr[index].height,
                                left: elemArr[index].left,
                                top: elemArr[index].top
                            })
                        }
                    })

                }
            }

        }

        var cleanData = function () {
            elemArr = [];
        }

        return {
            getOriginData: getOriginData,
            updateDate: updateDate,
            cleanData: cleanData
        };
    }());
}).call(this);