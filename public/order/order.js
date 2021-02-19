var money = 0;
var discount= 100;
var discount_Sum=0;
var freight = 10;
var arr =sessionStorage.getItem("orderList").split(",") ;
var  addressId;
var  account=0;

var hour=0;
var minute=30;

$('.icon-back').on('click',function () {
    history.back();
})


$('.freight').html("+¥"+freight.toFixed(2))

console.log(sessionStorage.getItem("token"))
if(freight==0){
    $('.page-footer p span').eq(1).css('opacity',1)
}else{
    $('.page-footer p span').eq(1).css('opacity',0)
}

// 商品信息渲染
$.myAjax({
        url: 'http://localhost:3000/cart/list_ids',
        type:"post",
        data:{
            ids: arr   
        },
        success: function (data) {
            data.forEach(function (item) {
                $(`
                <div class="list_content">
                    <a href="/product/product.html?id=${item.pid}&cid=17"">
                        <img src="${item.avatar}" />
                        <div>
                            <p class="name"><span>有品秒杀</span>${item.name}</p>
                            <div class="unitPrice_num">
                                <span class="unitPrice" >¥${item.price}.<i>00</i></span>
                                <span class="unitNum">x${item.count}</span>
                            </div>
                            <p class="lable"><span>7天无理由退货</span></p>
                        </div>
                    </a>
                </div>
            `).insertBefore($('.invoice'))
            money+=item.price*item.count
            discount_Sum+=item.count*discount
        })
        account=(money-discount_Sum+freight).toFixed(2);
        $('.discount').html("-¥"+discount_Sum.toFixed(2))
        $('.money').html('¥'+ money);
        $('.price b').html(account);
    }
})

// 获取默认地址
$.myAjax({
    url: '/address/get_default',
    success: function (data) {
       $('.receiveNameshow').html(data.receiveName);
       $('.receivePhoneshow').html(data.receivePhone.substring(0,3)+"***"+data.receivePhone.substring(7,11));
       $('.receiveRegionshow').html(data.receiveRegion);
       $('.receiveDetailshow').html(data.receiveDetail);
       addressId=data.id;
    }
})

// 弹层控制
$(".page-popUp , .close").on("click", function () {
    $('.page-popUp,.page-popUp_address').removeClass("show");
});


$(".address").on('click', function () {
    $('.page-popUp,.page-popUp_address').addClass("show")
});


$('.page-container').on('scroll', function () {
    console.log($(this).scrollTop())
    if ($(this).scrollTop()<= ($('.page-content_top').height())) {
        var opacity_value = $(this).scrollTop() / $('.page-content_top').height();
        $('.page-header').css( 'opacity',opacity_value);
    }
})

// 获取所有地址
$.myAjax({
    url: '/address/list',
    success: function (data) {
        if (data.length > 0) {
            $(".address_list").addClass('fd');
            $(".addressList_empty").removeClass('show');
            data.forEach(function (item, index) {
                $(`
                <li data-id="${item.id}">
                    <input name="addressList" type="radio">
                    <div >
                         <div class="receiveName"> <h4>${item.receiveName}</h4> <b>${item.receivePhone.substring(0,3)+"***"+item.receivePhone.substring(7,11)}</b></div>
                         <p><i>${item.receiveRegion}</i><i>${item.receiveDetail}</i></p>
                    </div>
                </li>
                 `).appendTo($('.address_list'));
                if (item.isDefault) {
                    $(`<span>默认</span>`).appendTo($('.receiveName').eq(index));
                };
            });
        } else {
            $(".addressList_empty").addClass('show');
        }
        $(".address_select").on('click', function () {
            $('.page-popUp,.page-popUp_address').addClass("show")
        });

        // 地址选择
        $(".address_list").on('click', "li", function () {
            $('.receiveNameshow').html($(this).find("h4").html())
            $('.receivePhoneshow').html($(this).find("b").html())
            $('.receiveRegionshow').val($(this).find("p i").eq(0).html());
            $('.receiveDetailshow').html($(this).find("p i").eq(1).html());
            addressId=$(this).data().id;
            console.log($(this).data().id)
            $('.page-popUp,.page-popUp_address').removeClass("show");
            $('input[type=radio]').removeAttr("checked");
            $(this).find('input').attr("checked", "checked");
        });
        // 添加地址
        $('.otherAddress').on("click", "input", function () {
                 location.assign("/address/add.html")
        })
    }
})





// 优惠详情
$('.settlement li').eq(1).on("click",function(){
    layer.open({
        title: [
          '活动优惠',
          'font-size:15px;'
        ],
        className: 'popuo-box'
        ,content:`<p><span>有品秒杀</span><span>-¥${discount_Sum}</span><p>`
        ,btn: '我知道了'
      });
    
})



// 生成订单
$('.page-footer button').on('click',function(){
    $.myAjax({
        url: '/order/confirm',
        type:"post",
        data:{
            ids: arr,
            account:account,
            addressId:addressId
        },
        success: function (data) {
            // var timer=new Date();
            // var endTime=timer.getTime()+hour*3600000+minute*60000-timer.getSeconds()*1000;
            // sessionStorage.setItem('endTime',endTime);
            location.replace("/order/order_pay.html?oId="+data);
        }
    })
 }
);