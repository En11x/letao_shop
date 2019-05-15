$(function() {
  //当前页
  let currentPage = 1;

  //每页多少条
  let pageSize = 3;

  //已进入页面就渲染
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res) {
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

  //点击分类按钮显示模态框
  $('#addBtn').click(function(){
      $('#addModal').modal('show')
  })

  //校验
  $('#form').bootstrapValidator({
      //配置图标
      feedbackIcons:{
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      //校验字段
      fields:{
        categoryName:{
            //校验规则
            validators:{
                //非空校验
                notEmpty:{
                    //提示信息
                    message:'请输入一级分类名称'
                }
            }
        }
      }
  })

  //校验成功后，提交表单
  $('#form').on('success.form.bv',function(e){
      //阻止默认提交时间
      e.preventDefault()
      $.ajax({
          type:'post',
          url:'/category/addTopCategory',
          data:$('#form').serialize(),
          success:function(res){
            if(res.success){
              //添加成功
              //重置表单校验状态和表单内容
              //传true不仅可以重置表单状态，还可以重置内容
              $('#form').data('bootstrapValidator').resetForm(true)
              //关闭模态框
              $('#addModal').modal('hide')
              //重新渲染页面，添加的项会在第一页，所以显然第一页
              currentPage = 1
              render()
            }
          }
      })
  })

});
