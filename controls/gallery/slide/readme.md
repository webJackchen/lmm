����Դ˵��:
data:{
	attrs:{
		autoPlayInterval: 1000,	//���ż��ʱ��(����)
		autoPlay: true,			//�Զ��л�
		isShowIcon: true,		//�Ƿ���ʾ���Ұ�ť
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
{{ data.attrs.autoPlayInterval }}
{{ data.attrs.autoPlay }}
{{ data.attrs.isShowIcon }}

{{ imageItem in data.$item$ }}
	-> {{ imageItem.hyperLink.text }}
	-> {{ imageItem.image.url }}
	-> {{ imageItem.allTitle.text }}