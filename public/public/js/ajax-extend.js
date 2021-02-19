$.extend({
     myAjax:function (userOptions){
    // 初始默认化
        var defaultOptions={
            type:"get",
            headers:{
                "Authorization":sessionStorage.getItem("token"),
                "Content-Type":"application/json"
            }
        };
        // 合并默认项
        var options=Object.assign({},defaultOptions,userOptions);
        if(options.data) options.data=JSON.stringify(options.data)
        options.success=function(result){
                if(result.code === 200){
                     userOptions.success(result.data);
                }else{
                    if(result.code === 401){
                    layer.open({
                        content: '未登录请先登录',
                        btn: '我知道了',
                        shadeClose: false,
                        yes: function(){
                            location.replace('/login/login.html')
                        }
                        });
                        return
                    }
                    layer.open({
                        content: result.msg,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
        }
        $.ajax(options);
     },
})

