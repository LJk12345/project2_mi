var oId=location.search.slice(location.search.indexOf("oId")+4);
var price=0;

// var endTime=new Date(parseInt(sessionStorage.getItem("endTime")));
// var now=new Date();
// var hour=endTime.getHours()-now.getHours();
// var minute=endTime.getMinutes()-now.getMinutes();
// var seconds=endTime.getSeconds()-now.getSeconds()+60;

// var flag=true;

// if(sessionStorage.getItem("endTime") - now.getTime()>0){
//         $('.hour').html(hour);
//         $('.minute').html(minute);
//         $('.seconds').html(seconds);
// }


// console.log(endTime);
// var countdown=setInterval(function(){  
//    if((sessionStorage.getItem("endTime") - now.getTime())<=0){
//      clearInterval(countdown)
//      $.myAjax({
//         url: `/order/remove/${oId}`,
//         success: function () {
//             if(flag){
//                 layer.open({
//                     content: '订单超时请重新购买',
//                     btn: '我知道了',
//                     shadeClose: false,
//                     yes: function(){
//                         sessionStorage.removeItem("endTime")
//                         location.replace('/order/index.html')
//                     }
//                   });
//             }
//             $('.order_list_box').eq(index).remove();
//             $('.order_list_content li').length == 0 ? $('.empty_list').addClass("show") : $('.empty_list').removeClass("show");
//         }
//     })
//    }else{ 
//         now=new Date()
//         hour=endTime.getHours()-now.getHours();
//         minute=endTime.getMinutes()-now.getMinutes();
//         seconds=endTime.getSeconds()-now.getSeconds()+60;
//        $('.hour').html(hour);
//        $('.minute').html(minute);
//        $('.seconds').html(seconds);
//    }
// },1000)



// 倒计时
var payTime = 1800;
$(".minute").html(parseInt(payTime / 60));
function timeFormat(n) {
    return n < 10 ? "0" + n : n;
}
var timer = setInterval(function () {
    countDown();
    if (payTime <= 0) {
        clearInterval(timer)
    }
}, 1000);

function countDown() {
    payTime = payTime - 1;
    var minute = timeFormat(parseInt(payTime / 60));
    var seconds = timeFormat(parseInt(payTime % 60));
    $(".minute").html(minute);
    $(".seconds").html(seconds);
}

// 页面后退
$('.icon-back').on("click",function(){
    layer.open({
        content:`<p>订单有效时间剩余<span><i class="hour"></i>时<i class="minute"></i>分<i class="seconds"></i>秒</span>，超时后您的订单将自动取消</p>`
        ,btn: ['确认离开','继续支付']
        ,yes: function(index){
          location.replace('/order/index.html');
        }
      });
    
})


// 订单金额渲染
$.myAjax({
    url:`/order/account/${oId}`,
    success: function(data){
        price=data;
        var decimal=data.toString().indexOf(".")
        if(decimal!=-1){
            $('.page-content_top b').html(data.toString().substr(0,decimal));
            $('.page-content_top b').next().html(data.toString().substr(decimal));
        }else{
            $('.page-content_top b').html(data);  
            $('.page-content_top b').next().html(".00"); 
        }
        $('button span').html(data.toFixed(2));
        for(var i=0;i<  $('.stages_number li').length;i++){
            var  number_of_periods=parseInt($(".number_of_periods").eq(i).html());
            var  interest_rate=parseFloat( ($(".interest_rate").eq(i).html().replace('%',"")/100).toFixed(4) );
            var total_repayment=(price*(1+interest_rate)).toFixed(2)
            $('.stages_number li').eq(i).attr("total_repayment",total_repayment);
            $('.repayment').eq(i).html((total_repayment/number_of_periods).toFixed(2));
            $('.service_charge').eq(i).html(((price*interest_rate)/number_of_periods).toFixed(2));
        }
    }
})   


// 支付方式选择
$("label").on("click",function(){
    $("label").removeClass("select");
    $(this).addClass("select")
    if($(this).index("label")==2){
    $('.total_repayment').html("¥"+$('.stages_number li').eq(0).attr("total_repayment"));
       $('.by_stages').slideDown(500,function(){});
       $('button span').html($('.stages_number li').eq(0).attr("total_repayment")/3);
    }else{
        $('.by_stages').slideUp(500,function(){}) 
    }
})

//分期支付选择
$('.stages_number li').on('click',function(){
    $(this).siblings().removeClass("stages_select");
    $(this).addClass("stages_select");
    $('.total_repayment').html("¥"+$(this).attr("total_repayment"))
    $('button span').html($(this).find('.repayment').html());
})

// 支付操作
$('.page-footer button').on("click",function(){
    $.myAjax({
        url:`/order/pay/${oId}`,
        success: function(data){
            flag=false;
            sessionStorage.removeItem("endTime")
            layer.open({
                content: '支付成功'
                ,skin: 'msg'
                ,time: 2 //2秒后自动关闭
              });
              setTimeout(function () {
                location.replace('/order/index.html');
            },2000);
        }
    })   
  
})