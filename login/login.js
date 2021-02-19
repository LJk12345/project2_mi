var psdShow=false;

$('button.btn-toggle').on('click',function(){
    $('.login-pwd, .login-phone').toggleClass("show");
});
// 手机验证码登录
$('button.btn-login-phone').on('click',function(){
    alert('手机号验证码登录功能未开发')
});

//用户名密码登录
$('button.btn-login-pwd').on('click',function(){
    $.ajax({
        url:"/user/login_pwd",
        type:"post",
        //headers节点用与设置请求头
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            name: $('input.name').val().trim(),
            pwd: $('input.pwd').val()
        }),
        success: function(result){
                if(result.code===200){
                    sessionStorage.setItem("token",result.data);
                    sessionStorage.setItem("name",$('input.name').val().trim());
                    window.location.replace("/profile/profile.html")
                    // if(history){
                    //     history.back();
                    // }
                }else{
                    alert(result.msg);
                }
            
        }
    })
})

$('.page-footer').on("click","li",function () {
    $(this).siblings().css("color","#9b9b9b");
    $(this).css('color',"#4a4a4a");
    
})
$('.icon-password').on("click",function(){
    psdShow=!psdShow;
    if(psdShow){
       $(this).parent().prev().attr("type",'text');
       $(this).css('color','#c49c63')
    }else{
        $(this).parent().prev().attr("type",'password');
        $(this).css('color','black')
    }
})