define(function(require, exports, module){
	 var directives = require('./directives') ;
	 var _ = require('underscore') ;
	 var jsonDataHelper = require('../data/jsonDataHelper') ;
	 var commonUtil = require("../util/commonUtil") ;
	 
	 var convertFirstCharUpper = function(str){
	 	str = str || "" ;
	 	return str.replace(/(\w)/,function(v){return v.toUpperCase()});
	 }

	 //显示隐藏表格
	 directives.directive('showHideTable',['TbShowHideServcie',function(TbShowHideServcie){
	    return {
	        restrict: 'E',
	        replace: true,
	        scope: {},
	        controller:['$scope','$element','$attrs',function($scope,$element,$attrs){
	        	$scope.tableStatus = TbShowHideServcie ;
	        }],
	        template:function(elem,attrs){
	        	var tname = attrs['tname'] ;
	        	var tmpStr = "tableStatus."+tname ;
	        	var html = '<a  href = "javascript:void(0)"><span ng-show="'+tmpStr+'" >收起表格</span><span ng-show="!'+tmpStr+'">填写表格</span></a>' ;
	        	return html ;
	        }, 
	        transclude:true,
	        link: function(scope, element, attrs){
	        	element.bind('click',function(){
	        		var tname = attrs['tname'] ;
	        		scope.$apply(function(){
						scope.tableStatus[tname] = !scope.tableStatus[tname] ;
	        		}) ;
	        	}) ;
	        }
	    };
	}]) ;


	var _fillData4AutoComplete = function(suggestion,tbname ,FormData,FormEditStatusServcie,HttpOperService,customeEditStatus,tbnoName){
		//scope.showCustomeEditFlag = true;
    	var tbNO = suggestion.data ;
    	var url = FormData.contextPath+"/queryTableInfoByTbNO.action?tbNO="+tbNO+"&tbname="+tbname ;
    	var promise = HttpOperService.getDataByUrl(url) ;
    	var oldTbNo = FormData[tbnoName] ;
    	var subTbReferenceCount = FormData['subTbReferenceCountMap'][tbname] *1;
    	var reusePropName = "reuse"+convertFirstCharUpper(tbname) ;
    	promise.then(function  (retData) {
    		var list = jsonDataHelper.convert2TableDataList(retData.list,tbname) ;
    		//如果当前标号与复用标号相同的话，并且是只被当前r7引用的话，说明不是复用，而是修改自己的记录
    		if(subTbReferenceCount<=1&&oldTbNo==tbNO){//如果和之前的标号相同，并且被r7引用条数不大于1的话,可编辑
				//1.设置表格可编辑
				FormEditStatusServcie[tbname] = true;
				//2.清除复用标志
				FormData[reusePropName] = ''; 
				//3.隐藏自定义表格按钮
				customeEditStatus[tbname] = true;
    		}else{
    			FormEditStatusServcie[tbname] = false;
    			//显示自定义表格按钮
    			customeEditStatus[tbname] = true;
    		}
    		FormData[tbname] = list ;
    	},function(error){
    		console.info('获取数据出错!'+error) ;
    	}) ;
	} ;
	

	directives.directive('ocComplete', ['FormEditStatusServcie','FormData','HttpOperService','ListVo2tbNoMap','TbShowHideServcie','CustomeEditTbStatusServcie',function (FormEditStatusServcie,FormData,HttpOperService,ListVo2tbNoMap,TbShowHideServcie,CustomeEditTbStatusServcie) {
	 	return {
	 		restrict: 'E',
	 		replace:true,
	 		scope:true,
	 		template:function  (elem,attrs) {
	 			//获取当前页面控件是否是非编辑状态
	 			var str ="" ;
 				var tbname = attrs['tbname'] ;
 				var reuseTablePropName = "reuse"+convertFirstCharUpper(tbname) ;
	 			var tbnoName = ListVo2tbNoMap[tbname] ;
	 			//var botext = "data."+tbnoName ;
	 			var sotext = "customeEditStatus."+tbname;
	 			str ='<span class ="marginRL15">' + 
						'<label class ="text-info">复用表号: </label>' +
						'<span style="position:relative;">'+
							'<input type="text"  name="'+reuseTablePropName+'" ng-disable ="data.statusDes==\'3\'" class="autocomplete reusetbnoinput" placeholder=""  >'+
							'<i class="icon iconfont icon-sousuo searchinput"></i>'+
						'</span>'+
						'<span class ="text-danger pointer marginRL15" name="customeEdit" ng-show ="'+sotext+'">自定义表格</span>'+
					 '</span>' ;
				return str ;
	 		},
	 		link: function (scope, elem, attrs) {
	 			scope.data = FormData ;
	 			var tbname = attrs['tbname'] ;
	 			var tbnoName = ListVo2tbNoMap[tbname] ;
	 			//是否显示自定义表格
	 			scope.customeEditStatus = CustomeEditTbStatusServcie;
	 			elem.find("i").bind('click',function(event){
	 				event.stopPropagation() ;
	 				event.preventDefault() ;
	 				elem.find('input').focus() ;
	 			}) ;
	 			//点击自定义表格按钮
	 			elem.find('span[name="customeEdit"]').bind('click',function  (event) {
	 				//scope.showCustomeEditFlag = false;
	 				scope.customeEditStatus[tbname] = false;
	 				//1.清除复用的表号
	 				var reuseTablePropName = "reuse"+convertFirstCharUpper(tbname) ;
	 				FormData[reuseTablePropName] = '' ;
	 				//2.清除复用的list数据
	 				//var list = FormData[tbname] ;
	 				//获取当前页面控件是否是非编辑状态
	 				var editFlag = commonUtil.getEditFlagByStatus(FormData.statusDes) ;
	 				elem.find(':input').val('')
					scope.$apply(function  () {
	 					FormEditStatusServcie[tbname] = editFlag;
				    	FormData[tbname] = [] ;
					}) ;
					//清空placeholder提示
					elem.find(':input').removeAttr('placeholder'); 
					//只要被点击自定义就需要把这里置为-1，表示当前是自定义字表数据
					FormData[tbnoName] = '-1' ;
					/*//根据本引用次数判断是否清除源字表号(1.如果被引用一次则源表号任可重复利用，2.如果被多次引用则将源标号置为空)
					var referenceCount = FormData.subTbReferenceCountMap[tbname] ;
					if(referenceCount>1){
						//console.info('【'+referenceCount+'】被引用次数大于一，需要把源子表号置为空...') ;
						FormData[tbnoName] = '' ;
					}*/
					
	 			}) ;
				elem.find(".autocomplete").autocomplete({
					minChars:0,
					serviceUrl: scope.data.contextPath+'/queryTableNoByTableName',
					/*noCache:true,*/
				    onSelect: function (suggestion) {
				    	//判断当前是否有数据，并且当前数据是否可编辑,如果这样的话要给出提示信息
				    	var list = FormData[tbname] ;
				    	var editFlag = commonUtil.getEditFlagByStatus(FormData.statusDes) ;
				    	var reuseTablePropName = "reuse"+convertFirstCharUpper(tbname) ;
				    	var reuseTableNo = FormData[reuseTablePropName] ;
				    	//判断当前表格是否可编辑
				    	var tbEditAbleFlag = FormEditStatusServcie[tbname] ;
				    	//当前表格如果可编辑那么
				    	if(list.length>0&&editFlag&&reuseTableNo==''&&tbEditAbleFlag){
				    		$.showTuiConfirmDialog2('确定放弃已编辑的内容？', function() {
				    			var selectedTableNo = suggestion.data ;
						    	var reuseTablePropName = "reuse"+convertFirstCharUpper(tbname) ;
						    	FormData[reuseTablePropName] = selectedTableNo ;
						    	_fillData4AutoComplete(suggestion,tbname ,FormData,FormEditStatusServcie,HttpOperService,scope.customeEditStatus,tbnoName) ;
						    	//将表格置为显示状态
						    	TbShowHideServcie[tbname] = true ;
	 						},function(){
	 							FormData[reuseTablePropName] = '' ;
			    				elem.find(':input').val('') ;
	 						}) ;
				    	}else{
					    	var selectedTableNo = suggestion.data ;
					    	var reuseTablePropName = "reuse"+convertFirstCharUpper(tbname) ;
					    	FormData[reuseTablePropName] = selectedTableNo ;
					    	_fillData4AutoComplete(suggestion,tbname ,FormData,FormEditStatusServcie,HttpOperService,scope.customeEditStatus,tbnoName) ;
					    	//将表格置为显示状态
					    	TbShowHideServcie[tbname] = true ;
				    	}
				    },
				    paramName:'q' ,
				    params:{"tbname":tbname},
				    transformResult: function(response) {
				    	var jsonData = JSON.parse(response) ;
				    	var flag = jsonData.flag ;
				    	//console.info('flag : ' + flag) ;
				    	if(flag=='true'){
							return {
					            suggestions: $.map(jsonData.list, function(dataItem) {
					                return { value: dataItem+"", data: dataItem };
					            })
					        };
				    	}else{
				    		//console.info('获取表格出错...') ;
				    		return {
				    			suggestions:[]
				    		}
				    	}
				    }
				});
	 		}
	 	};
	}]) ;


	 //刚添加的一行表格td需要触发focus函数,否则如果直接点击页头部分的保存按钮将无法进行tui的require等校验//不知道为什么
	 directives.directive('setFocus', function(){
		  return {
	        restrict: 'AE',
	        replace: true,
			scope:true,
			link: function(scope, elem, attrs) {
	           elem.trigger('click') ;
	        }
	      };
      });

	 //区域长度限制
	 directives.directive('geoMaxLength',function(){
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope:true,
	        controller:['$scope', '$element', '$attrs',function($scope, $element, $attrs){
				$scope.getGeoLengthByType = function(type){
					type = type || "" ;
				  	var obj = {'A':'1','C':'3','N':'2','P':'3','S':'2','Z':'3'} ;
				    var len = eval("obj['"+type+"']") || 0;
					return len ;
				}
			}],
	        link: function(scope, element, attrs){
	            scope.$watch(attrs['geoMaxLength'], myWatchCallbackFunc);
	            function myWatchCallbackFunc (){
	                var geoMaxLength = attrs['geoMaxLength'] ;
	                var value  = scope.$eval(geoMaxLength) ;
					var len = scope.getGeoLengthByType(value) ;
					element.attr('maxlength',len) ;//设置长度
	            }
	        }
	    }
	  }) ;
	  
	  function _convertStr2Json (jsonStr){
	  	var str = jsonStr || '' ;
	  	str += '' ;
	  	var retJson = {} ;
	  	try{
	  		var retStr = str.replace(/'/g,'"') ;
	  		retJson = JSON.parse(retStr) ;
	  	}catch(e){
	  		console.info(e) ;
	  	}
	  	return retJson ;
	  }
	  

	 //tui长度限制属性
	 directives.directive('tuiMaxLength',function(){
	 	function _splitMaxLengtAttr (str){
		  	str = str || '' ;
		  	str += '' ;
		  	var arr = [] ;
		  	var str1 = "" ;
		  	var str2 = "" ;
		  	try{
			  	var start1 = str.indexOf('{');
		        var end1 = str.indexOf('}');
		        str1 = str.substr(start1,end1+1)  ;
		        var start2 = str.indexOf('[') ;
		        var end2 = str.indexOf(']') ;
		        str2 = str.substring(start2+1,end2) ;
		  	}catch(e){
		  		console.info(e) ;
		  	}
		  	if(str1.length>0&&str2.length>0){
		  		arr[0] = str1 ;
		  		arr[1] = str2 ;
		  	}
	        return arr ;
		}
	    return {
	        restrict: 'AE',
	        replace: true,
	        scope: true,
	        link: function(scope, element, attrs){
	        	var attrStr = attrs['tuiMaxLength'] ;
	            var infoArr = _splitMaxLengtAttr(attrStr) ;
	            var str1 = "" ;
	            var str2 = "" ;
	            var jsonObj = {} ;
	            //填写的字符串是否格式完好
	            var goodStrFlag = false;
	            if(infoArr.length==2){
	             	goodStrFlag = true ;
	             	str1 = infoArr[0] ;
	             	str2 = infoArr[1] ;
	             	jsonObj =  _convertStr2Json(str1) ; 
	            }
	            if(goodStrFlag){
		            scope.$watch(attrs['tuiMaxLength'], function(){
			        	var value2  = scope.$eval(str2) ;
			        	var valueAtrr = jsonObj[value2] ;
						element.attr('maxlength',valueAtrr) ;
		            });
	            }
	        }
	    }
	  }) ;

	directives.directive("upperInput",function(){
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
	 //178表格显示隐藏的链接指令
	 directives.directive('linkTable', ['TbShowHideServcie','FormEditStatusServcie',function(TbShowHideServcie,FormEditStatusServcie){
          return {
	        restrict: 'AE',
	        replace: true,
			scope:{
				list:'=',
				tbname:'@'
			},
			controller:['$scope',function($scope){
				$scope.showStatus = TbShowHideServcie;
				$scope.editStatus = FormEditStatusServcie ;
				//点击显示隐藏表格事件处理
				$scope.myClick = function(){
					var tbname = $scope.tbname;
					$scope.showStatus[tbname] = !$scope.showStatus[tbname] ;
					if(!$scope.showStatus[tbname]){////点击取消自定义区域
						var len = $scope.list.length ;
						if($scope.editStatus[tbname]){//如何表格可编辑则清空数据
							outAllSelect() ;
							$scope.list.splice(0,len) ;
						}
					}
				}
				function outAllSelect(){//将所有tr全部置为非选中状态
					angular.forEach($scope.list,function(l){
						l.selected = false ;
					}) ;
				}
			}],
	        template:function(elem,attrs){
	        	var tbname = attrs['tbname'] ;
	        	var tmp = "showStatus."+ tbname;
				var retstr = '<a href="javascript:void(0)"><span ng-show="!'+tmp+'">自定义区域</span><span ng-show="'+tmp+'">取消自定义</span></a>' ;
				return retstr ;
	        }, 
			link: function(scope, elem, attrs) {
	            elem.bind('click', function() {
					scope.$apply(function(){
						scope.myClick() ;
					}) ;
	            });
	        }
	      };
      }]) ;

	
		
	  //日期插件
	 directives.directive('datepicker',function(){
		return{
			restrict: 'A',
			scope: {},
			require:'ngModel',
			link: function (scope,elem,attr,ctrl) {
				if(!ctrl) return ;
				var minDateStr = attr['datepicker'] ;
				var minDate = new Date(minDateStr) ;
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
	                validator.element(elem) ;
	                if(scope.select){
	                    scope.$apply(function  () {
	                        scope.select({date:dateText}) ;
	                    }) ;
	                }
	            }
	            optionObj.minDate = minDate ;
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
		//时间插件
		directives.directive('timepicker',function(){
			return{
				restrict: 'A',
				scope: {},
				link: function (scope,elem,attr) {
					var timeVar = {
						controlType:'select',
						timeFormat: 'HHmm',
						timeOnly:  true,
						timeOnlyTitle: '选择时间',//Choose Time
						timeText: '时间',//Time
						hourText: '小时',//Hou
						minuteText: '分钟',//Minute
						currentText: '当前',//Current
						closeText: '关闭'//Close
					};
					$(elem).datetimepicker(timeVar);
				}
			};
		}) ;

		
		//重置数据
		var resetDataByFlag = function(nameList,flag,data,orgData){
		    if(!flag){//如果隐藏这需要重置数据
		        for(var i = 0 ; i < nameList.length ;i++){
		        	var curName = nameList[i] ;
		        	var oldValue = orgData[curName] ;
		        	var tmpValue = ""  ;
		        	if(_.isArray(oldValue)){//如果是数组则
		        		tmpValue = [] ;
		        	}else if(_.isObject(oldValue)){
		        		tmpValue =angular.copy(oldValue)  ;
		        	}
		        	data[curName] = tmpValue ;
		        }
		    }
		};

		var getFlagByServiceTypeAndServiceGroup = function (typeList, groupList,serviceType,serviceGroup) {
		    var flag = _.contains(typeList,serviceType) ;
		    if(flag&&groupList&&groupList.length>0){
		    	flag = _.contains(groupList, serviceGroup) ;
		    }
		    return flag ;
		};

		directives.directive('force',['FormStatusService','FormData',function(FormStatusService,FormData){
			return  {
				restrict:'A',
				scope:{orgData:'='},
				link: function (scope,elem,attrs) {//
					//@param : event 事件本身
					//@param ：needDigest ： 是否需要手动进行脏数据检查
					scope.$on('serviceTypeChangeNotice',function(event,needDigest){
						for(var fname in FormStatusService){
							var typeList = FormStatusService[fname]['typeList'] ;
							var groupList = FormStatusService[fname]['groupList'] ;
							var serviceType = FormData.serviceType;
							var serviceGroup = FormData.sel1.value ;
							var oldFlag = FormStatusService[fname]['showFlag'] ;
							var flag = getFlagByServiceTypeAndServiceGroup(typeList, groupList,serviceType,serviceGroup) ;
							//console.info('serviceTypeChangeNotice --->  fname : [' + fname + ']-- flag : [' + flag + ']   , serviceType : ['+serviceType+'] , typeList ['+typeList+'] , groupList :['+groupList+']  , servcieGroup : ['+serviceGroup+'] ') ;
							if(oldFlag==!flag){//如果不同
								var nameList = FormStatusService[fname]['nameList'] ;
								resetDataByFlag(nameList,flag,FormData,scope.orgData) ;
								FormStatusService[fname]['showFlag']= flag;
								if(needDigest&&needDigest=='true'){
									scope.$digest() ;
								}
							}
						}
					}) ;
					// @param :event :自带的事件本身
					// @param :in_fname : 传入的forceName
					// @param :in_flag :传入的隐藏显示的falg----第一要传递字符串
					// @param :needDigest ：是否需要手动脏数据检查  第一要传递字符串
					scope.$on('singleChangeByFlagNotice', function (event,in_fname,in_flag,needDigest) {
						var fname = in_fname ;
						var newFlag = in_flag=='true'?true:false;
						var oldFlag = FormStatusService[fname]['showFlag'] ;
						//console.info("singleChangeByFlagNotice -------> fname : ["+fname+"] , newFlag : ["+newFlag+"] , oldFlag : ["+oldFlag+"] ") ;
						if(newFlag==!oldFlag){//当前显隐与将要的显隐相反时
							var nameList = FormStatusService[fname]['nameList'] ;
							resetDataByFlag(nameList,newFlag,FormData,scope.orgData) ;
							FormStatusService[fname]['showFlag']= newFlag;
							if(needDigest&&needDigest=='true'){
								scope.$digest() ;
							}
						}else{
							//console.info('当前显隐与将要发生的显隐相同，不需要切换') ;
						}
					}) ;
				}
			} ;
		}]) ;

 }) ;
