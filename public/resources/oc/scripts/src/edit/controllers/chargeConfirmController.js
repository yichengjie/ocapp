define(function (require, exports, module) {
	var controllers = require('./controllers') ;
	var jsonDate = require('../data/editJsonData') ;
	var commonUtil = require('../util/commonUtil') ;
	var jsonDataHelper = require('../data/jsonDataHelper') ;
	var _ = require('underscore') ;
	var validHelper = require('../util/S7ValidateHelper') ;

   //页面第二个部分///////费用确定部分////////////////////////////////////////////////////////
   controllers.controller('ChargeConfirmCtrl',['$scope','FormData','FormEditStatusServcie',function($scope,FormData,FormEditStatusServcie){
   			$scope.data  = FormData ;
			//当选择免费或则收费时触发的事件
			//行李重量单位集合
			$scope.weightUnitList = jsonDate.weightUnitList ;
			//SPEC_SERVICE_FEE_COL_SUB//包含/扣除
			$scope.specServiceFeeColSubList = jsonDate.specServiceFeeColSubList ;
			//净价/销售价
			$scope.specServiceFeeNetSellList = jsonDate.specServiceFeeNetSellList ;
			$scope.baggageTravelApplicationList = jsonDate.baggageTravelApplicationList ;
			

			//当是否收费改变时触发的函数
			$scope.changeNoChargeNotAvailable = function  () {
				var editScope = $scope.$parent ;
				var data = $scope.data;
				var globalEditStatus = FormEditStatusServcie ;
				validHelper.changeNoChargeNotAvailable(editScope,data,globalEditStatus) ;
			} ;

			//适用于改变时
			$scope.changeSpecifiedServiceFeeApp = function(){
				var editScope = $scope.$parent ;
				var data = $scope.data ;
				validHelper.changeSpecifiedServiceFeeApp(editScope,data) ;
			};
			
			//当改变使用时间限制类型的时候
			$scope.changeUseDateLimitTye = function(type){
				type = type || '' ;
				var statusDes = $scope.data.statusDes ;
				var canEditFlag = commonUtil.getEditFlagByStatus(statusDes) ;
				if(canEditFlag){
					var oldType = $scope.data.useDateLimitTye ;
					if(oldType==type) return ;
					if(type==''){//如果为时间段
						$scope.data.useDateLimitTye = '' ;
						//将期限数据清空
						$scope.data.effectivePeriodType= '' ;
						$scope.data.effectivePeriodNumber = '' ;
						$scope.data.effectivePeriodUnit = '' ;
					}else if(type=='1'){//如果为期限
						$scope.data.useDateLimitTye = '1' ;
						//将时间段数据清空
						$scope.data.firstUseDate = '' ;
						$scope.data.lastUseDate = '' ;
					}
				}
			}
			
			//-------------区域对应的表格显示隐藏结束--------//
			$scope.changeEffectivePeriodType = function (){
				var input1 = $(':input[name=effectivePeriodNumber]') ;
				if($scope.data.effectivePeriodType==''){
					$scope.data.effectivePeriodNumber='';
					$scope.data.effectivePeriodUnit='';
					_delayValidateElement(input1) ;
				}else{
					$scope.data.effectivePeriodUnit='D';
				}
			}

			//table内部选择，全额或折扣
			$scope.clickDiscount2 = function(l){
				var type = l.discountType ;
				if(type=='1'){//全额
					l.discountNum = '' ;
				}else{
					l.onePriceNum = '' ;
				}
			};
			//金额选择全额或则折扣时
			$scope.clickDiscount = function(dt){
				//整个编辑状态为3的时候是不能编辑的
				var pageEditFlag = commonUtil.getEditFlagByStatus(FormData['statusDes']) ;
				if(!pageEditFlag)return ;
				
				//当点击时可以触发展开表格
				$scope.data.discountOrNot = dt ;
				if(dt=='1'){//全额
					$scope.data.list201VO = [] ;
				}else{//折扣
					//第三列一定要已选中
					$scope.data.list170VO = [] ;
					var sel3value = $scope.data.sel3.value ;
					if(sel3value.length>0){
						//将复用170数据清空
						$scope.data.reuseList170VO = '' ;
						$(":input[name='reuseList170VO']").val('') ;
						$scope.data.list201VO = [] ;//数据初始化
						//1.判断套餐/非套餐
						//2.套餐:显示每一条,非套餐的话总的显示一条
						var serviceGroup = $scope.data.sel1.value;    //BD
						if(serviceGroup!=null&&serviceGroup.length>2&&serviceGroup.indexOf('BD')===0){
							//说明是套餐
							var tmpArr = [] ;//[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
							for(var i = 0 ; i < $scope.data.sel4.length;i++){
								var l = $scope.data.sel4[i] ;
								var obj = {"subCode":l.subCode,"commercialName":l.commercialName,"discountType":'1',"onePriceNum":'',"discountNum":''};
								tmpArr.push(obj) ;
							}
							$scope.data.list201VO = tmpArr ;
						}else{//说明是非套餐
							$scope.data.list201VO = [] ;//数据初始化
							//显示str $scope.data.sel3.showStr
							var subCode = $scope.data.sel3.value ;
							var index = 2+subCode.length ;//'['+subCode+']'
							var sel3ShowStr = $scope.data.sel3.showStr ;
							var commercialName = sel3ShowStr.substring(index);
							//[1]页面显示的字符串,[2]折扣类型,[3]一口价,[4]一口价单位,[5]折扣数
							var obj = {"subCode":subCode,"commercialName":commercialName,"discountType":'1',"onePriceNum":'',"discountNum":''};
							$scope.data.list201VO = [obj] ;
						}
					}else{
						$scope.data.list201VO = [] ;//数据初始化
						alert('服务必须选择到最后一级!') ;
					}
				}
			};
   }]) ;
}) ;
