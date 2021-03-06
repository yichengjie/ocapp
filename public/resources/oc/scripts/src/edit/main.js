define(function(require, exports, module) {
	//var pathStr = require.resolve('src/main') ;
	//console.info("path : " + pathStr) ;
	//require('tuiValidator');
	require('tuiDialog') ;
	require('datepicker') ;
	//把整个app的路由加载进来
	require("./router") ;
	module.exports = {
 		init: function(){
			angular.element(document).ready(function() {
			    angular.bootstrap(document, ['app']);
				//angular加载完毕以后注册tui插件的校验
				registPageValidate() ;
				pageLoadComplete() ;
			});
 		}
 	};

 	function pageLoadComplete (){
 		$("body").addClass("helper_background_color1") ;
		$("#loading").addClass('hidden') ;
		$("#EditControllerDiv").removeClass('hidden') ;
		$("#myheader").removeClass('hidden') ;
 	}
	
	function registPageValidate(){
		//对表单注册校验
		var validator = $("#s7_form").validate({meta : ""});
		window.validator = validator ;
		//s7_save//提交按钮
		$("#s7_save").bind("click",function (e) {
		   //直接用来校验表单 同 下面的  validator.form()函数
		   //var flag = $("#signupForm").valid() ;
		   var element  = angular.element($("#EditControllerDiv"));
		   var scope = element.scope();
		   var action = scope.data.action ;
		   var sel3ShowStr = scope.data.sel3.showStr ;
		   if(action=='add'&&sel3ShowStr==''){
		   		$.showTuiErrorDialog('请选择服务到最后一级！');
		   }else{
		   	   var flag = validator.form() ;
			   //console.info('jquery validate form return flag : ' + flag) ;
			   if(flag){
			   		//获取指定id元素上的controller
					scope.saveFormData('save') ;
			   }
		   }
		  // console.info("校验是否通过flag : " + flag) ;
		}) ;
		
		//点击保存并发布按钮
		$("#s7_saveAndPublish").bind("click",function (e) {
		   var element  = angular.element($("#EditControllerDiv"));
		   var scope = element.scope();
		   var action = scope.data.action ;
		   var sel3ShowStr = scope.data.sel3.showStr ;
		   if(action=='add'&&sel3ShowStr==''){
		   	   $.showTuiErrorDialog('请选择服务到最后一级！');
		   }else{
		   		//直接用来校验表单 同 下面的  validator.form()函数
			   var flag = validator.form() ;
			   //console.info('jquery validate form return  flag : ' + flag) ;
			   if(flag){
					//获取指定id元素上的controller
					scope.saveFormData('saveAndPublish') ;
			   }
		   }
		}) ;
		//当整个页面加载完毕后发送一次serviceTypeChange的通知，因为有时候serviceType会有默认值
		/*setTimeout(function(){
			scope.$broadcast('serviceTypeChangeNotice','true') ;
		},1000) ;*/
	}

});
