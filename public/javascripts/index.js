/**
 * Created by Administrator on 2016/3/4.
 */
function test(){
    console.info('you click test btn....') ;
    $.ajax({
        async: true,
        cache: true,
        type: "POST",
        dataType: "xml",
        url: "/test",
        data: { key: "value" },
        error: function(xml) { alert('Error loading XML document' + xml); },
        timeout: 1000,
        success: function(xml) {
            console.info('-----------后台返回来的xml数据---------------') ;
            console.info(xml) ;
            console.info('------------------------------------------') ;
        }
    })
}

function toValidatePage(){
    window.location.href = "/html/validate.html" ;
}

function toMessages(){
    window.location.href = "/html/ng_messages.html" ;
}

