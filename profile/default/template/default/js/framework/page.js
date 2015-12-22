/*
* 加载分页数据
* $page 页码json对象
* $pageDiv 页码json对象
*/
var LoadPage = function ($page, $pageDiv) {
    var $pageinfo = '<ul class="pagination">', $pageIndex = parseInt($page.nowPageCount), $pageCount = parseInt($page.allPageCount), $itemCount = parseInt($page.allItemCount);
    /* 当前页大于1时，首页、上一页有效 */
    if ($pageIndex > 1) {
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(1)">首页</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 1) + ')">&lt;&#160;上一页</a></li>';
    } else {
        $pageinfo += '<li class="disabled"><a>首页</a></li>';
        $pageinfo += '<li class="disabled"><a>&lt;&#160;上一页</a></li>';
    }
    /* 数字分页开始 */
    if ($pageIndex == 1) { /* 当前页等于1时，选中当前页 */
        $pageinfo += '<li class="active"><a>' + $pageIndex + '</a></li>';
        if ($pageCount > 1) { /* 总页数大于1时，显示当前页加1页 */
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 1) + ')">' + ($pageIndex + 1) + '</a></li>';
        }
        if ($pageCount > 2) { /* 总页数大于2时，显示当前页加2页 */
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 2) + ')">' + ($pageIndex + 2) + '</a></li>';
        }
        if ($pageCount > 3) { /* 总页数大于3时，显示当前页加3页 */
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 3) + ')">' + ($pageIndex + 3) + '</a></li>';
        }
        if ($pageCount > 5) { /* 总页数大于5时，显示末页 */
            $pageinfo += '<li><a>...</a></li>';
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + $pageCount + ')">' + $pageCount + '</a></li>';
        }
    } else if ($pageIndex == 2) { /* 当前页等于2时，选中当前页，并显示当前页减1页 */
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 1) + ')">' + ($pageIndex - 1) + '</a></li>';
        $pageinfo += '<li class="active"><a>' + $pageIndex + '</a></li>';
        if ($pageCount > 2) { /* 总页数大于2时，显示当前页加1页 */
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 1) + ')">' + ($pageIndex + 1) + '</a></li>';
        }
        if ($pageCount > 3) { /* 总页数大于3时，显示当前页加2页 */
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 2) + ')">' + ($pageIndex + 2) + '</a></li>';
        }
        if ($pageCount > 5) { /* 总页数大于5时，显示末页 */
            $pageinfo += '<li><a>...</a></li>';
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + $pageCount + ')">' + $pageCount + '</a></li>';
        }
    } else if (($pageCount - $pageIndex) >= 2 && $pageIndex > 2) { /* 当前页大于2并且总页数减当前页大于等于2时，选中当前页，并显示当前页减1、2加1、2页 */
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 2) + ')">' + ($pageIndex - 2) + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 1) + ')">' + ($pageIndex - 1) + '</a></li>';
        $pageinfo += '<li class="active"><a>' + $pageIndex + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 1) + ')">' + ($pageIndex + 1) + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 2) + ')">' + ($pageIndex + 2) + '</a></li>';
        if ($pageIndex + 2 < $pageCount) { /* 总页数大于5时，显示末页 */
            $pageinfo += '<li><a>...</a></li>';
            $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + $pageCount + ')">' + $pageCount + '</a></li>';
        }
    } else if (($pageCount - $pageIndex) == 1) { /* 总页数减当前页大于等于1时，选中当前页，并显示当前页减1、2加1页 */
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 2) + ')">' + ($pageIndex - 2) + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 1) + ')">' + ($pageIndex - 1) + '</a></li>';
        $pageinfo += '<li class="active"><a>' + $pageIndex + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 1) + ')">' + ($pageIndex + 1) + '</a></li>';
    } else if (($pageCount - $pageIndex) == 0) { /* 总页数减当前页大于等于0时，选中当前页，并显示当前页减1、2页 */
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 2) + ')">' + ($pageIndex - 2) + '</a></li>';
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex - 1) + ')">' + ($pageIndex - 1) + '</a></li>';
        $pageinfo += '<li class="active"><a>' + $pageIndex + '</a></li>';
    }
    /* 数字分页结束 */
    /* 当前页小于总页数时，下一页、尾页有效 */
    if ($pageIndex < $pageCount) {
        $pageinfo += '<li><a href="javascript:void(0);" onclick="LoadData(' + ($pageIndex + 1) + ')">下一页&#160;&gt;</a></li>';
    } else {
        $pageinfo += '<li class="disabled"><a>下一页&#160;&gt;</a></li>';
    }
    $pageinfo += '</ul>';
    $pageinfo += '<ul class="page-skp"><li>跳转到第</li><li><input class="form-control text-center page-skip1" onchange="return doGotoPage(' + $pageCount + ');" type="text" value="' + $pageIndex + '" /></li><li>页</li>';

    /* 装载分页信息 */
    $pageDiv.html($pageinfo);
}

/*
* 分页跳转处理
* $allpage 总页数
*/
var doGotoPage = function($allpage) {
    var $page = $(".page-skip1").val();
    /* 验证正整数 */
    if (!/^\d+$/.test($page)) {
        return false;
    }
    /* 必须大于0 */
    if ($page <= 0) {
        return false;
    }
    /* 超出最大页数时不跳转 */
    if ($page > $allpage) {
        return false;
    }
    /* 加载输入页数据 */
    LoadData($page);
}