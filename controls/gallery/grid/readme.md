����Դ˵��:
data:{
	attrs:{
		col: "2",	//����
		row: "2"	//����
	},
	$item$: [{
		hyperLink:{
			text: "http://www.baidu.com"	//Url��ַ
		},
		image:{
			url: "abc.jpg"	//ͼƬ��ַ
		},
		allTitle:{
			text:"title"	//ͼƬ����
		}
	},
	...
	]
}
�÷�:
{{ data.attrs.col }}
{{ data.attrs.row }}

{{ imageItem in data.$item$ }}
	-> {{ imageItem.hyperLink.text }}
	-> {{ imageItem.image.url }}
	-> {{ imageItem.allTitle.text }}