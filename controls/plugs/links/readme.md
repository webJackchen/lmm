数据源说明:
data:{
	col: 30,		//列数
	row: 1,			//行数
	width: 30,		//宽度(百分比)
	type: "text",	//展现形式
	links: [{
		hyperLink:{
			text: "http://www.baidu.com/"	//链接地址
		},
		title: {
			text: "百度"					//链接名称
		},
		image:{
			url: "abc.jpg"					//图片地址
		}
	}],
}
用法:
{{ data.col }}
{{ data.row }}
{{ data.width }}
{{ data.type }}

{{ link in data.links }}
	->	{{ link.hyperLink.text }}
	->	{{ link.title.text }}
	->	{{ link.image.url }}