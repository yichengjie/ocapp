define(function(require) {

  var util = require('./util') ;
  var S7Query = require('./s7query');
  new S7Query();
  
  var S7Publish = require('./s7publish');
  var s7publish = new S7Publish();
  s7publish.init();
  
  var S7Delete = require('./s7delete');
  var s7delete = new S7Delete();
  s7delete.init();
  
  //终止操作相关代码
  var S7Abort = require('./s7abort') ;
  var s7abort = new S7Abort() ;
  s7abort.init() ;

  //当点击复制数据的时候
  $('#copyRecord7Btn').bind('click',function (event) {
  		//console.info('复制一条数据。。。。。。') ;
  		var checkedR7s = $(":checkbox[name=s7check]:checked") ;
  		var len = checkedR7s.length ;
  		if(len==1){
  			var td = checkedR7s.parent('td') ;
  			var s7Id = td.find(":input[name=s7id]").val() ;
  			var appName = util.getAppName() ;
  			var toUrl = "/"+appName+"/toCopyS7UI?s7Id="+ s7Id;
  			console.info(" s7Id : " + s7Id) ;
  			window.location.href = toUrl ;
  		}else if(len==0){
        $.showTuiErrorDialog('请选择一条需要复制的记录!');
      }else{
  			$.showTuiErrorDialog('只能选择一条需要复制的记录!');
  		}
  }) ;

}) ;
  
