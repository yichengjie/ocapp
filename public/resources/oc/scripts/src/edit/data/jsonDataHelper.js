define(function (require, exports, module) {
	var _ = require('underscore') ;
	var util = require('../util/commonUtil') ;
	var editJsonData = require("./editJsonData") ;

	module.exports = {
		getNoChargeNotAvailableList:function(serviceType){
			var tmp = serviceType || '' ;
			var retArr = [] ;//{"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}
			var defaultArr = [{"name":"收费","value":""},{"name":"不适用","value":"X"},
		        {"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
		        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"}] ;
			if(tmp=='A'){
				retArr = [{"name":"不适用","value":"X"},{"name":"免费，不出EMD单","value":"F"},{"name":"免费，出EMD单","value":"E"},
		        {"name":"免费，不出EMD单，不要求预定","value":"G"},{"name":"免费，出EMD单，不要求预定","value":"H"},
		        {"name":"免费，行李规则遵循市场方航空公司规则","value":"D"},{"name":"免费，行李规则遵循承运方航空公司规则","value":"O"}] ;
			} else if (tmp=='B'){
				retArr = [{"name":"免费，不出EMD单","value":"F"}] ;
			}else if (tmp=='E'){
				retArr = [{"name":"不适用","value":"X"}] ;
			}else{
				retArr = defaultArr ;
			}
			return retArr ;
		},
		getSpecifiedServiceFeeAppList:function(serviceType){/**适用于**/
			var tmp = serviceType || '' ;
			var arr = [{"name":"每一个票价组成部分算一次服务费用","value":"1"},
  				{"name":"每一个票价组成部分算一半的服务费用","value":"2"},{"name":"每用一次服务算一次服务费用","value":"3"},
  				{"name":"匹配的部分航程算一次服务费用","value":"4"},{"name":"服务收费对应每张售票","value":"5"}] ;
			switch(tmp){
			case 'F':
			  arr = [{"name":"每一个票价组成部分算一次服务费用","value":"1"},
  				{"name":"每一个票价组成部分算一半的服务费用","value":"2"},{"name":"每用一次服务算一次服务费用","value":"3"},
  				{"name":"匹配的部分航程算一次服务费用","value":"4"},{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'M':
			  arr = [{"name":"每用一次服务算一次服务费用","value":"3"}] ;
			  break;
		    case 'R':
			   arr = [{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'T':
			   arr = [{"name":"每用一次服务算一次服务费用","value":"3"},{"name":"服务收费对应每张售票","value":"5"}] ;
			  break;
			case 'A':
			  arr=[] ;
			  break;
			case 'B':
			  arr=[] ;
			  break;
			case 'C':
			  arr=[
			  {"name":"按托运点收费","value":"3"},{"name":"按全行程收费","value":"4"},
  				{"name":"每公斤按公布运价的0.5%收费","value":"H"},{"name":"每公斤按公布运价的1%收费","value":"C"},
  				{"name":"每公斤按公布运价的1.5%收费","value":"P"},{"name":"按每公斤收费","value":"K"},
  				{"name":"按每5公斤收费","value":"F"}] ;
			  break;
			case 'E':
			  arr=[] ;
			  break;
			case 'P':
			  arr=[
			  {"name":"按托运点收费","value":"3"},{"name":"按全行程收费","value":"4"},
  				{"name":"每公斤按公布运价的0.5%收费","value":"H"},{"name":"每公斤按公布运价的1%收费","value":"C"},
  				{"name":"每公斤按公布运价的1.5%收费","value":"P"},{"name":"按每公斤收费","value":"K"},
  				{"name":"按每5公斤收费","value":"F"}] ;
			  break;
			default:
			  console.info('传入的serviceType有问题') ;
			}	
			return arr ;
		},
		getgeoSpecSectPortJourneyList:function  (serviceType) {
			var tmp = serviceType || '' ;//geoSpecSectPortJourneyList
			var arr = [{"name":"Sector","value":"S"},
				{"name":"Portion","value":"P"},{"name":"Journy","value":"J"}] ;
			var isBaggageFlag = util.checkBaggageServcie(tmp) ;
			if(_.contains(['B','E'], tmp)){
				arr = [{"name":"Sector","value":"S"}] ;
			}else if(_.contains(['A','C','P'], tmp)){
				arr = [{"name":"选择","value":""},{"name":"Portion","value":"P"},{"name":"Journy","value":"J"}] ;
			}else if(_.contains(['M','R','T'], tmp)){
				arr = [{"name":"选择","value":""}] ;
			}else if(tmp=='F'){
				arr = [{"name":"Sector","value":"S"},{"name":"Portion","value":"P"}] ;
			}
			return arr ;
		},
		convert2TableDataList:function  (list,tbname) {
			list = list || [] ;
			var len = list.length ;
			var retList = [] ;
			var tmpObj = editJsonData['tableData'][tbname]['addObj'] ||{};
			var propArr = [] ;
			for (var prop in tmpObj) {
				if(prop!='selected'){
					propArr.push(prop) ;
				}
			}
			_.each(list,function (item) {
				var obj = {} ;
				_.each(propArr,function(prop){
					obj[prop] = item[prop] || '' ;
				}) ;
				retList.push(obj) ;
			}) ;
			return retList ;
		}
	} ;

}) ;