define(function(require, exports, module) {
	var util = {};
	//将查询的s7数据转换为‘FormData’
	util.convertS7ToFormData = function(s7,formData){
		for(var p in formData) {
			var flag =  s7.hasOwnProperty(p);
			if(flag){
				var tmpStr = s7[p]  ;
				formData[p] =  tmpStr ;
			}
		}
		//2.填充部分特殊数据
		formData.sel1.showStr = s7.basicInfoVo.serviceGroupDescription ;
		formData.sel2.showStr = s7.basicInfoVo.subGroupDescription ;
		formData.sel3.showStr = s7.basicInfoVo.commercialName ;
		formData.sel1.value = s7.basicInfoVo.serviceGroup ;
		formData.sel2.value = s7.basicInfoVo.subGroup ;
		formData.sel3.value = s7.basicInfoVo.subCode ;
		
	}
	
	//提交表单时将formData转换为s7
	util.convertFormDataToS7 = function(formData){
		var s7 = {} ;
		angular.extend(s7,formData) ;
		util.initTravelDate(s7) ;
		util.initDayOfWeek(s7) ;
		//处理部分特殊数据
		//删除后台不存在的属性字段
		delete s7.sel1 ;
		delete s7.sel2 ;
		delete s7.sel3 ;
		delete s7.travelStartDate ;
		delete s7.travelEndDate ;
		delete s7.dayOfWeekShow ;
		return s7 ;
	}
	
	
	util.initTravelDate =function (s7){
		var arr1 = util.getDateArr(s7.travelStartDate) ;
		var arr2 = util.getDateArr(s7.travelEndDate) ;
		s7.firstTravelYear = arr1[0] ;
		s7.firstTravelMonth = arr1[1] ;
		s7.firstTravelDay = arr1[2] ;
		//
		s7.lastTravelYear = arr2[0] ;
		s7.lastTravelMonth = arr2[1] ;
		s7.lastTravelDay= arr2[2] ;
	}
	
	util.initDayOfWeek =function (s7){
		var dayOfWeekShow = s7.dayOfWeekShow ;
		var str = ""  ;
		var index = 1 ;
		for(var t in dayOfWeekShow){
      	var value = dayOfWeekShow[t] ;
			if(value){
				str+= index;
			}
			index ++ ;
		}
		s7.dayOfWeek = str ;
	}
	
	//检查金额是否不为空
	var checkMemonyIsNotNull = function  (data) {
		var list170 = data['list170VO'] ;
		var list201 = data['list201VO'] ;
		if(list170.length==0&&list201.length==0){
			return false;
		}
		return true ;
	}

	//判断金额是否为空
	var testFreeIsNull = function  (data) {
		var list170 = data['list170VO'] ;
		var list201 = data['list201VO'] ;
		if(list170.length>0||list201.length>0){
			return false ;
		}
		return true;
	};



	//检查区域1字段是否为空
	var checkLoc1IsNull = function  (formData) {
		var geoSpecLoc1Type = formData['geoSpecLoc1Type'] || '' ;
		var geoSpecLoc1 = formData['geoSpecLoc1'] ;
		var list178Loc1 = formData['list178Loc1'] ;
		if( (geoSpecLoc1Type==''||geoSpecLoc1=='')&&list178Loc1.length==0){
			return true ;
		}
		return false;
	};
	//检查区域1字段是否为空
	var checkLoc2IsNull = function  (formData) {
		var geoSpecLoc2Type = formData['geoSpecLoc2Type'] || '' ;
		var geoSpecLoc2 = formData['geoSpecLoc2'] ;
		var list178Loc2 = formData['list178Loc2'] ;
		if( (geoSpecLoc2Type==''||geoSpecLoc2=='')&&list178Loc2.length==0){
			return true ;
		}
		return false;
	};

	//检查区域1字段是否为空
	var checkLoc3IsNull = function  (formData) {
		var geoSpecLoc3Type = formData['geoSpecLoc3Type'] || '' ;
		var geoSpecLoc3 = formData['geoSpecLoc3'] ;
		var list178Loc3 = formData['list178Loc3'] ;
		if( (geoSpecLoc3Type==''||geoSpecLoc3=='')&&list178Loc3.length==0){
			return true ;
		}
		return false;
	};



	//校验交单数据是否可以提交
	util.validFormData = function(formData ,orgFormData){
		var serviceType = formData['serviceType'] ;
		//第一个校验
		//其他校验
		//1.表格数据校验[删除表格中的非法数据:eg:第一个字段为空的假数据]
		util.delInValidList(formData) ;
		util.dealOtherData(formData) ;
		//如果适用于为h，c，p
		var hcpFlag = _.contains(['H','C','P'], formData['specifiedServiceFeeApp']) ;
		//console.info("--------------------> " +hcpFlag + "   , " + formData['specifiedServiceFeeApp'] )  ;
		/**1.当收费为收费时,如果适用于不为H,C,P时，金额字段必填，否则金额或则里程费两个不能同时为空*/
		if(formData['noChargeNotAvailable']==''&&!hcpFlag){
			var freeIsNullFlag = testFreeIsNull(formData) ;
			if(formData['specSevFeeAndOrIndicator']=='A'){//或、和字段值为A时
				if(freeIsNullFlag){
					$.showTuiErrorDialog('您选择的支付方式为金额和里程，请填写金额!') ;
					return false;
				}	
			}else{//
				if(formData['specifiedServiceFeeMileage'].length==0&&freeIsNullFlag){//如果里程费为空
					$.showTuiErrorDialog('请填写金额或里程费!') ;
					return false;
				}
			}
		}
		
		var loc1IsNullFlag = checkLoc1IsNull(formData) ;
		var loc2IsNullFlag = checkLoc2IsNull(formData) ;
		var loc3IsNullFlag = checkLoc3IsNull(formData) ;
		if(formData['geoSpecFromToWithin']!=''){//如果不为不限区域则区域必填
			if(loc1IsNullFlag){
				$.showTuiErrorDialog('【区域限制】选择的不是“不限区域”，【区域1】必填！');
				return false;
			}
		}
		if (formData['geoSpecFromToWithin'] == 'W') {
			if(!loc2IsNullFlag||!loc3IsNullFlag){
				$.showTuiErrorDialog('【区域限制】选择了“区域1内部”，【区域2】和【经过区域】不能有值！');
				return false;
			}
		}

		//当‘区域/部分/全程’
		var geoSpecSectPortJourney = formData['geoSpecSectPortJourney'] || '';
		//区域限制
		var geoSpecFromToWithin = formData['geoSpecFromToWithin'] || '';
		//经停类型
		var geoSpecStopConnDes = formData['geoSpecStopConnDes'] || '';
		if(geoSpecSectPortJourney==''){
			if(!loc1IsNullFlag){
				$.showTuiErrorDialog('【Sector/Portion/Journey】为空，【区域1】必须为空!');
				return false;
			}
		}else if(geoSpecSectPortJourney=='P'){//loc1必须有值
			var astr = '' ;
			var flag2= (loc2IsNullFlag&&geoSpecFromToWithin!='W'&&geoSpecStopConnDes!='T') ;
			if(loc1IsNullFlag&&flag2){
				astr = '【sector/portion/journey】选择了portion，【区域1】必填，且：【区域2】有值，或者【区域限制】选择“区域1内部”，或者【经停类型】字段填“T”!' ;
				$.showTuiErrorDialog(astr);
				return false;
			}else if (loc1IsNullFlag){
				astr = '【Sector/Portion/Journey】选择了Portion，【区域1】必填!' ;
				$.showTuiErrorDialog(astr);
				return false;
			}else if(flag2){
				astr = '【Sector/Portion/Journey】选择了Portion，【区域2】必填，或者【区域限制】选择“区域1内部”，或者【经停类型】字段填“T”!' ;
				$.showTuiErrorDialog(astr);
				return false;
			}
		}else if (geoSpecSectPortJourney=='J'){
			if(loc1IsNullFlag||loc2IsNullFlag){
				$.showTuiErrorDialog('【Sector/Portion/Journey】选择了Journey，【区域1】和【区域2】必填!');
				return false;
			}
		}
		//里程如果最大值没有填写则置为最大值5个9
		if(formData.mileageMaximum==''){
			formData.mileageMaximum = '99999' ;
		}
		return true ;
	}
	
	//处理表单其他数据
	util.dealOtherData = function(formData){
		var serviceType = formData.serviceType ;
		if(serviceType=='A'){
			formData.firstExcessOccurrence = "" ;
			formData.lastExcessOccurrence = "" ;
		}
		if(serviceType=='C'||serviceType=='P'){
			if(formData.firstExcessOccurrence.length>0){
				if(formData.lastExcessOccurrence == ""){//若后者不填写，则后者默认等于前者
					formData.lastExcessOccurrence = formData.firstExcessOccurrence ;
				}
			}
		}
	}
	
	util.strNotNull = function(str){
		var tmp = str || "" ;
		tmp = $.trim(tmp+"") ;
		var flag = false;
		if(tmp.length>0){
			flag = true ;
		}
		return flag ;
	}
	
	
	/**
	 * <pre>
	 * 	删除表格中无效数据
	 * </pre>
	 * @param {Object} formData
	 */
	util.delInValidList = function(formData){
		//170表格
		var t170 = [] ;
		angular.forEach(formData.list170VO,function(m){
			if(util.strNotNull(m.specFeeAmount)){//如果存在的话
				t170.push(m) ;
			}
		}) ;
		//list198VO
		var t198 = [] ;
		angular.forEach(formData.list198VO,function(m){
			if(util.strNotNull(m.mktOp)){
				t198.push(m) ;
			}
		}) ;
		formData.list198VO = t198 ;
		//list198UpgradeVO
		var t198up = [] ;
		angular.forEach(formData.list198UpgradeVO,function(m){
			if(util.strNotNull(m.rbd1)){
				t198up.push(m) ;
			}
		}) ;
		formData.list198UpgradeVO = t198up ;
		//list183VO
		var t183 = [] ;
		angular.forEach(formData.list183VO,function(m){
			var flag = false;
			for(var p in m){
				var v = m[p] ;
				if(util.strNotNull(v)){
					flag = true ;
					break ;
				}
			}
			if(flag){
				t183.push(m) ;	
			}
		}) ;
		formData.list183VO = t183 ;
		//list186VO
		var t186 = [] ;
		angular.forEach(formData.list186VO,function(m){
			if(util.strNotNull(m.fltNo1)){
				t186.push(m) ;
			}
		}) ;
		formData.list186VO = t186 ;
		//list178Loc1
		var tloc1 = [] ;
		angular.forEach(formData.list178Loc1,function(m){
			if(util.strNotNull(m.geoLocType)){
				tloc1.push(m) ;
			}
		}) ;
		formData.list178Loc1 = tloc1 ;
		//list178Loc2
		var tloc2 = [] ;
		angular.forEach(formData.list178Loc2,function(m){
			if(util.strNotNull(m.geoLocType)){
				tloc2.push(m) ;
			}
		}) ;
		formData.list178Loc2 = tloc2 ;
		//list178Loc3
		var tloc3 = [] ;
		angular.forEach(formData.list178Loc3,function(m){
			if(util.strNotNull(m.geoLocType.length)){
				tloc3.push(m) ;
			}
		}) ;
		formData.list178Loc3 = tloc3 ;
		//行李件数表格处理
		var t196 = [] ;
		angular.forEach(formData.list196VO,function(m){
			if(util.strNotNull(m.count)&&util.strNotNull(m.code)){
				t196.push(m) ;
			}
		}) ;
		formData.list196VO = t196 ;
		//171表格无效数据删除
		var t171 = [] ;
		angular.forEach(formData.list171VO,function(m){
			if(util.strNotNull(m.carrier)){
				t171.push(m) ;
			}
		}) ;
		formData.list171VO = t171 ;
		//172表格删除无效数据
		var t172 = [] ;
		angular.forEach(formData.list172VO,function(m){
			if(util.strNotNull(m.accountCode)){
				t172.push(m) ;
			}
		}) ;
		formData.list172VO = t172 ;
		//173-1表格删除无效数据
		var t173_1 = [] ;
		angular.forEach(formData.list173TicketVO,function(m){
			if(util.strNotNull(m.ticketDesignator)){
				t173_1.push(m) ;
			}
		}) ;
		formData.list173TicketVO = t173_1 ;
		//173-2表格删除无效数据
		var t173_2 = [] ;
		angular.forEach(formData.list173TktVO,function(m){
			if(m.ticketDesignator.length>0 ){
				t173_2.push(m) ;
			}
		}) ;
		formData.list173TktVO = t173_2 ;
		//165
		var t165 = [] ;
		angular.forEach(formData.list165VO,function(m){
			if(m.equipmentCode.length>0){//如果存在的话
				t165.push(m) ;
			}
		}) ;
		formData.list165VO = t165 ;
	}
	
	util.getDate = function (str) {
		var strs = str.split('-');
		var year = strs[0];
		var month = strs[1];
		var day = strs[2];
		return new Date(year, month-1, day);
	};
	
	util.getDateArr = function (str) {
		var arr = [] ;
		var year = '' ;
		var month = '' ;
		var day  = '' ;
		if(str.length>0){
			var infos = str.split('-');
			if(infos.length==3){
				arr.push(infos[0]) ;
				arr.push(infos[1]) ;
				arr.push(infos[2]) ;
			}
		}
		return arr ;
	};
	
	module.exports = util ;
});