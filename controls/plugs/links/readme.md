����Դ˵��:
data:{
	col: 30,		//����
	row: 1,			//����
	width: 30,		//���(�ٷֱ�)
	type: "text",	//չ����ʽ
	links: [{
		hyperLink:{
			text: "http://www.baidu.com/"	//���ӵ�ַ
		},
		title: {
			text: "�ٶ�"					//��������
		},
		image:{
			url: "abc.jpg"					//ͼƬ��ַ
		}
	}],
}
�÷�:
{{ data.col }}
{{ data.row }}
{{ data.width }}
{{ data.type }}

{{ link in data.links }}
	->	{{ link.hyperLink.text }}
	->	{{ link.title.text }}
	->	{{ link.image.url }}