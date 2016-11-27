var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/test', function (req, res, next) {
  console.info('--------前端post过来的数据---------') ;
  console.log(req.body);
  var data = '<?xml version="1.0" encoding="UTF-8"?>' +
      '<recipe type="dessert">' +
        '<recipename cuisine="american" servings="1">Ice Cream Sundae</recipename>' +
        '<preptime>5 minutes</preptime>' +
      '</recipe>' ;
  res.writeHead(200, {'Content-Type': 'application/xml'});
  res.end(data);
  //console.info('hello world...........') ;
}) ;


router.get('/validate/initPageData', function (req, res, next) {
    var jsObj = {flag:"true"} ;
    //常旅客等级
    var frequentFlyerStatusList = [{name:'白金卡',value:'1'},{name:'金卡',value:'2'},
        {name:'银卡',value:'3'},{name:'普卡',value:'4'},{name:'非会员',value:'5'}] ;
    //旅客类型
    var passengerTypeCodeList = [{name:'成人',value:'1'},{name:'学生',value:'2'},
        {name:'无人陪伴儿童',value:'3'},{name:'有人陪伴儿童',value:'4'},{name:'婴儿',value:'5'}] ;

    jsObj.frequentFlyerStatusList = frequentFlyerStatusList;
    jsObj.passengerTypeCodeList = passengerTypeCodeList;
    res.contentType('json');//返回的数据类型
    res.send(JSON.stringify(jsObj));//给客户端返回一个json格式的数据
    res.end();
}) ;

//提交验证结果
router.post('/validate/submitPage', function(req, res, next) {
    var params = req.body ;
    var type = params.requestType ;
    var xmlData = '<?xml version="1.0" encoding="UTF-8"?>' +
        '<recipe type="dessert">' +
        '<recipename cuisine="american" servings="1">Ice Cream Sundae  yicj</recipename>' +
        '<preptime>5 minutes.............</preptime>' +
        '</recipe>' ;
    var jsObj = {
        flag:true,
        requestXML:xmlData,
        singleDataFlag:false,
        multiDataFlag:false,
        singleData:{charge:"240",chargeUnit:"CNY",sequence:'100010'},
        multiData:{list:[
            {charge:"120",chargeUnit:"CNY",sequence:'100010',subCode:'0DF'}
            ,{charge:"120",chargeUnit:"CNY",sequence:'100010',subCode:'0DF'}
            ,{charge:"300",chargeUnit:"CNY",sequence:'100016',subCode:'0GO'}
            ,{charge:"400",chargeUnit:"CNY",sequence:'100016',subCode:'0GO'}
        ],
            all:{charge:"940",chargeUnit:'CNY'}
        }} ;
    if(type=='TSKOC'){//单条记录
        jsObj.singleDataFlag = true;
    }else if(type=='C'){//返回多条记录
        jsObj.multiDataFlag = true;
    }else if(type=='P'){
        jsObj.flag = false;
    }
    console.info('type : ' + type) ;
    res.contentType('json');//返回的数据类型
    res.send(JSON.stringify(jsObj));//给客户端返回一个json格式的数据
    res.end();
});


router.get('/select2/remoteData1', function(req, res, next) {
    var params = req.params ;
    console.info('request remoteData1...... : ' + JSON.stringify(params) ) ;
    var data = [{ id: 0, text: 'enhancement' },
                { id: 1, text: 'bug' },
                { id: 2, text: 'duplicate' },
                { id: 3, text: 'invalid' },
                { id: 4, text: 'wontfix' }];
    var jsObj = {flag:'true',items:data} ;
    res.contentType('json');//返回的数据类型
    res.send(JSON.stringify(jsObj));//给客户端返回一个json格式的数据
    res.end();
});




module.exports = router;
