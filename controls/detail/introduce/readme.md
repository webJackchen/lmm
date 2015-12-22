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
	$content$:{
		text: ""				//图文展示
	}
}

用法:
{{data.$title$.text}}
{{data.$pubdate$.text}}
{{data.$visitcount$.text}}
{{data.$content$.text}}