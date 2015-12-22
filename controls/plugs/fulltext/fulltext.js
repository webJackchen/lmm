$(function () {
    var panelId = '_panelId_',
        ctrlObj = $('#' + panelId).children(".fulltext-search");

    if (!window.lanh) {
        var getUrlPara = function () {
            var urlPara = (window.location.search || '').replace('?', ''), urlParaSplits = urlPara.split('&'), result = {};
            for (var i = 0, ii = urlParaSplits.length; i < ii; i++) {
                var paraItems = urlParaSplits[i].split('=');
                result[paraItems[0]] = paraItems[1];
            }
            return result;
        }
        //点击输入框就隐藏placeholder
        //ctrlObj.find('#txtSearch')
        //    .on('focus', function () {
        //        ctrlObj.find('#txtSearch').data('placeholder', $(this).attr('placeholder'));
        //        $(this).attr('placeholder', '');
        //    }).on('blur', function () {
        //        $(this).attr('placeholder', $(this).data('placeholder'));
        //    });

        ctrlObj.find('#btnSearch').on('click', function () {
            var searchKey = ctrlObj.find('#txtSearch').val();
            if (searchKey) {
                var paras = getUrlPara();
                delete paras.sk;
                delete paras.searchKey;
                delete paras.titleKey;

                window.location.href = 'http://' + window.location.host + '/web/fulltextresult.html?' + $.param(paras) + '&sk=' + encodeURIComponent(searchKey);
            }
            return false;
        });
    }

});