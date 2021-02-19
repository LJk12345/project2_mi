var obj = [];
var url = "/order/list_unpay";
$('.icon-back').on("click", function () {
    history.back();
})

function establish_myAjax() {

    // new Promise(function(resolve){
    //     console.log("指行5秒");
    //     setTimeout(function(){
    //         resolve();
    //     },5000)
    // }).then( function(){ console.log("da"); },
    //         function() { console.log("da"); }
    // );

    //
    $.myAjax({
        url: url,
        success: function (data) {
            obj = data;
            obj.length != 0 ? $('.empty_list').removeClass("show") : $('.empty_list').addClass("show");
            $('.order_list_content').empty()
            data.forEach(function (item, index) {
                var allPrice = 0;
                var count = 0;
                $(`
                <li class="order_list_box">
                    <div class="order_list_top">
                        <div class="top_left">
                            <img src="img/shopImg_01.png">
                            <span  class="list_title">小米自营</span>
                        </div>
                        <div class="top_right"></div>
                    </div>
                    <div class="order_list_footer">
                        <span data-orderid="${item.orderId}" class="delBtn">删除订单</span>
                        <span class="timer">29分钟后订单将关闭</span>
                        <button data-oId="${item.orderId}" data-pay="${item.pay}" >去支付</button>
                    </div>
                </li>
                `).appendTo($('.order_list_content'))
                item.details.forEach(function (arr) {
                    allPrice = allPrice + (arr.count * arr.price);
                    count = count + arr.count;
                    $(`
                <div class="order_product">
                    <div class="product_box">
                        <a>
                            <img src="img/product_01.png" />
                            <div class="product_box_right">
                                <p class="name">${arr.name}</p>
                                <div class="unitPrice_num">
                                    <p class="unitPrice" >¥<span>${(arr.price).toFixed(2)}</span></p>
                                    <p class="unitNum">x<span>${arr.count}</span></p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
               `).insertBefore($('.order_list_footer').eq(index))
                })
                var a = allPrice.toFixed(2) + "";
                var b = a.split(".");
                $(`  <p class="subtotal">共计<span class="count">${count}</span>件商品，总金额 ¥ <span  class="price">${b[0]}</span><i>.${b[1]}</i></p>`).insertBefore($('.order_list_footer').eq(index));
                if (item.pay) {
                    $('.timer').eq(index).removeClass('show')
                    $('.delBtn').eq(index).addClass('show')
                    $('.top_right').eq(index).html("已付款").css('color', 'rgb(153, 153, 153)')
                    $('.order_list_footer button').eq(index).html("再次购买")
                    $('.order_list_footer button').attr("flag", false)
                } else {
                    $('.timer').eq(index).addClass('show')
                    $('.top_right').eq(index).html("待付款").css('color', '#bf1111');
                    $('.order_list_footer button').eq(index).html("去支付");
                    $('.order_list_footer button').attr("flag", true);
                }
            });

            // 绑定删除事件
            $('.order_list_content').off("click").on('click', ".delBtn", function () {
                var index = $(this).index(".delBtn");
                var orderId = $(this).data().orderid;
                $.myAjax({
                    url: `/order/remove/${orderId}`,
                    success: function () {
                        layer.open({
                            content: '删除成功',
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        $('.order_list_box').eq(index).remove();
                        $('.order_list_content li').length == 0 ? $('.empty_list').addClass("show") : $('.empty_list').removeClass("show");
                    }
                })
            })
         
            // 帮定再次购买事件
            $('.order_list_content  .order_list_footer').off("click").on('click', "button", function () {
                var index=$(this).index("button")
                if ($(this).data().pay) {
                    for (var i = 0; i < data[index].details.length; i++) {
                        $.myAjax({
                            url: "http://localhost:3000/cart/add",
                            type: "post",
                            data: {
                                pid: data[index].details[i].id,
                                count: data[index].details[i].count,
                            }
                        })
                    }
                    location.assign('/cart/cart.html');
                } else {
                      location.assign('/order/order_pay.html?oId=' + $(this).data().oid)
                }
            })
        }
    })
}
establish_myAjax()
$(".page-header_lable").on("click", "li", function () {
    var index1 = $(this).index();
    switch (index1) {
        case 0:
            url = '/order/list_all';
            $(this).find('span').hasClass('select') ? "" : establish_myAjax();
            break;
        case 1:
            url = '/order/list_unpay';
            $(this).find('span').hasClass('select') ? "" : establish_myAjax();
            break;
        case 2:
            url = '/order/list_pay';
            $(this).find('span').hasClass('select') ? "" : establish_myAjax();
            break;
        case 3:
            obj = [];
            $('.empty_list').removeClass("show")
            break;
        case 4:
            obj = [];
            $('.empty_list').removeClass("show")
            break;
        default:
            break;
    }
    index1 == 0 ? $('.empty_list p span').html("任何") : $('.empty_list p span').html($(this).find('span').html());

    $(".page-header_lable li span").removeClass("select");
    $(this).find('span').addClass("select");
})