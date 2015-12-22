数据源说明:
data:{
	$link$:{
		text:"图片下载"			//商品ID
	},
	$isvip$:{
		text: "0"		       //是否是会员，0  不是、1 是
	}，
	host:"",                   //域名
	$image$:{
		text:""                //图片名称
	},
	$item$:{    
		$imagelist$:{          //商品的图片展示
			$item$:[{
				title:""
			}]
		}，
		$attribute$：{         //自定义属性
			$item$:[{
				title:"",     //自定义属性名称
				text:""       //自定义属性值
			}]
		}
	},
	$visitcount$:{
		text:""              //访问次数
	},
	$title$:{
		text:""              //标题
	},
	$description$:{
		text:""             //描述
	},
	$moduleInfo$:{ 
		$sale$:{
			text:""        //市场价
		},
		$stock$:{
			text:""       //库存
		}
	},
	$vipPrice$:{
		text:""          //VIP价格
	}
	$content$:{
		text: ""	     //图文展示
	},
	btntext:"" ,        //按钮名称
	$special$:{
		text:""        //品牌名称
	},
	$developers$:{
		text:""        //生产商
	},
	$rank$:{
		text:""       //商品毛重
	},
	$green$:{
		text:""      //保质期
	}
}

用法:
{{data.$title$.text}}
{{data.$visitcount$.text}}
{{data.$content$.text}}