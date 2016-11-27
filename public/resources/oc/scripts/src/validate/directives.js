define(function(require, exports, module) {
    var util = require('../util') ;
    var app = angular.module('app.directives',[]) ;
    //var listUpgradeInfoHtml = require('./tpls/listUpgradeInfo.html') ;
    //var listGeneralTicketInfoHtml = require('./tpls/listGeneralTicketInfo.html') ;
    //var listFreeInformationHtml = require('./tpls/listFreeInformation.html') ;
    //var listBaggagesHtml = require('./tpls/listBaggages.html') ;


    app.directive('showHideTable',['ShowHideTbStatus',function (ShowHideTbStatus) {
        return{
            restrict:'E',
            scope:{},
            replace:true,
            template: function (elem,attrs) {
                var tbname = attrs['tbname'] ;
                var str = '<a href="javascript:void(0)" >' +
                            '<span ng-show="!showHideStatus.'+tbname+'">显示表格</span>' +
                            '<span ng-show="showHideStatus.'+tbname+'">收起表格</span>' +
                          '</a>' ;
                return str ;
            },
            link: function (scope,elem,attrs) {
                scope.showHideStatus = ShowHideTbStatus ;
                var tbname = attrs['tbname'] ;
                elem.bind('click', function () {
                    scope.$apply(function () {
                        ShowHideTbStatus[tbname] = !scope.showHideStatus[tbname] ;
                    })
                }) ;
            }
        } ;
    }]) ;


    app.directive('addDelete',function () {
        return{
            restrict:'E',
            scope:{list:'='},
            replace:true,
            template: function (elem,attrs) {
                var str = '<div class="helper_margin_top5">' +
                    '<div class="btn_page btn_add_small">' +
                    '<div class="btn_left"></div>' +
                    '<div class="btn_content add_line">增加一行</div>' +
                    '<div class="btn_right"></div>' +
                    '</div>' +
                    '<div class="btn_page btn_add_small_2">' +
                    '<div class="btn_left"></div>' +
                    '<div class="btn_content delete_line">删除一行</div>' +
                    '<div class="btn_right"></div>' +
                    '</div>' +
                    '<div class="clearfix"></div>' +
                    '</div>' ;
                return str;
            },
            link: function (scope,elem,attrs) {
                var tbname = attrs['tbname'] ;
                elem.find('.add_line').bind('click', function (event) {
                    var obj = null ;
                    if('listUpgradeInfo'==tbname){//升舱到--[McRbd,OcRbd,McCabin,OcCabin]
                        obj = {mcRbd:'',ocRbd:'',mcCabin:'',ocCabin:''} ;
                    }else if('listGeneralTicketInfo'==tbname){//通用券--[TotalTicketNumber,PassengerNumber]
                        obj = {totalTicketNumber:'',passengerNumber:''} ;
                    }else if('listBaggages'==tbname){//收费行李--[Weight,WeightUnit,Size,SizeUnit,SubCode]
                        obj = {weight:'',weightUnit:'',size:'',sizeUnit:'',subCode:''} ;
                    }
                    if(obj!=null){
                        scope.$apply(function(){
                            scope.list.push(obj) ;
                        }) ;
                    }
                    //将刚添加的一行背景色改变
                    elem.prev().find('tr').removeClass('selectTd').last().addClass('selectTd') ;
                }) ;
                elem.find('div.delete_line').bind('click', function (event) {
                    var len = scope.list.length ;
                    if(len>=1){
                        var index = len-1 ;
                        elem.prev().find('tbody tr').each(function (i) {
                            if($(this).hasClass('selectTd') ){
                                index = i ;
                                return false ;
                            };
                        });
                        console.info('删除第['+index+']条记录!') ;
                        scope.$apply(function(){
                            scope.list.splice(index,1) ;
                        }) ;
                    }
                }) ;
            }
        } ;
    }) ;

    //日期插件
    app.directive('datepicker',function(){
        return{
            restrict: 'A',
            scope: {},
            require:'ngModel',
            link: function (scope,elem,attr,ctrl) {
                if(!ctrl) return ;
                //配置日期控件
                var optionObj = {} ;
                optionObj.dateFormat = "yy-mm-dd" ;
                var updateModel = function(dateText){
                    scope.$apply(function  () {
                        //调用angular内部的工具更新双向绑定关系
                        ctrl.$setViewValue(dateText) ;
                    }) ;
                }
                optionObj.onSelect = function(dateText,picker){
                    updateModel(dateText) ;
                    // elem.focus() ;
                    //调用jquery-validate框架校验输入框的输入
                    //validator.element(elem) ;
                    if(scope.select){
                        scope.$apply(function  () {
                            scope.select({date:dateText}) ;
                        }) ;
                    }
                }
                optionObj.showButtonPanel = true ;
                /*ctrl.$render = function(){
                 //console.info('这个方法好像只有在第一次加载的收执行.......') ;
                 //下面这段步骤1和步骤2千万不能弄混了，1必须在前面
                 //1.将后台ng-model中的数据填充到页面上
                 elem.datepicker('setDate',ctrl.$viewValue || '') ;//最后期发现是setDate的时候会根据最新的日期设置显示的页面上的html日期字符串
                 //2.下面写这个的原因是如果我们的日期控件设置了最小日期的话，当我们修改数据时，
                 //如果从数据库中读取的字段日期小于最小日期，datepicker会自动的将控件的日期设置为今天的日期,
                 //而这时angular并不知道，所有这里手动设置为页面上的html字符串,只有第一次加载时才可能出现这个问题
                 var viewView = ctrl.$viewValue ;
                 var textValue = $(elem).val() ;
                 if(viewView!=textValue){
                 ctrl.$setViewValue(textValue);
                 }
                 }*/
                elem.datepicker(optionObj);
            }
        };
    }) ;

    app.directive('datetimepicker', [function () {
        return {
            restrict: 'A',
            scope:true,
            require:'?ngModel',
            link: function (scope, iElement, iAttrs,ctrl) {
                if(!ctrl) return ;
                //var currentDateTimeStr = iAttrs['datetimepicker'] ;

                //配置日期控件
                var optionObj = {} ;
                optionObj.dateFormat = "yy-mm-dd" ;
                optionObj.timeFormat = 'HH:mm' ;
                var updateModel = function(dateText){
                    scope.$apply(function  () {
                        //调用angular内部的工具更新双向绑定关系
                        ctrl.$setViewValue(dateText) ;
                    }) ;
                }
                optionObj.onSelect = function(dateText,picker){
                    updateModel(dateText) ;
                    if(scope.select){
                        scope.$apply(function  () {
                            scope.select({date:dateText}) ;
                        }) ;
                    }
                }
                optionObj.timeText="&nbsp;&nbsp;时间" ;
                optionObj.hourText ="&nbsp;&nbsp;时" ;
                optionObj.minuteText ="&nbsp;&nbsp;分" ;
                //optionObj.secondText = "&nbsp;&nbsp;秒" ;
                optionObj.currentText = "当前" ;
                optionObj.closeText = "关闭" ;
                optionObj.showButtonPanel = true ;
                //optionObj.showSecond = true ;
                iElement.datetimepicker(optionObj) ;
            }
        };
    }])

    app.directive("upperInput",function(){
        return{
            restrict:'A',
            require:'ngModel',
            link:function(scope,element,attrs,ngModel){
                if (!ngModel)
                    return; // do nothing if no ng-model
                // Specify how UI should be updated
                ngModel.$render = function() {
                    var tmp = ngModel.$viewValue || '' ;
                    tmp = tmp.toUpperCase() ;
                    element.val(tmp);
                    ngModel.$setViewValue(tmp);
                };
                // Listen for change events to enable binding
                element.bind('blur', function() {
                    scope.$apply(read);
                });
                //read(); // initialize
                /// Write data to the model
                function read() {
                    var tmp = ngModel.$viewValue || '';
                    tmp = tmp.toUpperCase() ;
                    ngModel.$setViewValue(tmp);
                    element.val(tmp);
                }
            }
        }
    }) ;


    //自定义校验(三字码)
    app.directive('threecode',function(){
        return {
            restrict:"A",
            scope:true,
            require:"ngModel",
            link:function(scope,ele,attrs,ctrl){
                ctrl.$parsers.push(function(viewValue){
                    var flag = true ;
                    if(viewValue!=''){
                        if(!util.isThreecode(viewValue)){
                            flag = false;
                        }
                    }
                    ctrl.$setValidity('threecode',flag);
                    return viewValue;
                });
            }
        }
    });

    app.directive('air',function(){
        return {
            restrict:"A",
            scope:true,
            require:"ngModel",
            link:function(scope,ele,attrs,ctrl){
                ctrl.$parsers.push(function(viewValue){
                    var flag = true ;
                    if(viewValue!=''){
                        if(!util.isAir(viewValue)){
                            flag = false;
                        }
                    }
                    ctrl.$setValidity('air',flag);
                    return viewValue;
                });
            }
        }
    });

    //发布对象校验
    app.directive('publicobj',function(){
        return {
            restrict:"A",
            scope:true,
            require:"ngModel",
            link:function(scope,ele,attrs,ctrl){
                ctrl.$parsers.push(function(viewValue){
                    var curType = attrs['publicobj'] ;
                    var len = viewValue.length ;
                    if(curType=='T'){
                        if(len>6){
                            ctrl.$setValidity('length6',false);
                        }else{
                            ctrl.$setValidity('length6',true);
                        }
                        ctrl.$setValidity('length8',true);
                    }else{
                        if(len>8){
                            ctrl.$setValidity('length8',false);
                        }else{
                            ctrl.$setValidity('length8',true);
                        }
                        ctrl.$setValidity('length6',true);
                    }
                    return viewValue;
                });
            }
        }
    });


    /*app.directive('linkTable',['ShowHideTbStatus',function (ShowHideTbStatus) {
        return{
            restrict:'E',
            scope:{list:'='},
            replace:true,
            template: function (elem,attrs) {
                var tbname = attrs['tbname'] ;
                var str = '<a href="javascript:void(0)" >' +
                    '<span ng-show="!showHideStatus.'+tbname+'">自定义表格</span>' +
                    '<span ng-show="showHideStatus.'+tbname+'">取消自定义</span>' +
                    '</a>' ;
                return str ;
            },
            link: function (scope,elem,attrs) {
                scope.showHideStatus = ShowHideTbStatus ;
                var tbname = attrs['tbname'] ;
                elem.bind('click', function () {
                    var nextFlag = !scope.showHideStatus[tbname] ;
                    scope.$apply(function () {
                        ShowHideTbStatus[tbname] =nextFlag;
                        if(!nextFlag){//如果是取消自定义，则要清空表格数据
                            scope.list = [] ;
                        }
                    })
                }) ;
            }
        } ;
    }]) ;*/
    //table子表
    /*app.directive('tableInfo',['ShowHideTbStatus',function (ShowHideTbStatus) {
        return {
            restrict:'E',
            scope:{
                list:'='
            },
            replace:true,
            template: function (elem,attrs) {
                var tbname = attrs['tbname'] ;
                var tmpStr = '<div class = "table_layout" style="width:500px;">子表信息不符无法显示</div>' ;
                if('listUpgradeInfo'==tbname){
                    tmpStr = listUpgradeInfoHtml ;
                }else if('listGeneralTicketInfo'==tbname){
                    tmpStr = listGeneralTicketInfoHtml ;
                }else if('listFreeInformation'==tbname){
                    tmpStr = listFreeInformationHtml ;
                }else if('listBaggages'==tbname){
                    tmpStr = listBaggagesHtml ;
                }
                return tmpStr ;
            },
            controller: ['$scope','$element','$attrs',function ($scope,$element,$attrs) {
                $scope.showHideStatus = ShowHideTbStatus ;
                $scope.selectTr = function (event) {
                    $(event.target).parents('tr').siblings('tr').removeClass('selectTd')  ;
                    $(event.target).parents('tr').addClass('selectTd') ;
                }
            }],
            link: function (scope,elem,attrs) {
                var tbname = attrs['tbname'] ;
                elem.find('.add_line').bind('click', function (event) {
                    var obj = null ;
                    var max = 100;
                    if('listUpgradeInfo'==tbname){//升舱到--[McRbd,OcRbd,McCabin,OcCabin]
                        obj = {mcRbd:'',ocRbd:'',mcCabin:'',ocCabin:''} ;
                    }else if('listGeneralTicketInfo'==tbname){//通用券--[TotalTicketNumber,PassengerNumber]
                        obj = {totalTicketNumber:'',passengerNumber:''} ;
                    }else if('listBaggages'==tbname){//收费行李--[Weight,WeightUnit,Size,SizeUnit,SubCode]
                        obj = {weight:'',weightUnit:'',size:'',sizeUnit:'',subCode:''} ;
                    }
                    if(obj!=null){
                        scope.$apply(function(){
                            scope.list.push(obj) ;
                        }) ;
                    }
                    //将刚添加的一行背景色改变
                    elem.find('tr').removeClass('selectTd').last().addClass('selectTd') ;
                }) ;
                elem.find('.delete_line').bind('click', function (event) {
                    var len = scope.list.length ;
                    if(len>=1){
                        var index = len-1 ;
                        elem.find('tbody tr').each(function (i) {
                            if($(this).hasClass('selectTd') ){
                                index = i ;
                                return false ;
                            };
                        });
                        console.info('删除第['+index+']条记录!') ;
                        scope.$apply(function(){
                            scope.list.splice(index,1) ;
                        }) ;
                    }
                }) ;
            }
        } ;
    }]) ;*/



}) ;
