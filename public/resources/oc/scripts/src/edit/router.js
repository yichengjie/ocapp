define(function(require, exports, module) {
	//require("ui-router") ;
	require("./services/index") ;
	require("./directives/index") ;
	require("./controllers/index") ;
	require("./filters/filters") ;
	var _ = require('underscore') ;
    var editallHtml = require("./tpls/edit.all.html") ;
	//把需要的模块全部加载到testApp中
	var app = angular.module('app',['pasvaz.bindonce','ngRoute','app.factory','app.controllers','app.directives','app.filter']);
	app.constant('DEFAULT_SERVICETYPE','F') ;//默认的serviceType
	
    app.config(['$routeProvider',function($routeProvider) {
      $routeProvider
        .when('/toEdit/:serviceType', {///users/:user_id
          template:function($routeParams){
          	 //console.info($routeParams) ;
          	 return editallHtml ;
          }
        })
        .otherwise({
          redirectTo: '/toEdit/F'
        });
    }]) ;
}) ;
