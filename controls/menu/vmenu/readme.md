����Դ˵��:
data:{
	selectMenus:[
		{
			text:"��ҳ",				//����
			href:"http://www.baidu.com" //���ӵ�ַ
		},{
			text:"����",				 //����
			href:"http://www.baidu.com", //���ӵ�ַ
			childs:[
				{
					text:"��������",			//����
					href:"http://www.baidu.com" //���ӵ�ַ
				}��
				{
					text:"��������",			//����
					href:"http://www.baidu.com" //���ӵ�ַ
				}
			]
		}
	]
}

�÷�:
{{menu  in data.selectMenus}}
	-> {{ menu.text }}
	-> {{ menu.href }}
	//childs
	-> {{childMenu in menu.childs}}
		-> {{childMenu.text}}
		-> {{childMenu.href}}