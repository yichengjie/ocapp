define(function(require, exports, module){ 
	 var directives = require("./directives") ;
	 directives.directive('geoSpecInput', function() {
	    return {
	        restrict: 'E',
	        replace: true,
			scope:true,
	        template: geoSpecInputHtml,
			transclude:true
	    };
	 });
	 
}) ;