数据源说明:
data:{
	$title$:{
		text:"图片下载"			//标题
	},
	$pubdate$:{
		text: "2015-09-02"		//日期
	}，
	$visitcount$:{
		text: 20				//点击量
	},
	$price$:{
		text: ""				//薪资待遇
	},
	$sex$:{
		text: ""				//性别要求
	},
	$hnumber$:{
		text: ""				//有效日期
	},
	$rank$:{
		text: ""				//学历要求
	},
	$configure$:{
		text: ""				//工作经验
	},
	$address$:{
		text: ""				//工作地点
	},
	$stock$:{
		text: ""				//招聘人数
	},
	$content$:{
		text: ""				//图文展示
	},
	btntext: "职位申请"	，		//按钮文字
	wage:  "false" ,			//是否显示 薪资待遇，true 显示  false  隐藏  
	sex:  "false" ,				//是否显示 性别要求，true 显示  false  隐藏  
	date:  "false" ,			//是否显示 有效日期，true 显示  false  隐藏  
	record:  "false" ,			//是否显示 学历要求，true 显示  false  隐藏  
	experience:  "false" ,		//是否显示 工作经验，true 显示  false  隐藏  
	address:  "false" ,			//是否显示 工作地点，true 显示  false  隐藏  
	number:  "false" ,			//是否显示 招聘人数，true 显示  false  隐藏 
}

用法:
{{data.$title$.text}}
{{data.$pubdate$.text}}
{{data.$visitcount$.text}}
{{data.$content$.text}}

{{data.$price$.text}}
{{data.$sex$.text}}
{{data.$hnumber$.text}}
{{data.$rank$.text}}
{{data.$configure$.text}}
{{data.$address$.text}}
{{data.$stock$.text}}