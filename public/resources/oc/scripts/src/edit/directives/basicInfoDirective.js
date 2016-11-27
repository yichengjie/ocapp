define(function(require, exports, module){
	 var _ = require("underscore") ;
	 var directives = require("./directives") ;
	 var headerHtml = require("../tpls/header.html") ;
	 var chooseDivHtml = require("../tpls/choose_div.html") ;
	 var chooseUlHtml = require("../tpls/choose-ul.html") ;

	 directives.directive('headerDrct', function() {
	    return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
	        template: headerHtml
	    };
	 });

	 directives.directive('chooseDiv', function() {
	    return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
			transclude:true,
	        template: chooseDivHtml,
			compile: function compile(tElement, tAttrs, transclude){
				var urlStr = tAttrs['htmlUrl'] ;
				var template = _.template(chooseUlHtml);
				var htmlStr = template({value: urlStr});
				var tmpDiv = angular.element(tElement).find('div.service_list') ;
				tmpDiv.append(htmlStr) ;
			}
	    };
	 });

 }) ;
