����Դ˵��:
data:{
	title: "����������",							//�ı�����
	settingStyle: "font-size: 12px; color: black;",	//������ʽ
	delimiter: "->",								//�ָ���
	source: [{
		text: "��ҳ",								//�ڵ�����
		href: "/web/default.html"					//�ڵ�����
	}],
}
�÷�:
{{ data.title }}
{{ data.settingStyle }}
{{ data.delimiter }}

{{ crumbsItem in data.source }}
	->	{{ crumbsItem.text }}
	->	{{ crumbsItem.href }}