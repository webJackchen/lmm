����Դ˵��:
data:{
	$title$:{
		text:"ͼƬ����"			//����
	},
	$pubdate$:{
		text: "2015-09-02"		//����
	}��
	$visitcount$:{
		text: 20				//�����
	},
	$content$:{
		text: ""				//ͼ��չʾ
	},
	file: "false" ,				//�Ƿ���ʾ��������  true  ��ʾ��false ����ʾ
	$enclosure$:{
		text:  "a.jpg"			//����
	}
}

�÷�:
{{data.$title$.text}}
{{data.$pubdate$.text}}
{{data.$visitcount$.text}}
{{data.$content$.text}}
{{data.file}}
{{data.$enclosure$.text}}