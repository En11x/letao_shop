$(function() {
  //当前页
  let currentPage = 1;

  //一页多少条
  let pageSize = 5;

  //一进入页面进行渲染
  render();

  function render() {
    //发送请求，获取表格数据
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res) {
        console.log(res);
        //参数2 必须是一个对象
        //在模板中可以任意使用对象中的属性
        //isDelete 表示用户的启用状态 1就是启用
        let htmlStr = template("tpl", res);
        $(".lt_content tbody").html(htmlStr);

        //配置分页
        $("#paginator").bootstrapPaginator({
          //指定bootstrap版本
          bootstrapMajorVersion: 3,
          //当前页
          currentPage: res.page,
          //总页数
          totalPages: Math.ceil(res.total / res.size),
          //当前页面被点击时触发
          onPageClicked: function(event, originalEvent, type, page) {
            //将当前页改成点击的页面
            currentPage = page;

            //调用renser函数，重新渲染一次
            render();
          }
        });
      }
    });
  }

  //通过实践委托给按钮注册事件
  $(".lt_content tbody").on("click", ".btn", function() {
    $("#userModal").modal("show");
    //获取点击的用户id
    let id = $(this)
      .parent()
      .data("id");
    //获取将用户状态设置成什么状态
    let isDelete = $(this).hasClass("btn-success") ? 1 : 0;

    //先解绑，在绑定事件，可以保证只有一个事件绑定在按钮上
    $('#submitBtn').off('click').on('click',function(){
        $.ajax({
            type:'post',
            url:'/user/updateUser',
            data:{
                id:id,
                isDelete:isDelete
            },
            success:function(res){
                if(res.success){
                    $("#userModal").modal("hide")
                    render()
                }
            }
        })
    })
  });
});
