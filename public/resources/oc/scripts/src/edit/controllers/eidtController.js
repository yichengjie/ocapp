define(function (require, exports, module) {
	var controllers = require('./controllers') ;
	var util = require('../util/S7FormDataUtil') ;
	var jsonDate = require('../data/editJsonData') ;
	var EditUtil = require('../util/S7EditUtil') ;
	var commonUtil = require('../util/commonUtil') ;

	//最外层controller
	controllers.controller('EditController',['$scope','FormData','$http','HttpOperService','TbShowHideServcie','FormEditStatusServcie','FormStatusService','CustomeEditTbStatusServcie','$timeout',function($scope,FormData,$http,HttpOperService,TbShowHideServcie,FormEditStatusServcie,FormStatusService,CustomeEditTbStatusServcie,$timeout){
		$scope.contextPath = FormData.contextPath ;
		//保留一份原始数据，方便数据初始化时使用
		$scope.orgData = angular.copy(FormData) ;
		//页面上的form数据
		$scope.data = FormData ;
		//页面上所有表格的显示或隐藏的的状态数据
		$scope.tableStatus = TbShowHideServcie ;//TableStatusServcie
		//表格复用的自定义是否显示
		$scope.customeEditTbStatus = CustomeEditTbStatusServcie ;
		
		
		/*$scope.config1 = {
	        data: [],
	        placeholder: '尚无数据'
	    };
	    $timeout(function () {
	        $scope.config1.data = [{id:1,text:'bug'},{id:2,text:'duplicate'},{id:3,text:'invalid'},{id:4,text:'wontfix'}]
	        $scope.config1.placeholder = '加载完毕'
	    }, 1000);*/
		
		
		//页面上所有控件的状态数据
		$scope.editStatus = FormEditStatusServcie ;
		$scope.showStatus = FormStatusService ;
		var s7Id = $("#s7Id").val() ;
		$scope.data.id = s7Id ;
		//日期问题
		var currDate = new Date();
		var curMonthStr = commonUtil.getFullDayOrMonthStr(currDate.getMonth()+1)  ;
		var curDateStr = commonUtil.getFullDayOrMonthStr(currDate.getDate()) ;
		var nextDateStr= commonUtil.getFullDayOrMonthStr(currDate.getDate() +1) ;
		//当前日期
		$scope.currentDateStr = currDate.getFullYear() +'-'+curMonthStr+ '-'+curDateStr;
		//下一天日期
		$scope.nextDateStr = currDate.getFullYear() +'-'+curMonthStr+ '-'+nextDateStr ;
		//所有的表格定义信息都在这里
		$scope.tableData = jsonDate.tableData ;

		//-------------区域对应的表格显示隐藏开始--------//
		//第一次进入页面时需要加载的数据
		console.info('准备初始化页面数据..........') ;
		var url = '';
		var promise = null;
		if(FormData.action=="add"){//1.新增
			url = $scope.contextPath+'/initPage4Add';
			promise = HttpOperService.getDataByUrl(url) ;
			EditUtil.initData.dealResultData4Add(promise,$scope) ;
		}else if (FormData.action=="update"){
			url = $scope.contextPath+'/initPage4Upate?s7Id='+$scope.data.id;
			promise = HttpOperService.getDataByUrl(url) ;
			EditUtil.initData.dealResult4Update(promise,$scope) ;
		}else if (FormData.action=="copy"){
			url = $scope.contextPath+'/initPage4Copy?s7Id='+$scope.data.id;
			promise = HttpOperService.getDataByUrl(url) ;
			//EditUtil.initData.dealResult4Update(promise,$scope) ;
			EditUtil.initData.dealResult4Copy(promise,$scope) ;
		}
		console.info('页面部分数据其他处理.......') ;
		//保存表格数据到后台
		/**
		 * <pre>
		 * 	功能描述:保存表单数据
		 * </pre>
		 * @param {Object} operType  ['save','saveAndPublish']  点击‘保存’,‘保存并发布’
		 */
		$scope.saveFormData = function(operType){
			var tokenId = $("#tokenId").val() ;
			var flag = false ;
			var s7 = util.convertFormDataToS7($scope.data) ;
			flag = util.validFormData(s7,$scope.data) ;
			//console.info('手动js校验结果为 : ' + flag) ;
			//console.info('data.geoSpecExceptionStopTime : ' +$scope.data.geoSpecExceptionStopTime ) ;
			//flag = false;//本地测试禁止表单提交
			if(flag){//如果校验通过的话则提交表单数据到后台
				$.showTuiConfirmDialog('保存?', function() {
					var url = "" ;
					if(operType=='save'){
						if(FormData.action == "add"||FormData.action == "copy"){//新增数据的话
							url = $scope.contextPath + "/addS7"
						}else if(FormData.action=="update"){//更新数据的话
							url = $scope.contextPath + "/updateS7" ;
						}
					}else if (operType=='saveAndPublish'){
						url = $scope.contextPath + "/saveAndPublishS7" ;
					}
					var config = {"tokenId":tokenId} ;
					var promise = HttpOperService.postDate(url,s7,config) ;
					promise.then(function (data) {
						if (data.flag == 'true' ) {
							$.showTuiSuccessDialog('保存成功！', function() {
								$.showTuiWaitingDialog('即将返回查询界面!', 200, 60);
								setTimeout(function() {
									$.closeTuiWindow();
								}, 5000);
								window.location.href= $scope.contextPath+'/oc/ocView' ;
							});
						} else {
							$.showTuiErrorDialog('保存数据出错！');
						}
					},function(error){
						$.showTuiErrorDialog('保存数据出错！');
					}) ;
				});
			}
		}
    }]) ;

}) ;
