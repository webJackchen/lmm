数据源说明:
data:{
	    col: 2,							//列数
		row: 2,							//行数
		title: "新闻列表",				//内容列表标题
		category: "product",			//类别
		width: "20",					//列表每个元素的宽度
		textAlign: "center",			//内容列表文字对齐方式
		isPaged: "0" ,					//是否分页， 1 显示分页，0不显示分页
		target:"_blank"          //规定在何处打开链接
		$item$:[{  
			url: "http://www.baidu.com", //链接地址
			title:{
				text: "2015蓝海基业英雄会" //内容标题
			}，
			image:{
				url: "a.jpg"				//图片地址
			},
			description:{
				text: "2015蓝海基业英雄会如期举行" //描述
			},
			pubDate:{
				text: "2015-09-02"			//发布日期
			},
			visitCount:{
				text: 10					//浏览次数
			},
			moduleInfo:{
				sale:{
					text: 20.00				//产品价格
				}
			}
		}]
}

用法:
{{data.col}}
{{data.row}}
{{data.title}}
{{data.category}}
{{data.width}}
{{data.textAlign}}
{{data.isPaged}}
{{data.target}}

{{dataItem  in data.$item$}}
	-> {{ dataItem.url }}
	-> {{ dataItem.title.text }}
	-> {{ dataItem.image.url }}
	-> {{ dataItem.description.text }}
	-> {{ dataItem.pubDate.text }}
	-> {{ dataItem.visitCount.text }}
	-> {{ dataItem.moduleInfo.sale.text }}