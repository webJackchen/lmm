//编辑器插件示例：
(function ($, angular) {
	'use strict';
	// 先获取编辑器模板和实例
	var tmpl = $.summernote.renderer.getTemplate();
	//var editor = $.summernote.eventHandler.getEditor();


	$.summernote.addPlugin({
		// 插件的名字
		name: 'lanh_link',

		init: function (layoutInfo) { // 初始化事件
			//// 编辑器的jquery对象
			//var $note = layoutInfo.holder();

			//// 注册编辑器的事件
			//$note.on('summernote.focus', function (customEvent, nativeEvent) {
			//    showLayer(nativeEvent.target);
			//});
			//$note.on('summernote.update', function (customEvent, nativeEvent) {
			//    var $boldButton = $(this).summernote('toolbar.get', 'bold');
			//    $boldButton.toggleClass('active').css({
			//        color: 'red'
			//    });
			//});

			//$note.on('summernote.blur', function (customEvent, nativeEvent) {
			//    hideLayer(nativeEvent.target);
			//    var $boldButton = $(this).summernote('toolbar.get', 'bold');
			//    $boldButton.removeClass('active').css({
			//        color: 'inherit'
			//    });
			//});
			////往编辑器里面写东西
			//$note.summernote('insertText', 'plugin start.');
		},

		buttons: { //这里的按钮可以添加到编辑器里面			
			lanh_link: function () {//‘lanh_link’ 这个名字会被当成key来使用，跟上面那个name保持一致

				// 这个按钮长什么样子
				return tmpl.iconButton('fa fa-link', {
					event: 'lanh_link',//事件对应的handler名称，内部是通过（jq data-event）事件的方式去匹配事件的
					title: 'Lanh Link',//tip内容
					hide: true
				});
			}
		},
		events: { // 事件--在目前这个系统中，会在angular指令里面进行覆盖，所以这里的事件有可能不会执行
			lanh_link: function (event, editor, layoutInfo, value) {
				// 获取编辑器的编辑区
				//var $editable = layoutInfo.editable();

				// 操作编辑器内容
				//editor.insertText($editable, 'hello ');
				// or 
				// layoutInfo.holder().summernote("insertText", "Hello");
				var editor$ = layoutInfo.holder();
				editor$.trigger('lanhlink.click', {
					event: event,
					editor: editor,
					layoutInfo: layoutInfo,
					value: value
				});
			}
		}
	});
})(jQuery, angular);