define(function(require, exports, module) {
    var app = angular.module('app.services',[]) ;
    app.factory('FormData', function(){
        return {
            requestType:'TSKOC',/*请求类型*/
            salesDate:'',/*销售地日期*/
            pointOfSaleLocation:'',/*销售地*/
            publicObjectType:'',/*发布对象类型*/
            publicObjectCode:'',/*发布对象代码*/
            departureAirportCode:'',/*始发地*/
            arrivalAirportCode:'',/*目的地*/
            departureDateTime:'',/*起飞时间*/
            arrivalDateTime:'',/*到达时间*/
            resBookDesigCode:'',/*市场方RBD*/
            flightNumber:'',/*市场方航班号*/
            marketingAirlineCode:'',/*市场方航空公司*/
            operatingCarrierRBD:'',/*承运方RBD*/
            operatingFlightNumber:'',/*承运方航班号*/
            operatingAirlineCode:'',/*承运方航空公司*/
            equipmentCode:'',/*机型*/
            cabin:'',/*舱位等级*/
            carrierCode:'',/*常旅客积分所在航司*/
            frequentFlyerStatus:'',/*常旅客等级*/
            mileage:'',/*里程数--界面上OC和ABR共用字段显示，转成XML则：ABR用这个节点结构。【里程数】字段界面不显示，程序默认赋值99999.*/
            passengerTypeCode:'',/*旅客类型*/
            subCode:'',/*服务子代码*/
            currencyCode:'',/*货币种类*/
            seatCharacteristics:'',/*提前订座(可填多个，多个用 / 分隔)*/
            listUpgradeInfo:[],/*升舱到子表list*/
            listGeneralTicketInfo:[],/*通用券子表list*/
            syscode:'',/*CRS/ICS(仅Abr)*/
            channelID:'',/*渠道(仅Abr)*/
            officeID:'',/*office号（仅Abr）*/
            /*listFreeInformation:[],*//*免费行李子表list*/
            freeAmount:'',/*免费行李额*/
            freeUnit:'',/*免费行李额单位*/
            listBaggages:[],/*收费行李子表list*/
            fareReference:'',/*基础运价 [美嘉航线]*/
            filingAirlineCode:'',/*运价报备所在航司[美嘉航线]*/
            departureAirportCode2:'',/*始发地[美嘉航线]*/
            arrivalAirportCode2:''/*目的地[美嘉航线]*/
        };
    }) ;

    app.factory('ShowHideTbStatus', function(){
        return {
            listUpgradeInfo:false,
            listGeneralTicketInfo:false,
            listFreeInformation:false,
            listBaggages:false
        }
    });



}) ;