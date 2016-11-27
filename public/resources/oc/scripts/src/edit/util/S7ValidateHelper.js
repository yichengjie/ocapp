define(function (require, exports, module) {
	var commonUtil = require('./commonUtil') ;
	var _ = require('underscore') ;
	var jsonDataHelper = require('../data/jsonDataHelper') ;
	
	//js文件内部私有的工具类
	var _privateInnerUtil = {} ;
	_privateInnerUtil.checkIsPageClickFlag = function(isChangeSelectFlag){
	   //是否是页面点击触发的flag
		var pageClickFlag = true ;
		var tmpFlagStr = isChangeSelectFlag +"" ;
		if(tmpFlagStr=='false'){
		   pageClickFlag = false;
		}
		return pageClickFlag;
	}

	//所有置为可能为’可编辑‘的状态时都要判断status是否为3
	var setEditableByStatus = function(globalEditStatus,name,statusDes){
		var flag = commonUtil.getEditFlagByStatus(statusDes) ;
		globalEditStatus[name] = flag;
	};


	var NOTICE_TYPE_SINGLE = "singleChangeByFlagNotice" ;
	var NOTICE_TYPE_SERVICETYPE = "serviceTypeChangeNotice" ;



	var sendNotice2ForceDirctive4ServiceType = function  (scope,needDigest) {
		scope.$broadcast(NOTICE_TYPE_SERVICETYPE,needDigest+"") ;//scope.$broadcast('serviceTypeChangeNotice') ;
	};

	var sendNoticeToForceDirctive4Single = function(scope,needDigest,noticeName,showFlag){
		scope.$broadcast(NOTICE_TYPE_SINGLE,noticeName,showFlag+"",needDigest+"") ;//适用于
	};

	var sendNoticeToForceDirctive4SingleArr = function(scope,needDigest,noticeNameFlagList){
		var len = noticeNameFlagList.length ;
		for(var i = 0 ; i< len ; i++){
			var obj = noticeNameFlagList[i] ;
			var noticeName = obj.name ;
			var showFlag = obj.flag ;
			scope.$broadcast(NOTICE_TYPE_SINGLE,noticeName,showFlag+"",needDigest+"") ;//适用于
		}
	};

	/**
	 * 功能描述:'或/和'控件 更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateSpecSevFeeAndOrIndicator = function (editScope,data,globalEditStatus,isChangeSelectFlag) {
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var statusDes = data.statusDes;
		var serviceType = data.serviceType ;
		var noChargeNotAvailable = data.noChargeNotAvailable ;
		//serviceType 对'或/和'的影响
		//当服务类型为A、B、E时或/和一定为‘或’ ,当服务类型为C、P时或/和一定为'和'
		//1.判断默认值
		if(pageClickFlag){
			if(_.contains(['A','B','E'], serviceType)){
				data.specSevFeeAndOrIndicator= '' ;
			}else{
				if(noChargeNotAvailable!=''){//免费的时候一定为或
					data.specSevFeeAndOrIndicator= '' ;//不可编辑且为或
				}
			}
		}
		//2.判断是否可编辑
		if(_.contains(['A','B','E'], serviceType)){
			globalEditStatus.specSevFeeAndOrIndicator= false;
		}else{//当有机会设置为可编辑时继续判断//也就是说不为行李时才有机会可编辑
			//是否收费对'或/和'的影响
			//如果为不收费则，‘或/和’一定为‘或’
			if(noChargeNotAvailable==''){//收费
				setEditableByStatus(globalEditStatus,'specSevFeeAndOrIndicator',statusDes) ;
			}else{//不收费
				globalEditStatus.specSevFeeAndOrIndicator= false;
			}
		}
	};
	/**
	 * 功能描述:更新‘收费组件’
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateNoChargeNotAvailable = function(editScope,data,globalEditStatus,isChangeSelectFlag){
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var statusDes = data.statusDes;
		var serviceType = data.serviceType ;//serviceType
		//如果是免费则将下面的费用变为不可选择
		//下面的这点之所以没有设置为不可编辑的原因是因为，
		//1.判断默认值
		if(pageClickFlag){
			if(serviceType=='A'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='B'){
				data.noChargeNotAvailable = 'F' ;//设置为免费
			}else if (serviceType=='C'||serviceType=='P'){
				data.noChargeNotAvailable = '' ;//设置为收费
			}else if (serviceType=='E'){
				data.noChargeNotAvailable = 'X' ;//设置为收费
			}
		}
		//2.判断是否可编辑
		if(serviceType=='C'||serviceType=='P'){//收费一定为收费且不可编辑
			globalEditStatus.noChargeNotAvailable= false;
		}else{//可编辑
			//还要判断当前status是否等于3
			setEditableByStatus(globalEditStatus,'noChargeNotAvailable',statusDes) ;
		}
		//免费/收费
		editScope.noChargeNotAvailableList.list= jsonDataHelper.getNoChargeNotAvailableList(serviceType) ;

	};
	//
	/**
	 * 功能描述:‘是否检查库存组件’更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateAvailability = function(editScope,data,globalEditStatus,isChangeSelectFlag){
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var statusDes = data.statusDes;
		var serviceType = data.serviceType ;//serviceType
		//将是否检查库存设置为 ‘否’
		//1.判断默认值
		if(_.contains(['A','B','E'],serviceType)){
			if(pageClickFlag){
				data.availability = 'N' ;
			}
		}
		//2.判断是否可编辑
		if(_.contains(['A','B','E'],serviceType)){
			globalEditStatus.availability= false;
		}else{
			setEditableByStatus(globalEditStatus,'availability',statusDes) ;
		}
	} ;
	/**
	 * 功能描述:‘适用于组件’更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateSpecifiedServiceFeeApp = function(editScope,data,globalEditStatus,isChangeSelectFlag){
		var serviceType = data.serviceType ;//serviceType
		//适用于
		editScope.specifiedServiceFeeAppList.list = jsonDataHelper.getSpecifiedServiceFeeAppList(serviceType) ;
	};

	/**
	 * 功能描述:‘行李适用范围组件’更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updatebaggageTravelApplication = function(editScope,data,globalEditStatus,isChangeSelectFlag){
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var noChargeNotAvailable = data.noChargeNotAvailable ;
		var statusDes = data.statusDes ;
		//1.默认值设置
		if(pageClickFlag){
		   if(noChargeNotAvailable=='D'){
			  data.baggageTravelApplication = '' ;
		   }
		}
		//2.是否可编辑设置
		if(noChargeNotAvailable=='D'){
			globalEditStatus.baggageTravelApplication = false;
		}else{
			setEditableByStatus(globalEditStatus,'baggageTravelApplication',statusDes) ;
		}
	};
	
	/**
	 * 功能描述:‘是否可退组件’更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateIndicatorReissueRefund = function(editScope,data,globalEditStatus,isChangeSelectFlag){
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var noChargeNotAvailable = data.noChargeNotAvailable ;
		var statusDes = data.statusDes ;
		//1.默认值设置
		if(pageClickFlag){
			if(noChargeNotAvailable==''){
				data.indicatorReissueRefund='N'; 	
			}else if(_.contains(['X','F','E'],noChargeNotAvailable)){
				data.indicatorReissueRefund=''; 
			}
		}
		//2.是否可编辑设置
		if(_.contains(['X','F','E'],noChargeNotAvailable)){//如果不可点击
			globalEditStatus.indicatorReissueRefund = false;
		}else{
			setEditableByStatus(globalEditStatus,'indicatorReissueRefund',statusDes) ;
		}
	};
	/**
	 * 功能描述:‘区域/部分/全程’更新
	 * @param editScope 页面上最外层的scope
	 * @param data      表单FormData服务
	 * @param globalEditStatus  页面是否可编辑的服务
	 * @param isChangeSelectFlag 是否是页面改变select的值触发的标志
	 */
	var updateGeoSpecSectPortJourney = function  (editScope,data,globalEditStatus,isChangeSelectFlag) {
		//是否是页面点击触发的flag
		var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
		var servcieType = data.serviceType ;
		var statusDes = data.statusDes ;
		//1.判断默认值
		if(pageClickFlag){
			if(_.contains(['B','E'], servcieType)){
				data.geoSpecSectPortJourney = 'S' ;
			}else if(servcieType=='F'){
				data.geoSpecSectPortJourney = 'S' ;
			}else{
				data.geoSpecSectPortJourney = '' ;
			}
		}
		//2.判断是否可编辑
		if(_.contains(['B','E'], servcieType)){//不可编辑
			globalEditStatus.geoSpecSectPortJourney=false;
		}else{//如果没有被重置为不可编辑，则这里需要重置是否可编辑
			setEditableByStatus(globalEditStatus,'geoSpecSectPortJourney',statusDes) ;
		}
		editScope.geoSpecSectPortJourneyList.list = jsonDataHelper.getgeoSpecSectPortJourneyList(servcieType) ;
	};


	module.exports = {
		changeServiceType:function(editScope,data,globalEditStatus,isChangeSelectFlag){
			var statusDes = data.statusDes;
			var serviceType = data.serviceType || '' ;//serviceType
			//更新是否收费组件的信息
			updateNoChargeNotAvailable(editScope, data, globalEditStatus,isChangeSelectFlag) ;
			//更新'或/和'组件的显隐及是否可编辑状态
			updateSpecSevFeeAndOrIndicator(editScope,data,globalEditStatus,isChangeSelectFlag) ;
			//更新是否检查库存
			updateAvailability(editScope, data, globalEditStatus,isChangeSelectFlag) ;
			//适用于
			updateSpecifiedServiceFeeApp(editScope, data, globalEditStatus,isChangeSelectFlag) ;
			//区域/部分/全程
			updateGeoSpecSectPortJourney(editScope, data, globalEditStatus,isChangeSelectFlag) ;
			//发送广播隐藏或显示组件
			//editScope.$broadcast('serviceTypeChangeNotice','false') ;//scope.$broadcast('serviceTypeChangeNotice') ;	
			sendNotice2ForceDirctive4ServiceType(editScope, 'false') ;
		},
		changeNoChargeNotAvailable:function(editScope,data,globalEditStatus,isChangeSelectFlag){/**当改变是否收费的时候*/
			var serviceType = data.serviceType || '' ;
			var noChargeNotAvailable = data.noChargeNotAvailable || '';
			var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
			//console.info('serviceType : ' + serviceType) ;
			//服务类型是不是行李附加服务
			var isBaggageFlag = commonUtil.checkBaggageServcie(serviceType) ;
			var in_flag = true ;
			if(isBaggageFlag){//如果为空表收费
				if(noChargeNotAvailable==''){//如果不为收费这下面的置空
					in_flag = true ;
				}else{//免费的时候需要清空填写的信息
					in_flag = false;//隐藏 适用于，里程，金额
				}
			}else{//一般附加服务
				var arr = ['X','E','F','G','H'] ;//dxef
				var flag2 = _.contains(arr, noChargeNotAvailable) ;	
				if(flag2){
					in_flag = false ;//隐藏
				}else{//如果为空表收费
					in_flag = true ;
				}
			}
			if(pageClickFlag&&!in_flag){//当为页面点击并且要隐藏170和201时清空子表复用号
				data.reuseList170VO = '' ;
				$(":input[name=reuseList170VO]").val('').attr('placeholder','') ;
			}
			//console.info('是否为行李服务['+isBaggageFlag+']，收费类型为 ['+noChargeNotAvailable+']--X,E,F,G,H--时隐藏，判断结果flag : ' + in_flag) ;
			//var specifiedServiceFeeApp_specialFlag = true;
			//当收费类型为D/X/F/E时暂时不做区分是否为行李或则一般附加服务，这里全部都将适用于置为空
			//这个地方可能还存在一店暂时先把为d时适用于全部置空
			//specifiedServiceFeeApp_specialFlag = false ;//如果不为d，则进入其他的校验，按照其他的进行
			//当是否收费为D时  --行李适用范围必须为空
			//更新'行李适用范围'组件
			updatebaggageTravelApplication(editScope,data,globalEditStatus,isChangeSelectFlag) ;
			//更新’或/和‘组件
			updateSpecSevFeeAndOrIndicator(editScope,data,globalEditStatus,isChangeSelectFlag) ;
			//更新‘是否可退’组件
			updateIndicatorReissueRefund(editScope,data,globalEditStatus,isChangeSelectFlag) ;
			var freeBaggageAllowancePiecesFlag = false ;//因为免费行李件件数控件只有在serviceType=='A'是才能显示
			//当是否收费为D/O时行李件数必修为空,行李类型必须为A,行李子代码必须为0DF
			if(serviceType=='A'){
				if(noChargeNotAvailable=='D'||noChargeNotAvailable=='O'){
					freeBaggageAllowancePiecesFlag = false ;
				}else{
					freeBaggageAllowancePiecesFlag = true ;
				}
			}
			//行李件数置为空//费用//里程//适用于
			var noticeNameFlagList = [
				{"name":"freeBaggageAllowancePieces","flag":freeBaggageAllowancePiecesFlag},{"name":"list170VOAndlist201VO","flag":in_flag},
				{"name":"specifiedServiceFeeMileage","flag":in_flag},{"name":"specifiedServiceFeeApp","flag":in_flag}
			] ;
			sendNoticeToForceDirctive4SingleArr(editScope, "false", noticeNameFlagList) ;
		},
		changeSpecifiedServiceFeeApp:function(editScope,data,isChangeSelectFlag){/**当改变适用于的时候*/
			var serviceType = data.serviceType ||'';
			var noChargeNotAvailable = data.noChargeNotAvailable || '';
			var ssfa = data.specifiedServiceFeeApp || '' ;
			var pageClickFlag = _privateInnerUtil.checkIsPageClickFlag(isChangeSelectFlag) ;
			var in_flag = true ;
			//因为只有行李服务适用于才会有[H,C,P]，所以这里不需要判断serviceType是否为C，P
			if(ssfa=='H'||ssfa=='C'||ssfa=='P'){
				in_flag = false;
			}else{
				var isBaggageFlag = commonUtil.checkBaggageServcie(serviceType) ;
				if(isBaggageFlag){//如果为空表收费
					if(noChargeNotAvailable==''){//如果不为收费这下面的置空
						in_flag = true ;
					}else{//免费的时候需要清空填写的信息
						in_flag = false;//隐藏 适用于，里程，金额
					}
				}else{//一般附加服务
					var arr = ['X','E','F','G','H'] ;//dxef
					var flag2 = _.contains(arr, noChargeNotAvailable) ;	
					if(flag2){
						in_flag = false ;//隐藏
					}else{//如果为空表收费
						in_flag = true ;
					}
				}
			}
			if(pageClickFlag&&!in_flag){//当页面点击并且要隐藏170和201时,将170和201的子表复用号清空
				data.reuseList170VO = '' ;
				$(":input[name=reuseList170VO]").val('').attr('placeholder','') ;
			}
			//console.info('serviceType : ['+serviceType+'] , ssfa : ['+ssfa+']  , in_flag : ['+in_flag+']' ) ;
			//$scope.FormEditStatusServcie.noChargeNotAvailable =in_flag;
			//170，201显示或隐藏
			//editScope.$broadcast('singleChangeByFlagNotice','list170VOAndlist201VO',in_flag+'','false') ;
			sendNoticeToForceDirctive4Single(editScope, "false", "list170VOAndlist201VO", in_flag) ;
		},
		changeGeoSpecSectPortJourney:function  (editScope,data,globalEditStatus,isChangeSelectFlag) {
			/*var geoSpecSectPortJourney = data.geoSpecSectPortJourney || '' ;
			var noticeName = 'geoSpecLoc1AndType' ;
			var showFlag = true;
			if(geoSpecSectPortJourney==''){
				showFlag = false;
			}
			sendNoticeToForceDirctive4Single(editScope,'false',noticeName,showFlag+'') ;*/
		}
	} ;

}) ;