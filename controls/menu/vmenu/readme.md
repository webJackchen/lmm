数据源说明:
data:{
	selectMenus:[
		{
			text:"首页",				//标题
			href:"http://www.baidu.com" //链接地址
		},{
			text:"新闻",				 //标题
			href:"http://www.baidu.com", //链接地址
			childs:[
				{
					text:"国际新闻",			//标题
					href:"http://www.baidu.com" //链接地址
				}，
				{
					text:"国内新闻",			//标题
					href:"http://www.baidu.com" //链接地址
				}
			]
		}
	]
}

用法:
{{menu  in data.selectMenus}}
	-> {{ menu.text }}
	-> {{ menu.href }}
	//childs
	-> {{childMenu in menu.childs}}
		-> {{childMenu.text}}
		-> {{childMenu.href}}