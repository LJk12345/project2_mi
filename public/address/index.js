$('.icon-back').on('click', function () {
    history.back();
})
$.myAjax({
    url: '/address/list',
    success: function (data) {
        if (data.length > 0) {
            $('.addressEmpty').css('display', 'none');
            $('.address').css('display', 'block');
        } else {
            $('.addressEmpty').css('display', 'block');
            $('.address').css('display','none');

        }
        data.forEach(function (item, index) {
            $(`
                <li>
                    <div class="address_list">
                        <p class="address-receive"><span>${item.receiveName}</span> <span>${item.receivePhone.substr(0,3)+"***"+item.receivePhone.substr(item.receivePhone.length-3)}</span></p>
                        <div class="address-message" >
                            <i data-isDefalut="${item.isDefault}">默认</i>
                            <button class="isDefalut_btn" data-id="${item.id}" >设置默认</button>
                            <p><span>${item.receiveRegion}</span> <span>${item.receiveDetail}</span></p>
                        </div>
                    </div>
                    <a href="add.html?id=${item.id}"><img src="img/address_03.png" /></a>
                </li>
             `).appendTo($('.address'));
            if (item.isDefault) {
                $('.address-message i').eq(index).css("display", "block")
            } else {
                $('.isDefalut_btn').eq(index).css("display", "block")
            }
        });
    }
})

$('.address').on('click', '.isDefalut_btn', function (e) {
    $.myAjax({
        url: `/address/set_default/${Number(e.target.dataset.id)}`,
        success: function () {
            var index= $(e.target).index(".isDefalut_btn")
            console.log(index);
            $('.address-message i').css("display", "none");
            $('.isDefalut_btn').css("display", "block")
             $(e.target).css("display", "none")
             $('.address-message i').eq(index).css("display", "block");
            
        }
    })
})

