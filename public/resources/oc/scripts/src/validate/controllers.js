define(function(require, exports, module) {
    var app = angular.module('app.controllers',[]) ;
    var _ = require('underscore') ;


    function changeInputStatus4Submit(data,myForm){
        var keys1 = _.keys(data) ;
        var keys2 = _.keys(myForm) ;
        _.each(keys2,function(item){
            if(_.contains(keys1,item)){
                myForm[item].$setDirty(true) ;
            }
        }) ;
    }

    function changeInputStatus4Submit2(data,myForm){
        var type = data.requestType ;
        myForm.pointOfSaleLocation.$setDirty(true) ;
        myForm.requestType.$setDirty(true) ;/*请求类型*/
        myForm.salesDate.$setDirty(true) ;/*销售地日期*/
        myForm.pointOfSaleLocation.$setDirty(true) ;/*销售地*/
        myForm.publicObjectType.$setDirty(true);/*发布对象类型*/
        myForm.publicObjectCode.$setDirty(true);/*发布对象代码*/
        myForm.departureAirportCode.$setDirty(true) ;/*始发地*/
        myForm.arrivalAirportCode.$setDirty(true);/*目的地*/
        myForm.departureDateTime.$setDirty(true);/*起飞时间*/
        myForm.arrivalDateTime.$setDirty(true);/*到达时间*/
        myForm.resBookDesigCode.$setDirty(true);/*市场方RBD*/
        myForm.flightNumber.$setDirty(true);/*市场方航班号*/
        myForm.marketingAirlineCode.$setDirty(true);/*市场方航空公司*/
        myForm.operatingCarrierRBD.$setDirty(true);/*承运方RBD*/
        myForm.operatingFlightNumber.$setDirty(true);/*承运方航班号*/
        myForm.operatingAirlineCode.$setDirty(true);/*承运方航空公司*/
        myForm.equipmentCode.$setDirty(true);/*机型*/
        myForm.cabin.$dirty;/*舱位等级*/
        myForm.carrierCode.$setDirty(true);/*常旅客积分所在航司*/
        myForm.frequentFlyerStatus.$setDirty(true);/*常旅客等级*/
        myForm.passengerTypeCode.$setDirty(true);/*旅客类型*/
        myForm.fareReference.$setDirty(true);/*基础运价 [美嘉航线]*/
        myForm.filingAirlineCode.$setDirty(true);/*运价报备所在航司[美嘉航线]*/
        myForm.departureAirportCode2.$setDirty(true);/*始发地[美嘉航线]*/
        myForm.arrivalAirportCode2.$setDirty(true);/*目的地[美嘉航线]*/
        if(type=='C'||type=='P'){//abr的单独处理
            myForm.currencyCode.$setDirty(true);/*货币种类*/
            myForm.syscode.$setDirty(true) ;/*CRS/ICS(仅Abr)*/
            myForm.channelID.$setDirty(true) ;/*渠道(仅Abr)*/
            myForm.officeID.$setDirty(true) ;/*office号（仅Abr）*/
            myForm.freeAmount.$setDirty(true);/*免费行李额*/
            myForm.freeUnit.$setDirty(true);/*免费行李额单位*/
        }else if(type=='TSKOC'){//oc的单独处理
            myForm.subCode.$setDirty(true);/*服务子代码(仅oc)*/
            myForm.currencyCode.$setDirty(true);/*货币种类*/
            myForm.seatCharacteristics.$setDirty(true) ;/*提前订座(可填多个，多个用 / 分隔)（仅oc）*/
        }
    }



    function simplePropCopy (obj,org){
        for(var name in org){
            obj[name] = angular.copy(org[name])  ;
        }
    }

    app.controller('EditController',['$scope','FormData','HttpOperService','ShowHideTbStatus','growl', function ($scope,FormData,HttpOperService,ShowHideTbStatus,growl) {
        $scope.data = FormData ;
        $scope.orgData = angular.copy(FormData) ;
        $scope.showHideStatus = ShowHideTbStatus ;
        //$scope.showDetailPanelFlag = false;
        //项目目录
        $scope.contextPath = $("#contextPath").val() ;
        console.info('contextPath : ' +  $scope.contextPath) ;

        //验证结果存放
        $scope.validateResultData = {
            back:false,
            requestXML:'',
            singleDataFlag:false,
            multiDataFlag:false,
            singleData:{},
            multiData:{list:[],all:{}},
            showDetailPanelFlag:false
        } ;

        $scope.orgValidateResultData = angular.copy($scope.validateResultData) ;

        window.onscroll = function () { 
            var top = document.documentElement.scrollTop || document.body.scrollTop; 
            if($scope.validateResultData.showDetailPanelFlag){
               $scope.$apply(function(){
                   $scope.validateResultData.showDetailPanelFlag = false;
               }) ; 
            }
        };
        //返回之前页面
        $scope.backPage = function (e) {
            //console.info('back page ......') ;
            window.location.href = "/html/" ;
        };
        //清空页面数据
        $scope.resetPage = function (e) {
            //console.info('reset page ......') ;
            growl.addSuccessMessage("重置页面数据成功!");
            simplePropCopy($scope.validateResultData,$scope.orgValidateResultData) ;
            //$scope.showDetailPanelFlag = false;
            var keys =  _.keys(FormData) ;
            _.each(keys, function (key) {
                var oldValue =  $scope.orgData[key] ;
                if(_.isArray(oldValue)|| _.isObject(oldValue)){
                    $scope.data[key] = angular.copy(oldValue) ;
                }else{
                    $scope.data[key] = oldValue ;
                }
            }) ;
            $scope.myForm.$setPristine() ;
        };
        //注册jquery validate框架
        //对表单注册校验
        var validator = $("#myForm").validate({meta:""});
        //提交表单
        $scope.submitPage = function () {
            var url = $scope.contextPath+"/validate/submitPage" ;
            var ngFlag = $scope.myForm.$valid ;
            //将结校验结果init
            simplePropCopy($scope.validateResultData,$scope.orgValidateResultData) ;
            //$scope.showDetailPanelFlag = false;
            //将页面上所有字段的dirty置为true
            changeInputStatus4Submit($scope.data,$scope.myForm) ;
            var jqFlag = validator.form() ;
            var config = {} ;
            var queryParam = $scope.data ;
            //growl.addInfoMessage("This adds a info message");
            //growl.addSuccessMessage("This adds a success message");
            //growl.addErrorMessage("This adds a error message");
            if (ngFlag&&jqFlag) {
                $scope.validateResultData.back = true ;
                var promise = HttpOperService.post4JSONData(url,queryParam,config) ;
                promise.then(function (data) {
                    var retFlag = data.flag ;
                    $scope.validateResultData.requestXML = data.requestXML ;
                    if(retFlag==true||retFlag=='true'){
                        growl.addSuccessMessage("验证信息返回成功!");
                        if(data.singleDataFlag==true||data.singleDataFlag=='true'){
                            $scope.validateResultData.singleDataFlag = true ;
                            $scope.validateResultData.singleData = data.singleData ;
                        }else{
                            $scope.validateResultData.singleDataFlag = false ;
                        }
                        if(data.multiDataFlag==true||data.multiDataFlag=='true'){
                            $scope.validateResultData.multiDataFlag = true ;
                            $scope.validateResultData.multiData = data.multiData ;
                        }else{
                            $scope.validateResultData.multiDataFlag = false ;
                        }
                    }else{
                        $scope.validateResultData.singleDataFlag = false ;
                        $scope.validateResultData.multiDataFlag = false ;
                        growl.addErrorMessage("校验出错，请检查网络!");
                    }
                }) ;
            } else {
                growl.addWarnMessage("验证未通过，表单填写存在错误!");
                //$scope.myForm.submitted = true;
            }
        };
        //常旅客等级，从数据库配置中读取
        $scope.frequentFlyerStatusList = [] ;
        //旅客类型，从数据库配置中读取
        $scope.passengerTypeCodeList = [] ;
        //当前日期
        var currentDateTimeStr = moment().format('YYYY-MM-DD HH:mm') ;



        //免费行李的显示与隐藏
        $scope.showHideFreeBaggageFlag = false;
        $scope.showHideFreeBaggage = function () {
            $scope.showHideFreeBaggageFlag = !$scope.showHideFreeBaggageFlag ;
            if($scope.showHideFreeBaggageFlag){//如果将变成隐藏
                $scope.data.freeAmount = '' ;
                $scope.data.freeUnit = '' ;
            }
        };

        var initPageDataUrl = $scope.contextPath+"/validate/initPageData" ;
        var promise = HttpOperService.get4JSONData(initPageDataUrl) ;
        promise.then(function (data) {
            //将日期控件填充为当前的时间
            $scope.data.salesDate = currentDateTimeStr ;
            $scope.data.departureDateTime = currentDateTimeStr ;
            $scope.data.arrivalDateTime = currentDateTimeStr ;
            if(data.flag=='true'||data.flag==true){
                $scope.frequentFlyerStatusList = data.frequentFlyerStatusList ;
                $scope.passengerTypeCodeList = data.passengerTypeCodeList ;
            }else{
                //console.error('初始化页面数据出错...') ;
                growl.addErrorMessage("初始化页面数据出错...");
            }
        }, function (err) {
           //console.info(err) ;
           growl.addErrorMessage("获取初始化页面数据出错，请检查网络!");
        }) ;

        //当改变发布对象类型的时候
        $scope.changePublicObjectType = function (type) {
            if(type==''){
                $scope.data.publicObjectCode = '' ;
                $scope.myForm.publicObjectCode.$setValidity('length6',true) ;
                $scope.myForm.publicObjectCode.$setValidity('length8',true) ;
            }else{
                var len = $scope.data.publicObjectCode.length ;
                if(type=='T'){
                    if(len>6){
                        $scope.myForm.publicObjectCode.$setValidity('length6',false) ;
                    }else{
                        $scope.myForm.publicObjectCode.$setValidity('length6',true) ;
                    }
                    $scope.myForm.publicObjectCode.$setValidity('length8',true) ;
                }else{
                    if(len>8){
                        $scope.myForm.publicObjectCode.$setValidity('length8',false) ;
                    }else{
                        $scope.myForm.publicObjectCode.$setValidity('length8',true) ;
                    }
                    $scope.myForm.publicObjectCode.$setValidity('length6',true) ;
                }
            }
            //$scope.myForm.publicObjectCode.$validate();
        }

        //复制请求xml数据到粘贴板上
        /*$scope.copyRequestXML = function (event) {
            //var clip = new ZeroClipboard();
            // 添加id为copy2的元素作为复制载体，原来id为copy的元素依然可用
            //clip.setText("设置用于复制的文本内容");
            // main.js
            //var client = new ZeroClipboard($(".copyXML"));
            //client.setText( "Copy me!" );
            //ZeroClipboard.setData("Copy me!" );
            //console.info(ZeroClipboard) ;
            //ZeroClipboard.setData( "text/plain", "Copy me!" );
            //console.info(ZeroClipboard.setData) ;
           // event.clipboardData.setData('text/plain', 'hello world');
            //ZeroClipboard.setData( "text/plain", "Copy me!" );
        }*/

        //当表格的tr被点击时的操作
        $scope.selectTr = function (event) {
            $(event.target).parents('tr').siblings('tr').removeClass('selectTd')  ;
            $(event.target).parents('tr').addClass('selectTd') ;
        }
        //显示隐藏验证结果明细
        $scope.showValidateResultDetail = function () {
            $scope.validateResultData.showDetailPanelFlag = !$scope.validateResultData.showDetailPanelFlag;
        }
    }]) ;
}) ;
