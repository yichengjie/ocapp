define(function(require, exports, module){ 
	 var directives = require("./directives") ;
	 var tableHtml = require("../tpls/table.html") ;
	 var trHtml = require("../tpls/tr.html") ;
	 var theadHtml = require("../tpls/thead.html") ;
	 var _ = require('underscore') ;
	 //重置数据
	 function reseat198VO (l198){
		if(l198){
			l198.cxr = "" ;
			l198.rbd1 = "" ;
			l198.rbd2 = "" ;
			l198.rbd3 = "" ;
			l198.rbd4 = "" ;
			l198.rbd5 = "" ;
		}
	 }
	 function outAllSelect(list){//将所有tr全部置为非选中状态
		angular.forEach(list,function(l){
			l.selected = false ;
		}) ;
	 }

	 directives.directive('tableInfo', ['FormEditStatusServcie','FormData',function(FormEditStatusServcie,FormData){
		  return {
	        restrict: 'AE',
	        replace: true,
			template:function(elem,atrrs){
				var tableWidth = atrrs['tableWidth'] ;
				var tableTemplate = _.template(tableHtml);
				var tableStr = tableTemplate({"tableWidth": tableWidth}) ;
				return tableStr ;
			},
			scope:{
				tableData:'=',
				list:'='
			},
			controller:['$scope',function($scope){
				$scope.data = FormData ;
				$scope.editStatus = FormEditStatusServcie ;
				//新增一行记录
				this.tbAddLine = function(){
					outAllSelect($scope.list) ;
					var obj = angular.copy($scope.tableData.addObj) ;
					$scope.list.push(obj) ;
				}
				//删除一行记录
				this.tbDelLine = function (){
					var len = $scope.list.length ;
					if(len>=1){
						var num = len-1 ;
						angular.forEach($scope.list,function(l,index){
							if(l.selected){
								num = index ;
							}
						}) ;
						outAllSelect($scope.list) ;
						$scope.list.splice(num,1) ;
					}
				}
				
				$scope.clickTr = function(l){
					outAllSelect($scope.list) ;
					l.selected = true ;
				}
				//下面是特殊的部分，select可能会存在//如果你的表格比较特殊的话可能需要修改修改下面的部分代码
				/**这一部分算是半工作能够部分(因为有的表格会使用这部分数据，但是有的表格不使用这部分数据)**/
				$scope.geoSpecTypeList = [
					{"name":"选择","value":""},
					{"name":"大区","value":"A"},{"name":"城市","value":"C"},
					{"name":"国家","value":"N"},{"name":"机场","value":"P"},
					{"name":"州","value":"S"},{"name":"区域","value":"Z"}
				] ;
				$scope.codeTypeList = [
					{"name":"选择","value":""},{"name":"代理人office号","value":"T"},
					{"name":"IATA号","value":"I"},{"name":"Department/Identifier","value":"X"},
					{"name":"CRS/CXR Department Code","value":"V"},{"name":"ERSP No","value":"E"},
					{"name":"LNIATA Number (CRT Address)","value":"L"},{"name":"Airline specific codes","value":"A"}
				] ;
				//市场方/承运方
				$scope.marketingOpreratingList = [
					{"name":"选择","value":""},
					{"name":"市场方","value":"M"},{"name":"承运方","value":"O"},
					{"name":"市场方/承运方","value":"E"}
				] ;
				/*********183特殊部分开始*******************/
				$scope.selectChange183Tb1 = function(l183){
					l183.geographicSpecification = "" ;
				}
				$scope.selectChange183Tb2 = function(l183){
					l183.code = "" ;
				}
				$scope.viewBookTktList = [// 权限list
					{"name":"选择","value":""},{"name":"查看/订票/出票","value":1},
					{"name":"仅查看","value":2}
				] ;
				/*********183特殊部分结束*******************/
				
				/*********198特殊部分开始*******************/
				$scope.selectChange198Tb = function(l198){
					reseat198VO(l198) ;
				}

				$scope.selectChange198TbUpGrade = function(l198UpGrade){
					reseat198VO(l198UpGrade) ;
				}
				/*********198特殊部分结束*******************/
				/*********170特殊部分开始*******************/
				$scope.selectChange170Tb = function(l170){
					reseat170VO(l170) ;
				}
				function reseat170VO (l170){
					if(l170){
						l170.saleGeographicPoint = "" ;
					}
				}
			    /*********170特殊部分结束*******************/
				//178表格的区域select框发生变化时触发的函数
				$scope.selectChange178Tb = function(l178){
					l178.geoLocSpec = "" ;
				}
			}],
			controllerAs:'ctrl',
			compile: function (tElement, tAttrs, transclude){
				var urlStr = tAttrs['htmlUrl'] ;
				var headerTeplate = _.template(theadHtml) ; 
				var bodyTemplate = _.template(trHtml);
				var headStr = headerTeplate({value: urlStr}) ;
				var bodyStr = bodyTemplate({value: urlStr});
				var tableElement =  angular.element(tElement) ;
				tableElement.find('thead').append(headStr) ;
				tableElement.find('tbody').append(bodyStr) ;
				return {
					post: function(scope, element, attrs,ctrl){
						var tbname = attrs['tbname'] ;
						element.find("div.delete_line").bind('click',function(){
							if (scope.editStatus[tbname]) {//当当前表格可以编辑时
								scope.$apply(function  () {
									ctrl.tbDelLine() ;
								}) ;
							}else{
								//console.info('表格['+tbname+']当前的状态为：不可编辑') ;
							}
						}) ;
						element.find("div.add_line").bind('click',function(){
							if (scope.editStatus[tbname]) {//当当前表格可以编辑时
								scope.$apply(function  () {
									ctrl.tbAddLine() ;
								}) ;
							}else{
								//console.info('表格['+tbname+']当前的状态为：不可编辑') ;
							}
						}) ;
					}
				};
			}
	      };
      }]);
	  
}) ;