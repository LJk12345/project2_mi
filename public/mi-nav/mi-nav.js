   var reg=/.+\/(.+?)\/.+$/;
   var pageName=window.parent.location.href.match(reg)[1];
   console.log(pageName)
   $(`li[data-page=${pageName}]`).addClass('active');
   $('li').on('click',function (){
       window.parent.location.href=`../${this.dataset.page}/${this.dataset.page}.html`;
   })
   
   $.myAjax({
    url:'http://localhost:3000/cart/total',
    success:function(data){
        console.log(data)
          if(data!=0){
            $('.mi-nav li').find('b').addClass("show");
            $('.mi-nav li').find('b').html(data)
          }else{
            $('.mi-nav li').find('b').removeClass("show");
          }
    }
})