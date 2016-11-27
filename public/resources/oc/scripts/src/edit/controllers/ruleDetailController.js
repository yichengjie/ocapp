define(function (require, exports, module) {
	    var controllers = require('./controllers') ;
		var jsonDate = require('../data/editJsonData') ;
		var validHelper = require('../util/S7ValidateHelper') ;
		var _checkHaseErrorInfo = function  (inputEl) {
			if(inputEl.hasClass('error')){
				return true ;
			}
			return false;
		};
		var _delayValidateElement = function(inputEl){
			if(_checkHaseErrorInfo(inputEl)){
				setTimeout(function(){
					validator.element(inputEl) ;
				},100) ;
			}
		};
	    //页面第三部分/////////规则详细部分/////////////////////////////////////////////////////////
	    controllers.controller('RuleDetailCtrl',['$scope','FormData','$http','FormEditStatusServcie',function($scope,FormData,$http,FormEditStatusServcie){
			$scope.data = FormData ;
			//$scope.NEW_ADD_STR = NEW_ADD_STR ;
			$scope.noCharge_notAvailableList = jsonDate.noCharge_notAvailableList ;
			//舱位list集合
			$scope.cabinList = jsonDate.cabinList ;
			//区域集合
		    $scope.geoLocTypeList = jsonDate.geoLocTypeList ;
			//退/改
			$scope.indicatorReissueRefundList = jsonDate.indicatorReissueRefundList ;
			//退款形式
			$scope.formOfRefundList = jsonDate.formOfRefundList ;
			$scope.geoSpecExceptionStopUnitList = jsonDate.geoSpecExceptionStopUnitList ;
			$scope.timeApplicationList = jsonDate.timeApplicationList ;
			
			$scope.getUpGradeTableTile = function(){
				var sel1Value = FormData.sel1.value ;
				var tmpStr = "" ;
				if(sel1Value=="SA"||sel1Value=="BDSA"){
					tmpStr = "座位属性表" ;
				}else if (sel1Value=="UP"||sel1Value=="BDUP"){
					tmpStr = "升舱属性表" ;
				}
				return tmpStr ;
			}
			
			var list = ["SA","BDSA","UP","BDUP"] ;
			$scope.showUpGradeTableFlag = function(){
				var flag = false;
				var index = list.indexOf(FormData.sel1.value) ;
				if(index!=-1){
					flag = true ;
				}
				if(flag){//如果为true，并且serviceType为M，或F时显示
					if($scope.data.serviceType=='M'||$scope.data.serviceType=='F'){
						flag = true ;
					}else{
						flag = false;
					}
				}
				return flag ;
			}
			
			var list2 = ['UP','BDUP'] ;
			$scope.showUpGradeServiceFlag = function(){//升舱到的服务等级
				var flag = false;
				var index = list2.indexOf(FormData.sel1.value) ;
				if(index!=-1){
					flag = true ;
				}
				if(flag){//如果为true，并且serviceType为M，或F时显示
					if($scope.data.serviceType=='M'||$scope.data.serviceType=='F'){
						flag = true ;
					}else{
						flag = false;
					}
				}
				return flag ;
			}
			
			
			//upGradeTable td input size //如果是座位属性表长度为10，订座属性表长度为3
			$scope.getUpGradeInputSize = function(){
				var sel1Value = FormData.sel1.value ;
				var len = 5 ;
				if(sel1Value=="SA"||sel1Value=="BDSA"){
					len = 10 ;
				}else if (sel1Value=="UP"||sel1Value=="BDUP"){
					len = 5 ;
				}
				return len ;
			}
			//data.list178Loc1开始
			//区域1 select改变
			$scope.selectChangeGeoSpecLoc1 = function (){
				$scope.data.geoSpecLoc1 = "" ;
				var inputElement = $(":input[name='geoSpecLoc1']") ;
				_delayValidateElement(inputElement) ;
			}
			//区域2 select改变
			$scope.selectChangeGeoSpecLoc2 = function (){
				$scope.data.geoSpecLoc2 = "" ;
				var inputElement = $(":input[name='geoSpecLoc2']") ;
				_delayValidateElement(inputElement) ;
			}
			//区域3 select改变
			$scope.selectChangeGeoSpecLoc3 = function (){
				$scope.data.geoSpecLoc3 = "" ;
				var inputElement = $(":input[name='geoSpecLoc3']") ;
				_delayValidateElement(inputElement) ;
			}
			
			//当区域、部分、全程select发生变化的时候
			$scope.changeGeoSpecSectPortJourney = function  () {
				var editScope = $scope.$parent ;
				var data = $scope.data;
				var globalEditStatus = FormEditStatusServcie ;
				validHelper.changeGeoSpecSectPortJourney(editScope,data,globalEditStatus) ;
			}

	  }]) ;
}) ;
