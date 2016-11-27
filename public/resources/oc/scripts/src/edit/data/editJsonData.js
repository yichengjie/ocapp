define(function (require, exports, module) {
    var jsonDate = {
      advancedPurchasePeriodList:[//提前购票时间单位
        {"name":"分","value":"Nb"}, {"name":"小时","value":"Hb"},
        {"name":"天","value":"Db"}, {"name":"月","value":"Mb"}
      ],//advancedPurchasePeriodList end
      tableData:{
        "list170VO":{
  			"addObj":{"saleGeographicPointType":"","saleGeographicPoint":"","specFeeAmount":"","specFeeCurrency":"CNY","selected":true}
  		  },
        "list198VO":{
            "addObj":{"mktOp":"","cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true}
        },
        "list198UpgradeVO":{
          "addObj":{"mktOp":"","cxr":"","rbd1":"","rbd2":"","rbd3":"","rbd4":"","rbd5":"","selected":true} 
        },
        "list196VO":{
            "addObj":{"count":"","code":"","selected":true}
        },
        "list186VO":{
            "addObj":{"mktCarrier":"","optCarrier":"","fltNo1":"","fltNo2":"","selected":true}
        },
        "list183VO":{
            "addObj":{"travelAgency":"","carrierGds":"","dutyFunctionCode":"","geographicSpecificationType":"","geographicSpecification":"","codeType":"","code":"","viewBookTkt":"","selected":true}
        },
        "list165VO":{
            "addObj":{"equipmentCode":"","selected":true}
        },
        "list171VO":{
            "addObj":{"carrier":"","resFareClassCode":"","fareTypeCode":"","selected":true}
        },
        "list172VO":{
            "addObj":{"accountCode":"","selected":true}
        },
        "list173TicketVO":{
            "addObj":{"ticketDesignator":"","selected":true}
        },
        "list173TktVO":{
            "addObj":{"ticketDesignator":"","selected":true}
        },
        "list178Loc1":{
            "addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
        },
        "list178Loc2":{
            "addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
        },
        "list178Loc3":{
            "addObj":{"geoLocType":"","geoLocSpec":"","appl":"","selected":true}
        }
      },//table end
      weightUnitList:[//行李重量单位集合
        {"name":"选择","value":""},{"name":"千克","value":"K"},{"name":"磅","value":"P"}
      ],
      specServiceFeeColSubList:[	//SPEC_SERVICE_FEE_COL_SUB//包含/扣除
	       {"name":"包含在票价中","value":"I"},{"name":"单独收费","value":""}
      ],
      noChargeNotAvailableList:[//免费/收费
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      specServiceFeeNetSellList:[//净价/销售价
        {"name":"销售价","value":""},{"name":"净价","value":"N"}
      ],
      baggageTravelApplicationList:[
        {"name":"必须匹配所有的航段","value":"A"},{"name":"至少匹配一个航段","value":"S"},
        {"name":"必须匹配旅行航段中的主航段","value":"M"},{"name":"必须匹配整个行程的每一段","value":"J"},
        {"name":"不限制","value":""}
      ],
      noCharge_notAvailableList:[
        {"name":"收费","value":""},{"name":"不适用","value":"X"},
        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
      ],
      cabinList:[//舱位list集合
        {"name":"R-豪华头等舱","value":"R"},{"name":"F-头等舱","value":"F"},
        {"name":"J-豪华商务舱","value":"J"},{"name":"C-商务舱","value":"C"},
        {"name":"P-豪华经济舱","value":"P"},{"name":"Y-经济舱","value":"Y"}
      ],
      geoLocTypeList:[//区域集合
        {"name":"选择","value":""},
				{"name":"大区","value":"A"},{"name":"城市","value":"C"},
				{"name":"国家","value":"N"},{"name":"机场","value":"P"},
				{"name":"州","value":"S"},{"name":"区域","value":"Z"}
      ],
      indicatorReissueRefundList:[
         {"name":"不可退款","value":"N"},
         {"name":"可退款","value":"Y"}, {"name":"可改","value":"R"}
      ],
      formOfRefundList:[//退款形式
        {"name":"选择","value":""},{"name":"按原付款渠道退款","value":"1"},
				{"name":"按电子凭证退款","value":"2"}
      ],
     
      geoSpecExceptionStopUnitList:[
        {"name":"选择","value":""},{"name":"分","value":"N"},
        {"name":"小时","value":"H"},{"name":"天","value":"D"},
        {"name":"周","value":"W"},{"name":"月","value":"M"}
      ],
      timeApplicationList:[
        {"name":"选择","value":""},{"name":"分别","value":"D"},
				{"name":"之间","value":"R"}
      ],
      effectivePeriodTypeList:[	//effective_period_type//延长类型
        {"name":"选择","value":""},{"name":"距购买服务后","value":"A"},
        {"name":"距服务兑换后","value":"B"},{"name":"距航班起飞前","value":"D"}
        
      ],
      effectivePeriodUnitList:[	//effective_period_unit//延长时间单位
        {"name":"天","value":"D"},{"name":"月","value":"M"},
        {"name":"小时","value":"H"}
      ]
    } ;
   return jsonDate ;
}) ;
