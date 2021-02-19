function fn(){
    if(sessionStorage.getItem("token")){
    $('.page-header span').html(sessionStorage.getItem("name"));
    $('.signOut').addClass('show');
    $('.page-header ').off();
}else{
    $('.page-header span').html("请先登录")
    $('.signOut').removeClass('show');
    $('.page-header').on('click',function(){
        location.assign('/login/login.html')
    });
}
}
fn()
$('.signOut').on('click',function(){
    sessionStorage.clear();
    fn()
})
