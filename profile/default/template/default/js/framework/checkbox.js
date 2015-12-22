/*
* 安装checkbox的全选事件监听
* _chkAll 全选按钮
* _chkList checkbox集合
*/
(function ($) {
    Kplus.addCheckboxEvent = function (_chkAll, _chkList) {
        var $chkAll = _chkAll, $chkList = _chkList;
        $chkAll.click(function () {
            if ($(this).is("input")) {
                if (this.checked) {
                    $chkList.each(function () {
                        this.checked = "checked";
                    });
                } else {
                    $chkList.each(function () {
                        this.checked = false;
                    });
                }
            } else {
                if (!isCheckedAll()) {
                    $chkList.each(function () {
                        this.checked = "checked";
                    });
                    Kplus.getControl('input[name="select_all"]').prop("checked", true);
                } else {
                    $chkList.each(function () {
                        this.checked = false;
                    });
                    Kplus.getControl('input[name="select_all"]').prop("checked", false);
                }
            }
        });
        $chkList.each(function () {
            $(this).click(function () {
                if (!$(this).is("input")) {
                    return false;
                }
                if (isCheckedAll()) {
                    $chkAll[0].checked = "checked";
                } else {
                    $chkAll[0].checked = false;
                }
            });
        });
        var isCheckedAll = function () {
            var num = 0;
            $chkList.each(function () {
                if (this.checked) {
                    num++;
                }
            });
            return num == $chkList.size();
        }
    }
})