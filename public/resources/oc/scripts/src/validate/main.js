define(function(require, exports, module) {
	require('tuiDialog') ;
	require('datepicker') ;
	require('jqueryuitimepickeraddon') ;
	require('./services') ;
	require('./HttpOperService') ;
	require('./controllers') ;
	require('./directives') ;
	var app = angular.module('app',['angular-growl','ngMessages','app.services','app.controllers','app.directives']);

	app.config(['growlProvider', function(growlProvider) {
		growlProvider.globalTimeToLive(3000);
	}]);
	/**页面加载完毕之后启动angualr**/
	module.exports = {
		init: function(){
			angular.element(document).ready(function() {
				angular.bootstrap(document, ['app']);
				$("body").on("copy", ".copyXML", function( e) {
					e.clipboardData.clearData();
					e.clipboardData.setData("text/plain", $(this).data("zclip-text"));
					e.preventDefault();
				});
			});
		}
	}



}) ;