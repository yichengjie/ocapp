// Set configuration
seajs.config({
	base : '/resources/oc/scripts/sea-modules',
	alias : {
		'jquery' : 'jquery/jquery/1.10.1/jquery-1.8.2.js',
		'tuiValidator' : 'tui/tuiValidate/tui_validator.js',
		'jqueryuicore' : 'jquery/jquery/1.10.1/jquery-ui-core.js',
		'jqueryuiwidget' : 'jquery/jquery/1.10.1/jquery-ui-widget.js',
		'jqueryuislider' : 'jquery/jquery/1.10.1/jquery-ui-slider.js',
		'jqueryuimouse' : 'jquery/jquery/1.10.1/jquery-ui-mouse.js',
		'angular':'angular/angularjs/1.4.3/angular.js',
		'angular-route':'angular/angularjs/1.4.3/angular-route.js',
		'ui-router':'angular/angularjs/1.4.3/angular-ui-router.js',
		'angular-resource':'angular/angularjs/1.4.3/angular-resource.js',
		'seajs-text': 'seajs/seajs/2.1.1/seajs-text-debug.js',
		'tuiDialog' : 'tui/tuiDialog/tui_dialog.js',
		'datepicker' : 'tui/tuiDatepicker/datepicker.js',
		'jqueryuitimepickeraddon' : 'jquery/jquery/1.10.1/jquery-ui-timepicker-addon.js',
		'underscore':'underscore/1.7.0/underscore.js'
	},
	preload: ['seajs-text'],
	debug: true
});
//seajs.use('src/main');
//console.log(require.resolve('sea-modules/src/main'));
//seajs.use('sea-modules/fare/oc/1.0.0/main');
// For development
/*if (location.href.indexOf('?dev') > 0) {
	seajs.use('./oc/resources/oc/scripts/src/edit/main',function(app){
		app.init() ;
	});
}else {// For production
	seajs.use('fare/oc/1.0.0/edit/main',function(app){
		app.init() ; 
	});
}*/

//开发版本js
/**/seajs.use('/resources/oc/scripts/src/edit2/main',function(app){
	app.init() ;
});
//上线版本js
/*seajs.use('fare/oc/1.0.0/edit2/main',function(app){
	app.init() ; 
});*/
//测试spm打包版本
/*
seajs.use('./resources/oc/scripts/dist/edit/main',function(app){
	app.init() ;
});*/