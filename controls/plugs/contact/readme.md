����Դ˵��:
data:{
	areaKey: "1600029039",						//Ψһֵ�����ù��ģ�
	hideTitle: false,							//�Ƿ����ر���
	title: "������ҵ",								//����
	displayFields: [{
		key: "person",								//����(Key)
		name: "��ϵ��",								//����
		text: "����"								//��ֵ
	}],
}
�÷�:
{{ data.areaKey }}
{{ data.hideTitle }}
{{ data.title }}

{{ fieldItem in data.displayFields }}
	->	{{ fieldItem.key }}
	->	{{ fieldItem.name }}
	->	{{ fieldItem.text }}