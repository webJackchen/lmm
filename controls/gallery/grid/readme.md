数据源说明:
data:{
	attrs:{
		col: "2",	//列数
		row: "2"	//行数
	},
	$item$: [{
		hyperLink:{
			text: "http://www.baidu.com"	//Url地址
		},
		image:{
			url: "abc.jpg"	//图片地址
		},
		allTitle:{
			text:"title"	//图片名称
		}
	},
	...
	]
}
用法:
{{ data.attrs.col }}
{{ data.attrs.row }}

{{ imageItem in data.$item$ }}
	-> {{ imageItem.hyperLink.text }}
	-> {{ imageItem.image.url }}
	-> {{ imageItem.allTitle.text }}