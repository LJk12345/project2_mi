$('ul.list-main').on('click',function(e){
    var li=e.target.tagName==='LI' ? e.target : e.target.parentNode;
    if($(li).hasClass('active')){return  }  
    $(li).addClass('active').siblings('.active').removeClass('active');
    $('img.avatar').attr('src',li.dataset.avatar);
        $.ajax({
           url:`/category/list/${li.dataset.id}`,
           type:'get',
           success:function(result){
               if(result.code===200){
                   $('ul.list-sub').empty().toggleClass('show', result.data.length > 0);
                   $('p.empty').toggleClass('show',result.data.length ===0);
                   result.data.forEach(function (item){
                       $(`
                           <li>
                            <a href="/list/list.html?cid=${item.id}">
                               <img src="${item.avatar}" />
                               <span>${item.name}</span>
                            </a>
                           </li> 
                       `).appendTo($('ul.list-sub'))
                   })
               }
           }
       })
   })


   
//发送ajax请求一级分类数据
$.ajax({
    url:"/category/list/0",
    type:"get",
    success:function(result){
        // 返回数据拼接成多个li放在ul.list-main中
        if(result.code===200){
            result.data.forEach(function (item){
                $(`
                  <li data-id="${item.id}" data-avatar="${item.avatar}">
                    <span>${item.name}</span>
                  </li>
                `).appendTo($('.list-main'))
            })
            $('ul.list-main li').eq(0).trigger('click');
          } 
        }
    })

   
