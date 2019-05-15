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
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res) {
        let htmlStr = template("secondTpl", res);
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

  //点击分类按钮显示添加模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");

    //请求一级分类名称,渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 100 //有瑕疵
      },
      success: function(res) {
        //将数据添加到下拉菜单中
        let htmlStr = template("dropdownTpl", res);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  //给下拉菜单里的a标签注册点击事件
  $(".dropdown-menu").on("click", "a", function() {
    //选中的文本
    let text = $(this).text();

    //拿到categoryId
    let id = $(this).data("id");

    //修改文本内容
    $("#dropdownText").text(text);

    //将选中的元素的categoryId设置到隐藏的input元素中
    $('[name="categoryId"]').val(id);

    //然后刷新表单的校验状态
    //参数1：字段
    //参数2：校验状态
    //参数3：配置规则，来配置我们的提示文本
    $("#form")
      .data("bootstrapValidator")
      .updateStatus("categoryId", "VALID");
  });

  //配置图片上传
  $("#fileupload").fileupload({
    //指定数据类型为json
    dataType: "json",

    //done 当图片上传完成,响应回来时调用
    done: function(e, data) {
      //获取后台返回来的数据,图片地址
      let picAddr = data.result.picAddr;
      //显示图片
      $("#imgBox img").attr("src", picAddr);
      //将图片地址存在隐藏的input中
      $('[name="brandLogo"]').val(picAddr);

      //重置校验状态
      $("#form")
        .data("bootstrapValidator")
        .updateStatus("brandLogo", "VALID");
    }
  });

  //校验
  $("#form").bootstrapValidator({
    //将默认的排除项，重置掉（默认会对 :hidden  :disabled 进行排除）
    excluded: [],

    //配置图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok",
      invalid: "glyphicon glyphicon-remove",
      validating: "glyphicon glyphicon-refresh"
    },
    //校验字段
    fields: {
      //品牌名称
      brandName: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请出入二级分类名称"
          }
        }
      },
      //一级分类Id
      categoryId: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //提示信息
            message: "请选择一级分类"
          }
        }
      },
      //上传图片
      brandLogo: {
        validators: {
          //非空校验
          notEmpty: {
            //提示信息
            message: "请上传图片"
          }
        }
      }
    }
  });

  //校验成功后，提交表单
  $("#form").on("success.form.bv", function(e) {
    //阻止默认提交时间
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("#form").serialize(),
      success: function(res) {
        if (res.success) {
          //添加成功
          //重置表单校验状态和表单内容
          //传true不仅可以重置表单状态，还可以重置内容
          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
          //关闭模态框
          $("#addModal").modal("hide");
          //重新渲染页面，添加的项会在第一页，所以显然第一页
          currentPage = 1;
          render();
          // 找到下拉菜单文本重置
        $('#dropdownText').text("请选择1级分类")

        // 找到图片重置
        $('#imgBox img').attr("src", "images/none.png")
        }
      }
    });
  });
});
