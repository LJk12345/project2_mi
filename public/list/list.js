var sort = true;
var sortClass = "sale";
var cid = parseInt(location.search.slice(5))
var titleFlag=false;
var loadFlag=true;
var index=0;
var orderDir="asc";
var name="";

$('.icon-back').on('click', function () {
  history.back();
})

$('.icon-category').on('click', function () {
  titleFlag=!titleFlag;
  $(this).toggleClass("icon-list");
  $('.product').toggleClass("row-product")
  $('.page-content img').toggleClass("row-avatar")
  $('.page-content li').toggleClass("row-li")
  $('.page-content a').toggleClass("row-a")

})

// Ajax的发送
function sendOutAjax() {
  $.myAjax({
    url: "http://localhost:3000/product/list",
    type: "post",
    data: {
      name: name,
      cid: cid,
      orderCol: sortClass,
      orderDir: orderDir,
      begin: index,
      pageSize: 6,
    },
    success: function (data) {
      if(data.length<6){
        loadFlag=false;
      }
      data.forEach(function (item) {
        $(`
        <li class="column-li">
        <a class="column-a" href="/product/product.html?id=${item.id}&cid=${item.cid}">
            <img class="avatar" src="${item.avatar}" />
            <div class="product">
                <p class="name">${item.name}</p>
                <p class="brief">${item.brief}<c/p>
                <p class="price">¥<span>${item.price}</span></p>
                <p>销量:<span class="sale">${item.sale}</span> 好评率:<span class="rate">${item.rate}</span></p>
            </div>
        </a>
        </li>
        `).appendTo($('.page-content ul'));
            index++;
      })
      if(titleFlag){
        $('.product').addClass("row-product")
        $('.page-content img').addClass("row-avatar")
        $('.page-content li').addClass("row-li")
        $('.page-content a').addClass("row-a")
      }
     
    }
  })
}
sendOutAjax()


$('.page-header ul').on('click', "li", function () {
  if ($(this).index() < 3) {
    $(this).siblings().removeClass('select')
    $(this).addClass('select')
    sortClass = $(this).attr("data-sortClass")
  } else {
    sort = !sort
    if (sort) {
      $(this).find("i").html("&#xe615;")
      $(this).find("i").attr("data-sort", "asc")
      orderDir="asc";
    } else {
      $(this).find("i").html("&#xe616;")
      $(this).find("i").attr("data-sort", "desc")
      orderDir="desc";
    }
  }  
  index=0;
  name="";
  loadFlag=true;
  $('.icon-search').next().val("");
  $('.page-content ul').empty();
  sendOutAjax()
})


$(".page-content").on("scroll", function () {
      if($(this).scrollTop()>=($('.ul_height').height()-$('.page-content').height())-1 && loadFlag){
        sendOutAjax()
      }
      
})
$('.icon-search').on('click',function () {
  new Promise(function(resolve){
    $('.page-content ul').empty();
    name=$('.icon-search').next().val();
    console.log(name)
        setTimeout(function(){
            resolve();
        },100)
    }).then( sendOutAjax());
  
})