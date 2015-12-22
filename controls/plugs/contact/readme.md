数据源说明:
data:{
	areaKey: "1600029039",						//唯一值（不用关心）
	hideTitle: false,							//是否隐藏标题
	title: "蓝海基业",								//标题
	displayFields: [{
		key: "person",								//列名(Key)
		name: "联系人",								//列名
		text: "李四"								//列值
	}],
}
用法:
{{ data.areaKey }}
{{ data.hideTitle }}
{{ data.title }}

{{ fieldItem in data.displayFields }}
	->	{{ fieldItem.key }}
	->	{{ fieldItem.name }}
	->	{{ fieldItem.text }}