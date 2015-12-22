$(function () {
    var panelId = "_panelId_",
        parentContainer = $("#" + panelId).parent();



    var setListTitle = function setListTitle(title) {
        var listContainer = parentContainer.find('.content-list');
        if (listContainer.length) {
            var titleRegion = listContainer.find('li.title');
            if (titleRegion.find('h4').length) {
                titleRegion.find('h4').text(title)
            }
            else {
                titleRegion.text(title);
            }
        }
    };


    var setBreadcrumbsTitle = function setBreadcrumbsTitle(title) {
        var breadcrumbsContainer = parentContainer.find('div.breadcrumbs');
        if (breadcrumbsContainer.length) {
            var breadcrumbUL = breadcrumbsContainer.find('ul'),
                breadcrumbItem = breadcrumbUL.find('li.crumbs')[0],
                newItem = $(breadcrumbItem).clone();
            //最后一项不需要链接
            newItem.find('div.text a').html(title);
            breadcrumbUL.append(newItem);
        }
    }

    if (window.location.search) {
        var paras = window.location.search.replace('?', '').split('&');
        for (var i = 0, ii = paras.length; i < ii; i++) {
            if (paras[i].indexOf('cat') === 0) {
                var titleText = unescape(paras[i].split('=')[1]);
                setListTitle(titleText);
                setBreadcrumbsTitle(titleText);
            }
        }
    }

    $("#" + panelId).find('a.category-item').on('click', function () {
        var text = $(this).text(),
            paras = window.location.search.replace('?', '').split('&'),
            defaultParas = '';
        for (var i = 0, ii = paras.length; i < ii; i++) {
            if (paras[i].indexOf('cat') < 0) {
                defaultParas += '&' + paras[i].split('=')[0] + '=' + paras[i].split('=')[1]
            }
        }
        window.location.href = $(this).attr('href') + "?cat=" + escape(text) + defaultParas;
        return false;
    });
});