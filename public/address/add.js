$('.icon-back').on('click',function(){
 history.back();
})
   


var addressId = window.location.search.substring(4);
if (addressId) {
    $('.page-header span').html("编辑地址")
    // 编辑显示
    $.ajax({
        url: `/address/model/${Number(addressId)}`,
        type: "get",
        headers: {
            "Authorization": sessionStorage.getItem("token")
        },
        success: function (result) {
            if (result.code === 200) {
                $('.receiveName').val(result.data.receiveName);
                $('.receivePhone').val(result.data.receivePhone);
                $('.regions-picker').val(result.data.receiveRegion);
                $('.receiveDetail').val(result.data.receiveDetail);
                $('.delete').css("display", "block")
            } else {
                alert(result.msg);
            }
        }
    })
    // 删除
    $('.delete').on('click', function () {
        $.ajax({
            url: `/address/remove/${Number(addressId)}`,
            type: "get",
            headers: {
                "Authorization": sessionStorage.getItem("token")
            },
            success: function (result) {
                if (result.code === 200) {
                    window.location.replace("index.html")

                } else {
                    layer.open({
                        content: result.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            }
        })
    })

} else {
    // 添加初始化
    $('.page-header span').html("新增地址")
    $('.receiveName').val("");
    $('.receivePhone').val("");
    $('.regions-picker').val("");
    $('.receiveDetail').val("");
    $('.delete').css("display", "none")
}



var flag = false;
// 格式判断
$('button.save-btn').on('click', function () {
    var a = /[\u4e00-\u9fa5\w]{2,20}/g.test($('.receiveName').val());
    var b = /^[1][3,4,5,7,8][0-9]{9}$/g.test($('.receivePhone').val());
    var c = /.+/.test($('.regions-picker').val());
    var d = /[\u4e00-\u9fa5\w]{5,}/g.test($('.receiveDetail').val());
    if (a && b && c && d) {
        flag = true;
    } else {
        if ($('.receiveName').val().length < 2) {
            layer.open({
                content: '收货人姓名不能小于2个字符',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if (/[^\w\u4e00-\u9fa5]+/g.test($('.receiveName').val())) {
            layer.open({
                content: '收件人名称不能含有特殊字符',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            })
        } else if (/\d+/g.test($('.receiveName').val())) {
            layer.open({
                content: '收件人名称不能包含数字',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if ($('.receivePhone').val() == "") {
            layer.open({
                content: '电话不能为空',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if (!/\d{11}/g.test($('.receivePhone').val())) {
            layer.open({
                content: '电话号码长度不对',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if (!b) {
            layer.open({
                content: '电话号码格式不对',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if ($('.regions-picker').val() == "") {
            layer.open({
                content: '请选择地区',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        } else if (!/.{5,}/g.test($(".receiveDetail").val())) {
            layer.open({
                content: '街道地址不能小于5个字符',
                skin: 'msg',
                time: 2 //2秒后自动关闭
            });
        }
        flag = false;
    }
    // 格式正确
    if (flag) {
        // 修改
        if (addressId) {
            $.ajax({
                url: "/address/update",
                type: "post",
                //headers节点用与设置请求头
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem("token")
                },
                data: JSON.stringify({
                    id: addressId,
                    receiveName: $('input.receiveName').val().trim(),
                    receivePhone: $('input.receivePhone').val(),
                    receiveRegion: $('input.regions-picker').val(),
                    receiveDetail: $('input.receiveDetail').val()
                }),
                success: function (result) {
                    if (result.code === 200) {
                        layer.open({
                            content: '修改成功',
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                        window.location.replace("index.html")
                    } else {
                        layer.open({
                            content: result.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }

                }
            })
        } else {
            // 添加
            $.ajax({
                url: "/address/add",
                type: "post",
                //headers节点用与设置请求头
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": sessionStorage.getItem("token")
                },

                data: JSON.stringify({
                    receiveName: $('input.receiveName').val().trim(),
                    receivePhone: $('input.receivePhone').val(),
                    receiveRegion: $('input.regions-picker').val(),
                    receiveDetail: $('input.receiveDetail').val()
                }),
                success: function (result) {
                    if (result.code === 200) {
                        layer.open({
                            content: '添加成功',
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                      history.back("index.html")

                    } else {
                        layer.open({
                            content: result.msg,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }

                }
            })
        }

    }

})