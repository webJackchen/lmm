数据源说明:
data:{
	attrs:{
		autoPlayInterval: 1000,	//播放间隔时间(毫秒)
		autoPlay: true,			//自动切换
		event: "click",			//鼠标事件方式
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
{{ data.attrs.autoPlayInterval }}
{{ data.attrs.autoPlay }}
{{ data.attrs.event }}

{{ imageItem in data.$item$ }}
	-> {{ imageItem.hyperLink.text }}
	-> {{ imageItem.image.url }}
	-> {{ imageItem.allTitle.text }}