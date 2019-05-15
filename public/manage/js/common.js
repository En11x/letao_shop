//配置禁用小圆环
NProgress.configure({ showSpinner: false });

//ajaxStart 所有的ajax开始调用
$(document).ajaxStart(function() {
  NProgress.start();
});

//ajaxstop 所有的ajax结束调用
$(document).ajaxStop(function() {
  setTimeout(function() {
    NProgress.done();
  }, 500);
});

$(function() {
  // 1. 二级分类切换功能
  $(".category").click(function() {
    $(this)
      .next()
      .stop()
      .slideToggle();
  });

  //点击顶部菜单按钮，隐藏和显示菜单
  $(".icon_menu").click(function() {
    $(".lt_aside").toggleClass("hidemenu");
    $(".lt_main").toggleClass("hidemenu");
    $(".lt_topbar").toggleClass("hidemenu");
  });

  // 退出登录
  $("#logoutBtn").click(function() {
    $.ajax({
      type:'get',
      url:'/employee/employeeLogout',
      success:function(res){
        if(res.success){
          location.href='login.html'
        }
      }
    })
  });
});
