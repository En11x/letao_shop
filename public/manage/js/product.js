$(function() {
  //当前页
  let currentPage = 1;

  //每页多少条
  let pageSize = 3;

  //专门用来保存图片对象
  let picArr = [];

  //一进入页面就渲染
  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function(res) {
        let htmlStr = template("productTpl", res);
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
      url: "/category/querySecondCategoryPaging",
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
    $('[name="brandId"]').val(id);

    //然后刷新表单的校验状态
    //参数1：字段
    //参数2：校验状态
    //参数3：配置规则，来配置我们的提示文本
    $("#form")
      .data("bootstrapValidator")
      .updateStatus("brandId", "VALID");
  });

  //配置图片上传
  $("#fileupload").fileupload({
    //指定数据类型为json
    dataType: "json",

    //done 当图片上传完成,响应回来时调用
    //每张图片上传完成都会调用一次
    done: function(e, data) {
      console.log(data);
      //获取后台返回来的数据对象
      let picObj = data.result;
      //获取图片地址
      let picAddr = picObj.picAddr;
      //新上传的图片对象，应在数组最前面
      picArr.unshift(picObj);
      //新的图片添加到#imgBox最前面
      $("#imgBox").prepend(
        `<img src=${picAddr} width="100" style="margin-right:5px;"/>`
      );

      if (picArr.length > 3) {
        //删除数组最后一项
        picArr.pop();
        //除了删除最后一项，还需要将页面中最后一张图片删除
        $("#imgBox img:last-of-type").remove();
      }
      //如果处理后picArr长度为3，才可以进行提交了，并且验证成功
      //更新picStatus的验证状态
      if (picArr.length === 3) {
        $("#form")
          .data("bootstrapValidator")
          .updateStatus("picStatus", "VALID");
      }
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
      //品牌ID
      brandId: {
        //校验规则
        validators: {
          notEmpty: {
            message: "请出入二级分类"
          }
        }
      },
      //商品名称
      proName: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //提示信息
            message: "请输入商品名称"
          }
        }
      },
      //商品描述
      proDesc: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //提示信息
            message: "请输入商品描述"
          }
        }
      },
      //商品库存
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^(0|[1-9][0-9]*)$/, //零或者非零开头的数字
            message: "商品库存格式, 必须是非零开头的数字"
          }
        }
      },
      //商品尺寸
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺寸"
          },
          regexp: {
            regexp: /\d{2}-\d{2}/,
            message: "尺寸格式必须是32-42"
          }
        }
      },
      //商品原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          },
          regexp: {
            regexp: /^(0|[1-9][0-9]*)$/,
            message: "商品价格必须是非0开头数字"
          }
        }
      },
      //商品现价
      newPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          },
          regexp: {
            regexp: /^(0|[1-9][0-9]*)$/,
            message: "商品价格必须是非0开头数字"
          }
        }
      },
      //标记图片是否上传满三张
      picStatus: {
        validators: {
          //非空校验
          notEmpty: {
            //提示信息
            message: "请上传3张图片"
          }
        }
      }
    }
  });

  //校验成功后，提交表单
  $("#form").on("success.form.bv", function(e) {
    //阻止默认提交时间
    e.preventDefault();
    let data = $("#form").serialize();
    // console.log(data)
    //将三张图片的信息拼接到data里
    data += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    data += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    data += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
    console.log(data);
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: data,
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
          $("#dropdownText").text("请选择二级分类");

          // 找到图片重置
          $("#imgBox img").remove();

          //重置数组
          picArr = [];
        }
      }
    });
  });
});
