define(function (require, exports, module) {
	  var controllers = require('./controllers') ;
	  var jsonDataHelper = require('../data/jsonDataHelper') ;
	  var commonUtil = require('../util/commonUtil') ;
	  var _ = require('underscore') ;
	  var validateHelper = require('../util/S7ValidateHelper') ;
	  
	  
	  
	  var clearAllReuseTbHistory = function(){
	  	//201暂时不支持复用，所以不用清空历史
	  	var namesArrs = ["reuseList172VO","reuseList173TicketVO","reuseList183VO","reuseList198VO","reuseList198UpgradeVO",
	  	"reuseList171VO","reuseList173TktVO","reuseList186VO","reuseList170VO","reuseList196VO","reuseList165VO",
	  	"reuseList178Loc1","reuseList178Loc2","reuseList178Loc3"] ;
	  	
	  	for(var i=0 ; i<namesArrs.length;  i++){
	  		$(":input[name="+namesArrs[i]+"]").val("").attr("placeholder","")
	  	}
	  }
	  

      var dealData4NewServiceType = function(data,orgData,l,FormEditStatusServcie,editScope){
			var serviceType = l.serviceType ;
			var carrCode = l.carrCode ;
			var serviceSubCode = l.serviceSubCode ;
			var commercialName = l.commercialName ;
			//第一步:重置表单数据
			//当点击的饿时候把整个表单重置//除了serviceType外的其他字段
			for(var pname in data){
				if(!_.contains(['sel1','sel2','sel3','sel4','firstMaintenanceDate'], pname)){
					data[pname] = angular.copy(orgData[pname]) ;
				}
			}
			//validator是绑定在window上的全局变量
			validator.resetForm();
			//第二步：填充当前选中的数据
			data.carrCode = carrCode ;
			data.serviceAndSubCode = serviceSubCode ;
			data.serviceType = serviceType ;
			//填充basicInfo信息start
			data.basicInfoVo.serviceGroup= l.attributesGroup ;
			data.basicInfoVo.subGroup= l.attributesSubgroup ;
			data.basicInfoVo.subCode= l.serviceSubCode ;
			
			//清除表格复用的信息
			clearAllReuseTbHistory() ;
			
			//填充basicInfo信息end
			data.sel3.showStr = '['+serviceSubCode+']'+commercialName ;
			data.sel3.value = serviceSubCode ;
			data.sel3.serviceGroup = l.attributesGroup ;
			//第三步:校验相关的操作
			validateHelper.changeServiceType(editScope,data,FormEditStatusServcie) ;
	  };



	  //页面第一个部分/////////选择附加服务部分/////////////////////////////////////////
	  //select级联controller
	   controllers.controller('BasicInfoCtrl',['$scope','$http','FormData','DEFAULT_SERVICETYPE','FormEditStatusServcie',function($scope,$http,FormData,DEFAULT_SERVICETYPE,FormEditStatusServcie){
			//chooseInput的输入数据
			$scope.chooseInputData = {
				"choose1":"",
				"choose2":"",
				"choose3":""
			} ;
	   		$scope.data = FormData ;
			$scope.showChooseFunc = function(){
				var str = "" ;
				var str1 = FormData.sel1.showStr || "" ;
				var str2 = FormData.sel2.showStr || "" ;
				var str3 = FormData.sel3.showStr || "" ;
				if(str1.length>0){
					str = str1 ;
				}
				if(str2.length>0){
					str += " > "+str2 ;
				}
				if(str3.length>0){
					str += " > "+str3 ;
				}
				return str ;
			};

			//choose第一个框中li点击事件
			$scope.subGroupQuery = function(showStr,serviceGroup){
				var contextPath = $scope.contextPath ;
				FormData.sel1.showStr = showStr ;
				FormData.sel1.value = serviceGroup ;
				//把第二个选项框以前保留的信息清空
				FormData.sel2.showStr = "" ;
				FormData.sel2.value = "" ;
				//把第三个选项框以前保留的信息清空
				FormData.sel3.showStr = "" ;
				FormData.sel3.value = "" ;
				FormData.sel3.serviceGroup = "" ;
				FormData.sel3.textTableNo163 = "" ;
				$scope.lastGroupList = [] ;
				$scope.lastGroupList2 = [] ;
				//清空formData信息
				FormData.serviceAndSubCode = "" ;
				FormData.serviceType = DEFAULT_SERVICETYPE ;//
				FormData.noChargeNotAvailable = "" ;//设置为默认
				var url = contextPath+"/basicInfo/queryBasicInfoByGroup" ;
				var carrier = $scope.data.carrCode  ;
				var jqeryData = {} ;//post方式提交
				var jueryParam = {params: {carrier: carrier,serviceGroup:serviceGroup}};//地址问号形式
				$http.post(url, jqeryData, jueryParam)
				.success(function(data, status, headers, config) {
				  	$scope.subGroupList = data ;
				}).error(function(data, status, headers, config) {//处理错误
					alert("查询出错!") ;
				});
				$scope.data.basicInfoVo.serviceGroup= "";
				$scope.data.basicInfoVo.subGroup= "" ;
				$scope.data.basicInfoVo.subCode= "" ;
				$scope.data.sel4 = [];
			};

			//第二个li点击事件
			$scope.s5Query = function(showStr,subGroup){
				var contextPath = $scope.contextPath ;
				FormData.sel2.showStr = showStr ;
				FormData.sel2.value = subGroup ;
				//清空第三个选项框
				FormData.sel3.showStr = "" ;
				FormData.sel3.value = "" ;
				FormData.sel3.serviceGroup = "" ;
				FormData.sel3.textTableNo163 = "" ;
				$scope.lastGroupList = [] ;
				FormData.serviceAndSubCode = "" ;
				FormData.serviceType = DEFAULT_SERVICETYPE ;//
				$scope.lastGroupList2 = [] ;

				FormData.noChargeNotAvailable = "" ;//设置为默认
				var url = contextPath+"/s5/queryS5BySubGroup" ;
				var carrier = $scope.data.carrCode  ;
				var serviceGroup = FormData.sel1.value ;
				var jqeryData = {} ;//post方式提交
				var jueryParam = {params: {carrier: carrier,serviceGroup:serviceGroup,subGroup:subGroup}};//地址问号形式
				$http.post(url, jqeryData, jueryParam)
				.success(function(data, status, headers, config) {
				  	$scope.lastGroupList = data ;
				}).error(function(data, status, headers, config) {//处理错误
					alert("查询出错!") ;
				});
				
				$scope.data.basicInfoVo.serviceGroup= "" ;
				$scope.data.basicInfoVo.subGroup= "" ;
				$scope.data.basicInfoVo.subCode= "" ;
				$scope.data.sel4 = [];
			};

			//第三个li点击事件
			$scope.lastChooseClick = function(l){
				//l.attributesGroup与上面的serviceGroup一样
				var serviceGroup = l.attributesGroup ;	
				var serviceType = l.serviceType ;
				var pageNeedNewRunderFlag = true ;
				//下面的这段暂时注释掉，以后可能需要根据点击要判断当前页面是否需要重置数据
				//点击本次li前的数据
				//var oldServiceGroup = $scope.data.sel3.serviceGroup ;
				//var oldServiceType = FormData.serviceType ;
				/*if(oldServiceGroup==serviceGroup){//表示之前点击过第三个li并且一直保持在第三个li上面
					if(oldServiceType==serviceType){//表示serviceGroup和servcieType都没有变，则页面不需要重新渲染
						pageNeedNewRunderFlag = false;
					}
				}*/
				//000000 这里暂时全都做页面重置(以后的重置方式最佳实践:1-->应该把force指令里面控制显隐的变量修改为只有serviceType一个。
				//000000 2-->然后对于比较特殊的页面元素例如:升舱，则特殊处理，在页面上直接用ng-show=’serviceGroup‘来控制显隐),
				//000000 这样后期才更利于需求的变化
				//后期做这个功能
				if(pageNeedNewRunderFlag){//只有当页面需要重新渲染时
					//console.info('本次点击需要重新刷新页面....') ;
					//处理点击后的数据
					dealData4NewServiceType($scope.data,$scope.orgData,l,FormEditStatusServcie, $scope.$parent) ;
					//清空金额缓存数据
					$scope.data.discountOrNot = '1' ;
					$scope.data.list201VO = [] ;//数据初始化
				}

				//第四步:查询数据为后面显示准备
				var textTableNo163 = l.subCodeTableNo163||'' ;
				var oldTextTableNo163 = FormData.sel3.textTableNo163 ||'';
				if(oldTextTableNo163!=textTableNo163){//如果上次和这次不相同才需要重新渲染第四列
					textTableNo163 = textTableNo163*1 ;
					var url = FormData.contextPath+"/s7/query4ClickService" ;
					var queryParam = {"subCodeTableNo163":textTableNo163+"",
									  "carrCode":l.carrCode,
									  "serviceType":l.serviceType,
									  "serviceAndSubCode":l.serviceSubCode} ;
					$http.post(url,queryParam)
					.success(function(data, status, headers, config) {
					  	$scope.lastGroupList2 = data.tb163List ;
					  	$scope.data.sel4 = data.tb163List;
					  	$scope.data.sequenceNumber = data.maxSequenceNumber*1+10 ;
					}).error(function(data, status, headers, config) {//处理错误
						console.info("查询出错!") ;
					});

				}
			};
	   }]) ;
	   // ng-show = "lastGroupList2.length>0"

}) ;
