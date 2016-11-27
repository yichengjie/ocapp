define(function(require, exports, module) {
	var $ = require("jquery");
	var Common = require("./common") ;
	var common = new Common() ;
	function S7Abort(){
	
	} ;
	module.exports = S7Abort;
	
	
	S7Abort.prototype.init = function(){
		var self = this ;
		var dateStr = common.getDate() ;
		//配置modal的初始化参数
		this.setModalParam() ;
		//因为日期和前面的输入框有点距离所以这里修正一下隔阂距离
		$("#lastMaintenanceDate").parent().find(".input_date_btn").css({"margin-left": "-8px","margin-top":"-1px"}) ;
		//初始化日期控件
		$("#lastMaintenanceDate").datepicker({dateFormat:"yy-mm-dd",showButtonPanel:true,minDate:dateStr});
		//当页面上的截止按钮被点击的时候
		$("#abortBtn").bind('click',function(e){
			e.preventDefault() ;
			e.stopPropagation() ;
			var checkedR7s = $(":checkbox[name=s7check]:checked") ;
  			var len = checkedR7s.length ;
  			//len = 1 ;//测试方便这里把len=1 ;
  			if(len>0){//显示模态框
  				//选择的记录中不能包含已过期的记录
  				var hasExpiredItemFlag = false;
  				checkedR7s.each(function(){
  					var statusDes = $(this).siblings(":input[name=statusDes]").val() ;
  					if(statusDes=="4"){
  						hasExpiredItemFlag = true ;
  					}
  				}) ;
  				if(hasExpiredItemFlag){
  					$.showTuiErrorDialog('包含‘已过期’的记录，无法截止!');
  				}else{
  					$('#abortModal').removeClass('fade') ;
  				}
  			}else{
  				$.showTuiErrorDialog('至少选择一条需要截止的记录!');
  			}
		}) ;
		
		$("#abortModalConfirm").bind('click',function(e){
			e.preventDefault() ;
			e.stopPropagation() ;
			//将所有的提示信息先清除干净
			self.cleanTipInfo() ;
			//self.addErrorInfo("错误提示信息1") ;
			var flag = self.checkInputDateValid() ;
			if(flag){
				//1.隐藏模态框
				self.addSuccessTip("操作中请稍后.....") ;
				self.canNotOperModal() ;
				//2.保存数据到数据库
				var promise = self.saveData2DB() ;
				$.when(promise).done(function(data){
					self.deal4Result(data) ;
				}).fail(function(err){
					self.cleanTipInfo() ;
					self.addErrorTip("操作失败!") ;
				}) ;
			}
		}) ;
		
		
		$("#abortModalClose").bind('click',function(e){
			e.preventDefault() ;
			e.stopPropagation() ;
			$('#abortModal').addClass('fade') ;
			self.cleanInputInfo() ;
		}) ;
		
		$("#abortModalCancel").bind('click',function(e){
			e.preventDefault() ;
			e.stopPropagation() ;
			$('#abortModal').addClass('fade') ;
			self.cleanInputInfo() ;
		}) ;
		
	};
	
	//功能描述处理点击截止后的结果
	S7Abort.prototype.deal4Result = function(retData){
		var self = this ;
		var lastMaintenanceDate = $("#lastMaintenanceDate").val() ;
		//清理所有的提示信息
		self.cleanTipInfo() ;
		if(retData.flag=='true'){
			self.addSuccessTip("操作成功,2秒后将关闭窗口...") ;
			//更新页面上的数据
			var checkedR7s = $(":checkbox[name=s7check]:checked") ;
			checkedR7s.each(function(){
				$(this).parents("tr").find("span[name=lastMaintenanceDate]").html(lastMaintenanceDate) ;
			}) ;
		}else{
			self.addErrorTip("操作失败,2秒后将关闭窗口...") ;
		}
		//两秒钟后关闭模态框
		setTimeout(function(){
			self.canOperModal() ;//模态框可以操作
			$("#abortModalCancel").trigger("click") ;//关闭模态框
		},2000) ;
	};
	
	//报错数据到数据库
	S7Abort.prototype.saveData2DB = function(){
		var checkedR7s = $(":checkbox[name=s7check]:checked") ;
		var ids = "" ;
		checkedR7s.each(function(){
			var curId = $(this).siblings(':input[name=s7id]').val() ;
			ids += curId+"," ;
		}) ;
		//去掉最后一个逗号
		var idsLen = ids.length ;
		if(idsLen>1){
			ids = ids.substring(0,idsLen-1) ;
		}
		var lastMaintenanceDate = $("#lastMaintenanceDate").val() ;
		var jsonParam = {"lastMaintenanceDate":lastMaintenanceDate,"ids":ids};
		var serverUrl = $("#abortModalConfirm").attr('url')  ;
		//console.info("serverUrl : " + serverUrl) ;
		return common.dealAjaxRequest4SimpleParam(serverUrl,jsonParam) ;
	};
	
	//隐藏确认按钮
	S7Abort.prototype.canNotOperModal = function(){
		$("#abortModalConfirm").addClass("fade") ;
	} ;
	
	S7Abort.prototype.canOperModal = function(){
		$("#abortModalConfirm").removeClass("fade") ;
	} ;
	
	
	//设置modal框的显示样式参数
	S7Abort.prototype.setModalParam = function(){
		var $modal = $('#abortModal') ;
		var option = {modalContentCss:{width:"400px"},
					  inputTitleCss:{width:"90px"},
					  inputContentCss:{width:"172px"},
					  modalInputCss:{width:"140px"}} ;
		//设置整个modal框的宽度
		$modal.find(".modal-dialog").css(option.modalContentCss) ;
		//设置左边标题部分宽度
		$modal.find('.input_title').css(option.inputTitleCss) ; 
		//设置右边输入部分宽度
		$modal.find('.input_content').css(option.inputContentCss) ;
		//设置input的宽度
		$modal.find('.modal_input').css(option.modalInputCss) ;
        //var $p = $modal.find('div.modal-dialog') ;
        var $p = $modal.find('.modal-dialog') ;
        var win_width = $(document).width() ;
        //var win_hight = $(document).height() ;
        var p_width = $p.outerWidth() ;
        //var p_higth = $p.outerHeight() ;
        //console.info("win_width : "+win_width +" ,  p_width : " + p_width) ;
        var left = (win_width- p_width)/2 ;
        //console.info("left : " + left) ;
        var top = 200 ;
        $p.css({left:left+"px",top:top+"px"}) ;
	} ;
	
	//检查输入的日期是否合法
	S7Abort.prototype.checkInputDateValid = function(){
		var flag = false;
		var self = this ;
		var checkedR7s = $(":checkbox[name=s7check]:checked") ;
		var inputDateStr = $.trim($("#lastMaintenanceDate").val()) ;
		var inputDate = common.convetStr2Date(inputDateStr) ;
		if(inputDateStr.length==0){
			self.addErrorTip("截止日期必填!") ;
		}else{
			var allBigger = true ;
			var checkedStartDateArr = [] ;
			checkedR7s.each(function(){
				var curStartDate = $(this).siblings(":input[name=firstMaintenanceDate]").val() ;
				checkedStartDateArr.push(common.convetStr2Date(curStartDate));
			}) ;
			var len =checkedStartDateArr.length ;
			for(var i = 0 ; i < len ; i++){
				var t = checkedStartDateArr[i] ;
				if(inputDate<t){
					allBigger = false;
				}
			}
			//如果大于所有记录的起始日期
			if(allBigger){
				flag = true ;
			}else{
				self.addErrorTip("截止日期必须大于所有记录的起始日期!") ;
			}
		}
		return flag ;
	} ;
	
	
	S7Abort.prototype.cleanInputInfo = function(){
		$("#lastMaintenanceDate").val("") ;
		this.cleanTipInfo() ;
	} ;
	
	S7Abort.prototype.cleanTipInfo = function(){
		$("#abortTipInfo").html("") ;
	} ;
	
	S7Abort.prototype.addErrorTip = function(errMsg){
		$("#abortTipInfo").append("<li><span class =\"modal-errorTip\">"+errMsg+"</span></li>") ;
	} ;
	
	S7Abort.prototype.addSuccessTip = function(errMsg){
		$("#abortTipInfo").append("<li><span class =\"modal-successTip\">"+errMsg+"</span></li>") ;
	}
	

}) ;