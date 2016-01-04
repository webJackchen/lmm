(function () {
    Kdo.elementGroup = (function () {
        var groupDraggableOption = {};

        //组合结构，内部维护页面上的组合结构
        var groupModel = [];

        var setDraggableOption = function (draggableOption) {
            groupDraggableOption = draggableOption;
        }

        //创建临时组合
        var createTempGroup = function () {
            //获取当前选中元素
            var $selectControls = $("[id^='oper_control_'].on");
            if ($selectControls.length <= 1)
                return;

            var $groupDiv = $("<div id=\"oper_selectedPanel\" class=\"module-group\"></div>");

            _createGroup($groupDiv, $.grep($selectControls, function (val, index) {
                //排除locked元素
                return !($(val).data("locked") || false);
            }));
        }

        //创建组合
        var createGroup = function () {
            //获取当前临时组合
            var $tempGroup = $("#oper_selectedPanel");
            var groupData = {};
            if ($tempGroup.length <= 0)
                return;

            var id = "group_" + new Date().getTime();
            $tempGroup.addClass("module-group-activate").attr("id", id);

            $.each($tempGroup.find("[id^='lock_oper_']"), function (i, el) {
                var $el = $(el);
                $el.attr("group", id);
                $el.on("mouseenter", function (event) {
                    activeGroup(id);
                });
            });

            //保存组合数据
            groupData.groupId = id;
            groupData.controls = [];
            $.each($tempGroup.find("[id^='lock_oper_']"), function (i, el) {
                var elementId = $(el).attr('id').replace("lock_oper_", "");
                groupData.controls.push(elementId);
            });

            !!groupData && groupModel.push(groupData);
        }

        var activeGroup = function (groupId) {
            if (groupId.indexOf("group_") === -1 || $(".ui-selectable-helper").length > 0 || $("[group='" + groupId + "']").parents("#oper_selectedPanel").length > 0)
                return;

            var $el = $("#" + groupId);
            if ($el.length > 0)
                return;

            var $selectControls = $("[group='" + groupId + "']");
            if ($selectControls.length <= 0)
                return;
            var $groupDiv = $("<div id=\"" + groupId + "\" class=\"module-group module-group-activate\"></div>");

            _createGroup($groupDiv, $selectControls);
            return $groupDiv;
        }

        var currentActiveGroup = function(){
            for (var index in groupModel) {
                var groupId = groupModel[index]["groupId"];
                if($("#"+groupId) != null && $("#"+groupId).hasClass("module-group-activate")){
                    return $("#"+groupId);
                }
            };
        }

        //取消组合或者临时组合
        var unGroup = function ($clickTarget) {
            //触发元素为组合边框自己就不执行release，防止缩放组合执行release
            if ($clickTarget.hasClass("ui-resizable-handle"))
                return;
            var isUnGroup = (($clickTarget.attr("id") || "").indexOf("group_") !== -1 || ($clickTarget.attr("group") || "").indexOf("group_") !== -1) && $clickTarget.parents("#oper_selectedPanel").length <= 0;

            var selectedPanelExp = isUnGroup ? "[id='" + $clickTarget.attr("group") + "']" : "#oper_selectedPanel,[id^='group_']";
            var $selectedPanels = $(document.body).find(selectedPanelExp);
            if ($selectedPanels.length > 0) {
                $selectedPanels.each(function (i, selectedPanel) {
                    var $selectedPanel = $(selectedPanel);
                    var panelPosition = $selectedPanel.position();

                    var groupId = $selectedPanel.attr("id");

                    var jqExp = $selectedPanel.attr("id").indexOf("group") === -1 ? "[id^='lock_oper_']" : "[group]";
                    $.each($selectedPanel.find(jqExp), function (i, el) {
                        var $el = $(el);
                        $el.attr("id", $el.attr("id").replace("lock_", ""))
                        var position = $el.position();
                        var left = position.left + $el.parent().position().left;
                        var top = position.top + $el.parent().position().top;
                        $el.css({
                            "left": left,
                            "top": top,
                        });

                        $el.draggable({ disabled: false });
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
                    $selectedPanel.parent().append($selectedPanel.find("[id^='oper_']"));
                    $selectedPanel.remove();
                });
            }
        }

        //内部函数，创建组合内容
        var _createGroup = function ($groupDiv, $selectControls) {
            //当前的content容器
            var $content = $($($selectControls[0]).parents("[id^='content-']")[0]);

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
                $el.attr("id", $el.attr("id").replace("oper", "lock_oper"));
            });

            registerMouseup($selectControls);

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
                start: function (event, ui) {
                    Kdo.autoResize.getOriginData({ id: $(ui.helper).attr("id") });
                },
                resize: function (event, ui) {
                    Kdo.autoResize.updateDate({ id: $(ui.helper).attr("id") });
                },
                stop: function (event, ui) {
                    Kdo.autoResize.cleanData();
                }
            });

            Kdo.$($groupDiv).draggable().on({
                begin: function (event, ui) {
                    offMouseup($(ui.helper).find("[id^='lock_oper_']"));
                    groupDraggableOption.start(event, ui);
                },
                ing: function (event, ui) {
                    groupDraggableOption.drag(event, ui);
                },
                end: function (event, ui) {
                    registerMouseup($(ui.helper).find("[id^='lock_oper_']"));
                    groupDraggableOption.stop(event, ui);
                }
            });
        }

        var _mouseupEvent = function (event) {
            if (event.which === 1)
                unGroup($(this));
        }

        var registerMouseup = function ($els) {
            $.each($els, function (i, el) {
                $(el).on("mouseup.group", _mouseupEvent);
            });
        }

        var offMouseup = function ($els) {
            $.each($els, function (i, el) {
                $(el).off("mouseup.group");
            });
        }

        //判断是否是组合
        var _elementIsGroup = function (target) {
            var $dom = $(target);
            return ($dom.attr("id") || "").indexOf("group_") !== -1 || $dom.attr("group") || $dom.parents("[group]").length > 0;
        }

        //判断是否是临时组合
        var _elementIsTempGroup = function (target) {
            var $dom = $(target);
            return $dom.attr("id") === "oper_selectedPanel" || $dom.parents("[id='oper_selectedPanel']").length > 0;
        }

        return {
            setDraggableOption: setDraggableOption,
            createTempGroup: createTempGroup,
            createGroup: createGroup,
            unGroup: unGroup,
            elementIsGroup: _elementIsGroup,
            elementIsTempGroup: _elementIsTempGroup,
            groupModel: groupModel,
            activeGroup:activeGroup,
            currentActiveGroup:currentActiveGroup
        };
    }());
}).call(this);

(function () {
    //缩放内部元素自适应
    Kdo.autoResize = (function () {
        var wrapElem = null,
            rateArr = [],
            elemArr = [];

        function getOriginData(wrapObj) {
            var wrapObjs = $("#" + wrapObj.id);
            var oEleArr = $("#" + wrapObj.id + " [id^='lock_oper_control_']");
            wrapElem = {
                "id": wrapObj.id,
                "width": parseFloat(wrapObjs.css("width")),
                "height": parseFloat(wrapObjs.css("height"))
            };
            $.each(oEleArr, function (index, elem) {
                rateArr.push({
                    "rateW": parseFloat($(elem).css("width")) / wrapElem.width,
                    "rateH": parseFloat($(elem).css("height")) / wrapElem.height,
                    "rateL": parseFloat($(elem).css("left")) / wrapElem.width,
                    "rateT": parseFloat($(elem).css("top")) / wrapElem.height
                })
            })
        }

        function updateDate(wrapObj) {
            var wrapObjs = $("#" + wrapObj.id);
            var oEleArr = $("#" + wrapObj.id + " [id^='lock_oper_control_']");
            elemArr = [];
            wrapElem = {
                "id": wrapObj.id,
                "width": parseFloat(wrapObjs.css("width")),
                "height": parseFloat(wrapObjs.css("height"))
            };
            $.each(oEleArr, function (index, elem) {
                elemArr.push({
                    "width": wrapElem.width * rateArr[index].rateW + "px",
                    "height": wrapElem.height * rateArr[index].rateH + "px",
                    "left": wrapElem.width * rateArr[index].rateL + "px",
                    "top": wrapElem.height * rateArr[index].rateT + "px"
                });
                $(elem).css({
                    width: elemArr[index].width,
                    height: elemArr[index].height,
                    left: elemArr[index].left,
                    top: elemArr[index].top
                })
            })
        }

        var cleanData = function () {
            rateArr = [];
            elemArr = [];
        }

        return {
            getOriginData: getOriginData,
            updateDate: updateDate,
            cleanData: cleanData
        };
    }());
}).call(this);