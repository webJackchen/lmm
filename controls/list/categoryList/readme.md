����Դ˵��:
data:{
	data:{
		text:"����",                 //����
		src:"http://www.baidu.com", //���ӵ�ַ
		target:"_blank"          //�涨�ںδ�������
	}
}

�÷�:
{{categoryItem  in data.data}}
	-> {{ categoryItem.text }}
	-> {{ categoryItem.src }}
	-> {{ categoryItem.target }}