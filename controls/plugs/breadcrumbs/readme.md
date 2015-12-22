数据源说明:
data:{
	title: "请输入文字",							//文本内容
	settingStyle: "font-size: 12px; color: black;",	//字体样式
	delimiter: "->",								//分隔符
	source: [{
		text: "首页",								//节点名称
		href: "/web/default.html"					//节点链接
	}],
}
用法:
{{ data.title }}
{{ data.settingStyle }}
{{ data.delimiter }}

{{ crumbsItem in data.source }}
	->	{{ crumbsItem.text }}
	->	{{ crumbsItem.href }}