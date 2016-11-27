define(function(require, exports, module) {
	var util = {};
	util.getRbdTb198TmpStr = function(){
		return "rbd" ;//这个返回值一定要和页面上的相同，对应以前的bookSeat
	};
	util.getRbdUpgradeTb198TmpStr = function() {
		return "rbdUpgrade" ;//这个返回值一定要和页面上的相同//对应以前的seatProp
	};
	
	util.getCommonImgArr = function(){
		var arr = ['0B5', '0DG', '0B3', '0LO', '0LQ', '0LT', '0BO']  ;
		return arr ;
	};
	util.getAppName = function(){
		//-/ocGui/oc/ocView
		var pathname = window.location.pathname ;
		var t1 = pathname.substr(1) ;
		var index = t1.indexOf("/") ;
		var t2 = t1.substr(0,index) ;
		return t2 ;
	};

	util.isThreecode = function (value) {
		return /^[A-Z]{3}$/i.test(value) ;
	}
	//输入字符串是否为航空公司二字码
	util.isAir = function (value) {
		return /^[a-zA-Z]{2}$|^[a-zA-Z]{1}[0-9]{1}$|^[0-9]{1}[a-zA-Z]{1}$/.test(value);
	}

	module.exports = util ;
});