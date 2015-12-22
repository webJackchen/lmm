'use strict';

//angular.module('lanhKdesignApp');                                                  

$(function () {
    //增加summernote的字体样式
    $.summernote.options.fontNames = ['微软雅黑', '黑体', '宋体'].concat($.summernote.options.fontNames);
    $.summernote.options.fontSizes = ['12', '13', '14', '15', '16', '17', '18', '24', '36', '72'];
})

angular.module('lanhKdesignApp')
    .run(['$location', 'storage', function ($location, storage) {
        var urlPara = $location.search();
        if (urlPara['identification']) {
            storage.session.set('kplus_identification', urlPara['identification'])
        }
    }]);