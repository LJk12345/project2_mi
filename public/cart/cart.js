var money = 0;
var allNum = 0;
var showMoney = 0;
var showNum = 0;
var self_flag = true;
var all_flag = true;
var delFlag = false;
var arr = [];
var string ="";


function pay(){
    $('.page-footer button').on('click',function(){
        if(arr.length!=0){
        location.assign("/order/order.html");
        sessionStorage.setItem("orderList",arr)
    }
    })
}
pay();

$('.icon-back').on('click',function () {
    history.back();
})

$('.page-container').on('scroll', function () {
    console.log($(this).scrollTop())
    if ($(this).scrollTop()<= ($('.page-content_top').height())) {
        var opacity_value = $(this).scrollTop() / $('.page-content_top').height();
        $('.page-header').css( 'opacity',opacity_value);
    }
})

$.myAjax({
    url: 'http://localhost:3000/cart/list',
    type: 'post',
    success: function (data) {
      if(data.length!=0){
        $(".page-footer").css("display","flex")
        $('.empty_list').css("display","none");
        $('.page-content_list').css("display","flex");
        data.forEach(function (item) {
            $(`
                <div class="list_content">
                    <input  class="product_select" data-id="${item.id}" data-index="0" type="checkbox" />
                    <div class="list_content_right">
                        <a href="/product/product.html?id=${item.pid}&cid=17">
                            <img src="${item.avatar}" />
                            <div>
                                <p class="name">${item.name}</p>
                                <div class="unitPrice">
                                    <span data-price="${item.price}"><i>¥</i>${item.price}</span>
                                    <div data-id="${item.id}" class="list_num_operation">
                                        <p  class="reduce">-</p>
                                        <input  type="text" value="${item.count}" readonly/>
                                        <p  class="add">+</p>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
        `).appendTo($('.page-content_list li').eq(0))
            // index++;
        });
        $('input[type=checkbox]').prop('checked', true)
        money = data.reduce(function (total, obj) {
            return total + obj.price * obj.count
        }, 0);
        allNum = data.reduce(function (total, obj) {
            return total + parseInt(obj.count)
        }, 0);
        showMoney = money;
        showNum = allNum;
        $('.price').html("¥" + showMoney.toFixed(2));
        $('.page-footer button').find("span").html(showNum);

        //  事件冒泡处理
        $('.list_num_operation').on('click', function () {
            return false;
        });
        // 减少数量
        $('.list_num_operation').on('click', '.reduce', function () {
            var num = $(this).next().val();
            var id = $(this).parent().data().id;
            var _price = $(this).parent().prev().data().price;
            var index = $(this).index('.reduce')
            console.log(id)
            if (num > 1) {
                num--;
                $.myAjax({
                    url: `http://localhost:3000/cart/decrease/${id}`,
                    type: 'post',
                    success: function () {
                        $(".reduce").eq(index).next().val(num);
                        money -= _price;
                        allNum -= 1
                        showMoney = money;
                        showNum = allNum;
                        $('.page-footer button').find("span").html(showNum);
                        $('.price').html("¥"+showMoney.toFixed(2));
                    }
                })
            } else {
                layer.open({
                    content: '商品数量已达最小值',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            };
        })
        //增加数量
        $('.list_num_operation').on('click', '.add', function () {
            var num = $(this).prev().val();
            var id = $(this).parent().data().id;
            var _price = $(this).parent().prev().data().price;
            var index = $(this).index('.add')
            if (num < 5) {
                num++;
                $.myAjax({
                    url: `http://localhost:3000/cart/increase/${id}`,
                    type: 'post',
                    success: function () {
                        $('.add').eq(index).prev().val(num);
                        money += _price;
                        allNum += 1
                        showMoney = money;
                        showNum = allNum;
                        $('.page-footer button').find("span").html(showNum);
                        $('.price').html("¥"+showMoney.toFixed(2));
                    }
                })
            } else {
                layer.open({
                    content: '商品数量已达最大值',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
                return false;
            }
        })

     allList()
     console.log(arr);
        // 全选切换
        $('.all-select').on({
            'change': function () {
                if (!$(this).prop('checked')) {
                    $('.price').html("¥0.00");
                    $('.page-footer button').find("span").html(0);
                    arr.splice(0);
                } else {
                    for (var i = 0; i < $('.list_content').length; i++) {
                        arr.push($('.list_content input[type=checkbox]').eq(i).data().id);
                    }
                    $('.price').html("¥" + money.toFixed(2));
                    $('.page-footer button').find("span").html(allNum);
                }
                console.log(arr)
                $('input[type=checkbox]').prop('checked', $(this).prop('checked'))
            }
        })
        // 店铺商品全选切换
        $('.self-allselect').on({
            'change': function () {
                console.log("p:" + $('.page-content_list li').eq($(this).index('.self-allselect')).find('.product_select').eq(0).prop("checked"));
                all_flag = $(this).prop("checked");
                if ($(this).prop("checked")) {
                    for (var i = 0; i < $(".self-allselect").length; i++) {
                        all_flag = all_flag && $('.self-allselect').eq(i).prop("checked");
                        if (!all_flag) {
                            $('.all-select').prop("checked", false);
                            return false;
                        }
                    }
                }
                self_flag = $(this).prop("checked");
                $('.page-content_list li').eq($(this).index('.self-allselect')).find('.product_select').prop("checked", $(this).prop("checked"));
                $('.all-select').prop("checked", all_flag);
                console.log("1" + self_flag)
            },
            'click': function () {
                console.log("2" + self_flag)
                var product_List = $('.page-content_list li').eq($(this).index(".self-allselect")).find(".list_content");
                var list_money = 0;
                var list_num = 0;
                for (var i = 0; i < product_List.length; i++) {
                    list_money = list_money + parseInt(product_List.find('.unitPrice span').eq(i).data().price * product_List.find('input[type=text]').eq(i).val());
                    list_num = list_num + parseInt(product_List.find('input[type=text]').eq(i).val())
                }
                if ($(this).prop("checked")) {
                    if (!self_flag) {
                        var list_money1 = 0;
                        var list_num1 = 0;
                        for (var i = 0; i < product_List.length; i++) {
                            console.log("p:" + $('.page-content_list li').eq($(this).index('.self-allselect')).find('.product_select').eq(i).prop("checked"));
                            if (!product_List.find('.product_select').eq(i).prop('checked')) {
                                list_money1 = list_money1 + parseInt(product_List.find('.unitPrice span').eq(i).data().price * product_List.find('input[type=text]').eq(i).val());
                                list_num1 = list_num1 + parseInt(product_List.find('input[type=text]').eq(i).val());
                                arr.push(product_List.find('.product_select').eq(i).data().id)
                            }
                        }
                        showMoney = (+showMoney + list_money1).toFixed(2);
                        showNum = showNum + list_num1;
                    }
                } else {
                    product_List.find('.product_select').eq(i).prop('checked', false);
                    showMoney = (showMoney - list_money).toFixed(2);
                    showNum = showNum - list_num;
                    var arr2=[];
                    for(var i = 0; i <product_List.length; i++){
                        arr2.push(arr.indexOf(product_List.find('.product_select').eq(i).data().id));
                    }
                    for(var j = 0; j < product_List.length; j++){
                        var index=arr.indexOf(arr2[j]);
                        arr.splice(index,1);
                    }
                  
                }
                console.log(arr);
                $('.price').html("¥" + showMoney);
                $('.page-footer button').find("span").html(showNum);
            }
        })

        // 商品选择切换
        $('.product_select').on({
            "change": function () {
                self_flag = $(this).prop("checked");
                for (var i = 0; i < $('.page-content_list li').eq($(this).data().index).find(".product_select").length; i++) {
                    self_flag = self_flag && $('.page-content_list li').eq($(this).data().index).find(".product_select").eq(i).prop("checked");
                }
                $('.all-select').prop("checked", self_flag);
                $('.self-allselect').eq($(this).data().index).prop("checked", self_flag);
                console.log(self_flag);
            },
            "click": function () {
                var price = parseInt($(this).next().find(".unitPrice span").data().price * $(this).next().find("input[type=text]").val());
                var num = parseInt($(this).next().find("input[type=text]").val());
                if ($(this).prop("checked")) {
                    showMoney = (+showMoney + price).toFixed(2);
                    showNum = showNum + num;
                    arr.push($(this).data().id);
                } else {
                    showMoney = (showMoney - price).toFixed(2);
                    showNum = showNum - num;
                    arr.splice(arr.indexOf($(this).data().id), 1)
                }
                $('.price').html("¥" + showMoney);
                $('.page-footer button').find("span").html(showNum);
                console.log(arr);
            }
        })    
}else{
    $('.empty_list').css("display","block");
    $('.page-content_list').css("display","none");
    $(".page-footer").css("display","none")
  }
}
})


// 选定所有商品
function allList() {
    for (var i = 0; i < $('.list_content').length; i++) {
    arr.push($('.list_content input[type=checkbox]').eq(i).data().id);
    }
}

$('.page-header,.page-content_top span').on("click", function () {
    delFlag = !delFlag;
    $('.page-footer div').eq(1).toggleClass('empty');
    if (delFlag) {
        $('.b').html("完成")
        $(".page-footer button").html("删除(<span>0</span>)")
        $('input').prop("checked", false)
        showNum = 0;
        showMoney = 0;
        self_flag=false;
        $('.page-footer button').off();
        arr=[];
            $('.page-footer button').on('click',function () {
                if(arr.length!=0){
                layer.open({
                    content: '这是一个底部弹出的询问提示'
                    ,btn: ['删除', '取消']
                    ,skin: 'footer'
                    ,yes: function(index){
                        $.myAjax({
                            url:'http://localhost:3000/cart/remove',
                            type:"post",
                            data:{
                                ids:arr
                            },
                            success:function () {
                                layer.open({
                                    content: '删除成功',
                                    time: 1 //2秒后自动关闭
                                })
                                setTimeout(function () {
                                    location.reload();
                                },1000)   
                            }
                         })
                    }
                  });
                }  
            });
    } else {
        $('.b').html("编辑");
        $('.page-footer button').html("结算(<span>" + allNum + "</span>)")
        $('input').prop("checked", true)
        showMoney = money;
        showNum = allNum;
        self_flag=true;
        arr=[];
        allList();
        $('.page-footer button').off();
        pay();
    }
    $('.price').html("¥" + showMoney);
    $('.page-footer button').find("span").html(showNum);
})



