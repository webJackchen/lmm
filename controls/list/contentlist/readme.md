����Դ˵��:
data:{
	    col: 2,							//����
		row: 2,							//����
		title: "�����б�",				//�����б����
		category: "product",			//���
		width: "20",					//�б�ÿ��Ԫ�صĿ��
		textAlign: "center",			//�����б����ֶ��뷽ʽ
		isPaged: "0" ,					//�Ƿ��ҳ�� 1 ��ʾ��ҳ��0����ʾ��ҳ
		target:"_blank"          //�涨�ںδ�������
		$item$:[{  
			url: "http://www.baidu.com", //���ӵ�ַ
			title:{
				text: "2015������ҵӢ�ۻ�" //���ݱ���
			}��
			image:{
				url: "a.jpg"				//ͼƬ��ַ
			},
			description:{
				text: "2015������ҵӢ�ۻ����ھ���" //����
			},
			pubDate:{
				text: "2015-09-02"			//��������
			},
			visitCount:{
				text: 10					//�������
			},
			moduleInfo:{
				sale:{
					text: 20.00				//��Ʒ�۸�
				}
			}
		}]
}

�÷�:
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