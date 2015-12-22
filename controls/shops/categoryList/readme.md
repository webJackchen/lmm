数据源说明:
data:{
	data:{
		text:"新闻",                 //名称
		src:"http://www.baidu.com", //链接地址
		target:"_blank"          //规定在何处打开链接
	}
}

用法:
{{categoryItem  in data.data}}
	-> {{ categoryItem.text }}
	-> {{ categoryItem.src }}
	-> {{ categoryItem.target }}