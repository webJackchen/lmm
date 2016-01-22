$(function () {
    var panelId = '_panelId_',
        ctrlObj = $('#' + panelId).children(".fulltext-search-result");
    if (window.lanh) {
        ctrlObj.find('.search-list-region').show();
    }
    else {
        $('#' + panelId).css({
            overflow: 'visible'
        });

        ctrlObj.find('#btnSearch').on('click', function () {
            var searchKey = ctrlObj.find('#txtSearch').val();
            executeSearch(searchKey);
            return false;
        });

        var getUrlPara = function () {
            var urlPara = (window.location.search || '').replace('?', ''), urlParaSplits = urlPara.split('&'), result = {};
            for (var i = 0, ii = urlParaSplits.length; i < ii; i++) {
                var paraItems = urlParaSplits[i].split('=');
                result[paraItems[0]] = paraItems[1];
            }
            return result;
        }

        var executeSearch = function (keyword) {
            $.get('/action/item_list?top=1000000&m=news,product,goods&type=json&titlekey=' + encodeURIComponent(keyword) || '')
                .success(function (result) {
                    var kplusObj = JSON.parse(result) || {},
                        kplusList = kplusObj.channel.item !== '0' ? kplusObj.channel.item : [];
                    if (!(kplusList instanceof Array)) kplusList = [kplusList]
                    renderResult(kplusObj.channel, kplusList);
                })
                .fail(function () {
                    renderResult({}, []);
                });
        }

        var init = function () {
            var urlParas = getUrlPara(),
                searchKey = urlParas['titlekey'] || urlParas['sk'];
            if (searchKey) {
                $('#txtSearch').val(decodeURIComponent(searchKey));
            }
            executeSearch(searchKey);
        }
        init();

        var renderResult = function (obj, dataList) {
            var containerTemplate = ctrlObj.find('ul.result-list'),
                itemTemplate = containerTemplate.find('li.result-item');
            containerTemplate.empty();
            if (!dataList.length) {
                ctrlObj.find('.search-list-region').hide();
                ctrlObj.find('.search-list-no').show();
            }
            else {
                ctrlObj.find('.result-total-text').html('共搜索到 ' + obj.allcount + ' 条结果');

                ctrlObj.find('.search-list-region').show();
                ctrlObj.find('.search-list-no').hide();
                for (var i = 0, ii = (dataList || []).length; i < ii; i++) {
                    var dataItem = dataList[i], newItemTemplate = itemTemplate.clone();
                    var paras = getUrlPara();
                    delete paras.sk;
                    delete paras.searchKey;
                    delete paras.titleKey;

                    var linkUrl = dataItem.url;
                    if (linkUrl.indexOf('?') > 0) {
                        linkUrl += '&' + $.param(paras);
                    }
                    else {
                        linkUrl += '?' + $.param(paras);
                    }

                    newItemTemplate.find('#lnk-region').attr('href', linkUrl);
                    newItemTemplate.find('.title').html(dataItem.allTitle.text);
                    newItemTemplate.find('.thumbnails').html('<img alt="' + dataItem.allTitle.text + '" style="width:100px;height:90px;" src="' + 'http://' + obj.host + dataItem.image.url + '"/>');
                    newItemTemplate.find('.description').html('【摘要】' + dataItem.description.text);
                    newItemTemplate.find('.text-time').html('【时间】' + dataItem.pubDate.text);
                    containerTemplate.append(newItemTemplate);
                }
            }
        }
    }
});