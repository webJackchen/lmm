$(function () {
    var panelId = '_panelId_',
        ctrlObj = $('#' + panelId).children(".contact");
    if (!window.lanh) {
        //$.get(lanh.apiPath + "proxy?isContact=true")
        $.get('/action/item_list?m=contact&i=0&type=json')
            .success(function (result) {
                var kplusObj = JSON.parse(result) || {},
                    kplusList = kplusObj.channel.item !== '0' ? kplusObj.channel.item : [],
                    customFields = kplusObj.channel.attributeTitle && kplusObj.channel.attributeTitle.item;

                if (!(kplusList instanceof Array)) kplusList = [kplusList];
                if (!!customFields) {
                    if (!(customFields instanceof Array)) customFields = [customFields];
                }
                var queryItems = $.grep(kplusList, function (item) {
                    return item.link.text == ctrlObj.data('areakey');
                });

                if (queryItems && queryItems.length) {
                    var areaItem = queryItems[0],
                        moduleObject = areaItem.moduleInfo,
                        queryItemKeys = Object.keys(moduleObject);
                    for (var i = 0, j = queryItemKeys.length; i < j; i++) {
                        var fieldInfo = moduleObject[queryItemKeys[i]],
                            fieldDom = ctrlObj.find('#field_' + queryItemKeys[i]);
                        if (fieldDom.length) fieldDom.text(fieldInfo && fieldInfo.text);
                    }

                    if (customFields.length > 0) {
                        for (var i = 0, j = customFields.length; i < j; i++) {
                            var customField = customFields[i],
                                key = customField.key,
                                fieldInfo = areaItem[key],
                                fieldDom = ctrlObj.find('#field_' + key);

                            if (fieldDom.length) fieldDom.text(fieldInfo && fieldInfo.text);
                        }
                    }
                }
            })
    }
});