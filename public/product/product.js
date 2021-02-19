var arr = location.search.slice(1).split("&").join("=").split("=");
var id = arr[1];
var cid = arr[3];

var index = 1;
var page = 2;
var bannerTimer = "";

var num = 1;
var allNum=0;


console.log($('.page-container').height)
$('.icon-back').on('click', function () {
    history.back(); 
})

// 查询购物车商品总数量
$.myAjax({
    url:'http://localhost:3000/cart/total',
    success:function(data){
          if(data!=0){
            allNum=data;
            $('.icon-shoppingCard').prev().addClass("num_bubble");
            $('.icon-shoppingCard').prev().html(data)
          }else{
            $('.icon-shoppingCard').prev().removeClass("num_bubble");
          }
    }
})

// 公共函数，自动播放
function autoPlay() {
    bannerTimer = setInterval(function () {
        $('.swiper-wrapper').animate({
            "left" : `${-1*index}00%`
        }, 1000, function () {
            if (++index === $('.swiper-slide').length - 1) {
                /*重置到初始位置*/
                $(this).css({
                    "left": '0%'
                });
                page = 1;
                index = 1;
            }
            page < $('.swiper-slide').length ? $('.swiper-page span').eq(0).html(page++) : $('.swiper-page span').eq(0).html(page)
        })
    }, 3000)
}




//获取商品详细信息
$.myAjax({
    url: `http://localhost:3000/product/model/${id}`,
    success: function (data) {
        $('.page-popUp_num .avatar').attr("src",data.avatar)
        $('.page-popUp_num .price_1 span').html(data.price)
        $(`
        <div class="message_price">
            <p>
                <span class="price-span_1">¥</span><span class="price-span_2">${data.price}</span>
            </p>
            <div class="collection">
                <i class="icon-collection"></i>
                <p>收藏</p>
            </div>
        </div>
        <p class="product-name">${data.name}</p>
        <p class="product-function">${data.brief}</p>
        <a href="#">12.12来啦！领券下单更优惠！ ></a>
        `).appendTo($('.product_message'))
        var product_introductions = data.otherImgs.split(",");
        for (var i = 0; i < product_introductions.length; i++) {
            $(`
               <img src="${product_introductions[i]}" />
            `).appendTo($(".product_introduction"))
        }

        var bannerImgs = data.bannerImgs.split(",");
        for (var i = 0; i < bannerImgs.length; i++) {
            $(`
             <div class="swiper-slide" style="background-image: url('${bannerImgs[i]}');"></div>
        `).appendTo($('.swiper-wrapper'))
        }
        $(`
            <div class="swiper-page">
                    <span>1</span>/<span>${bannerImgs.length}</span>
            </div>
        `).appendTo($('.swiper-container'))
        autoPlay();

        // 首尾拼接，为无缝滚动做准备
        $('.swiper-slide').last().clone().prependTo('.swiper-wrapper');
        $('.swiper-slide').eq(1).clone().appendTo('.swiper-wrapper');
        $('.swiper-container').on('mouseover', function () {
                clearInterval(bannerTimer);
            })
            .on('mouseout', function () {
                autoPlay();
            });
    }
})


$(window).on('scroll', function () {
    console.log($('.page-container').height())
    if ($(this).scrollTop() <= ($('.swiper-container').height() - $('.page-header').height())) {
        var opacity_value = $(this).scrollTop() / ($('.swiper-container').height() - $('.page-header').height());
        $('.page-header ul').css('opacity', opacity_value);
        $('.page-header').css('backgroundColor', 'rgba(239,239,240,' + opacity_value + ')');
        $('.icon-back').css('color', 'white')
        $('.icon-back').removeClass('i')
        $('.icon-more').css('color', 'white')
        $('.icon-more').removeClass('i')
    } else {
        $('.page-header ul').css('opacity', 1);
        $('.page-header').css('backgroundColor', 'rgba(239,239,240,1)');
        $('.icon-back').css('color', '#9F9F9F')
        $('.icon-back').addClass('i')
        $('.icon-more').css('color', '#9F9F9F')
        $('.icon-more').addClass('i')
    }
    if ($(this).scrollTop() < ($('.productDetails').offset().top - $('.productDetails_top').height())) {
        $('.productDetails_top').removeClass('productDetails_top_fixed');
        $('.page-header ul').find('a').eq(0).addClass('select').siblings('.select').removeClass('select')
    } else if ($(this).scrollTop() >= ($('.productDetails').offset().top - $('.productDetails_top').height()) && $(this).scrollTop() < $('.page-recommend').offset().top) {
        $('.productDetails_top').addClass('productDetails_top_fixed')
        $('.page-header ul').find('a').eq(1).addClass('select').siblings('.select').removeClass('select')
    } else {
        $('.productDetails_top').removeClass('productDetails_top_fixed')
        $('.page-header ul').find('a').eq(2).addClass('select').siblings('.select').removeClass('select')
    }
})

//获取推荐商品列表
$.myAjax({
    url: "http://localhost:3000/product/list",
    type: "post",
    data: {
        name: "",
        cid: cid,
        orderCol: "rate",
        orderDir: "asc",
        begin: 0,
        pageSize: 10,
    },
    success: function (data) {
        data.forEach(function (item) {
            $(`
        <li>
        <a  href="/product/product.html?id=${item.id}">
            <img class="avatar" src="${item.avatar}" />
            <div class="product">
                <p class="name">${item.name}</p>
                <p class="brief">${item.brief}</p>
                <p class="price">¥<span>${item.price}</span></p>
            </div>
        </a>
        </li>
        `).appendTo($('.page-recommend ul'))
        })
    }
})
$('.page-header a').on('click', function () {
    if ($(this).index() == 0) {
        $(window).scrollTop(0)
    } else if ($(this).index() == 1) {
        $(window).scrollTop(($('.productDetails').offset().top - $('.productDetails_top').height()))
    } else {
        $(window).scrollTop($('.page-recommend').offset().top)
    }
})



$('.icon-more').on('click', function () {
    $('.box').toggleClass("mot");
    $('.page-href').toggleClass("show")
})

$('.box').on('click', function () {
    $('.box').toggleClass("mot");
    $('.page-href').toggleClass("show")
})

var collection = false;
$(".product_message").on("click", ".collection", function () {
    collection = !collection
    if (collection) {
        layer.open({
            content: '加入收藏成功',
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        $(".collection i").addClass("icon-collection1").removeClass("icon-collection");
        $(".collection p").html("已收藏");
    } else {
        layer.open({
            content: '移除收藏成功',
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        $(".collection i").addClass("icon-collection").removeClass("icon-collection1")
        $(".collection p").html("收藏")
    }
})

function setNum(num) {
    $('.nun_1 span').html(num);
    $('.num_2').html(num + "件");
    $('.reduce').next().html(num)
}
setNum(num);



$('.reduce').on("click", function () {
    if (num > 1) {
        $(this).removeClass("no_reduce");
        num--;
        if (num == 1) {
            $(this).addClass("no_reduce");
        };
        setNum(num);
    } else {
        layer.open({
            content: '商品数量已达最小值',
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
    };
});

$(".add").on("click", function () {
    num++;
    setNum(num);
    if (num > 1) $(".reduce").removeClass("no_reduce");

});


$(".page-popUp , .close").on("click", function () {
    $('.page-popUp,.page-popUp_num,.page-popUp_address').removeClass("show");
});


$(".num_select").on('click', function () {
    $('.page-popUp,.page-popUp_num').toggleClass("show");
    $('.addType1,.pay1').removeClass("empty");
    $('.determine').removeClass("show");

});


if (sessionStorage.getItem("token")) {
    $.myAjax({
        url: '/address/list',
        success: function (data) {
            console.log(data)
            if (data.length > 0) {
                $(".address_list").addClass('fd');
                $(".addressList_empty").removeClass('show');
                data.forEach(function (item, index) {
                    $(`
                    <li data-id="${item.id}">
                        <input name="addressList" type="radio">
                        <div >
                             <div class="receiveName"> <h4>${item.receiveName}</h4></div>
                             <p>${item.receiveRegion}${item.receiveDetail}</p>
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
            $(".address_list").on('click', "li", function () {
                $('.regions-picker').val($(this).find("p").html());
                $('.page-popUp,.page-popUp_address').removeClass("show");
                $('input[type=radio]').removeAttr("checked");
                $(this).find('input').attr("checked", "checked");
            });
            $('.otherAddress').on("click", "input", function () {
                $(this).addClass("regions-picker");
            })
        }
    })
} else {
    $('.address_select input').addClass('regions-picker')
}


function addList(num){
    $.myAjax({
     url:"http://localhost:3000/cart/add",
     type:"post",
     data:{
         pid:id,
         count:num,
     },
     success:function(){
        layer.open({
            content: '添加成功',
            skin: 'msg',
            time: 2 //2秒后自动关闭
        });
        allNum+=num;
            $('.icon-shoppingCard').prev().html(allNum)
            $('.icon-shoppingCard').prev().addClass('num_bubble')
     }
})
}

function msg(){
    layer.open({
        content: "单个商品购买上限为5个",
        skin: 'msg',
        time: 2 //2秒后自动关闭
    });
}

$(".addType1").on("click",function(){
    $('.page-popUp,.page-popUp_num').toggleClass("show");
    addList(num)
})

$(".addType2").on("click",function(){
    $('.page-popUp,.page-popUp_num').toggleClass("show");
    $('.determine').addClass("show");
    $('.addType1,.pay1').addClass("empty");
})

$(".determine").on('click',function(){
    $('.page-popUp,.page-popUp_num').toggleClass("show");
    addList(num);
});




