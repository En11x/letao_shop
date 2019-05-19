$(function(){
    //已进入页面发送ajax请求，获取购物车列表，进行渲染
    render()
    function render(){
        setTimeout(function(){
            $.ajax({
                type:'get',
                url:'/cart/queryCart',
                dataType:'json',
                data:{
                    id:1
                },
                success:function(res){

                   let htmlStr = template('cartTpl',{arr:res})
                   $('.mui-table-view').html(htmlStr)

                   //关闭下拉刷新
                   mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh()
                }
            })
        },500)
    }

    //下拉刷新
    mui.init({
        pullRefresh : {
          container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
            color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
            range:'100px', //可选 默认100px,控件可下拉拖拽的范围
            offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
            auto: true,//可选,默认false.首次加载自动上拉刷新一次
            callback :function(){   //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                render()
            } 
          }
        }
      })

      //点击删除
      $('.lt_main').on('tap','.btn_delete',function(){
          var This = this
        //弹出提示框
        mui.confirm('确定要删除本商品吗？','温馨提示',['取消','确认'],function(e){
            if(e.index===1){
                let id = $(This).data('id')
                $.ajax({
                    type:'post',
                    url:'/cart/deleteCart',
                    data:{
                        id:id
                    },
                    dataType:'json',
                    success:function(res){
                        if(res.success){
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading()
                        }
                    }
                })
            }
        })
      })

      //编辑功能
      //点击编辑按钮，显示编辑框
      $('.lt_main').on('tap','.btn_edit',function(){
          //自定义属性dataset,dom对象的属性
          var obj = this.dataset
          //从自定义属性中获取id
          console.log(obj)
          var id = obj.id
          var htmlStr = template('editTpl',obj)
          // mui 会把 \n 解释成 br来解析，所以要去掉
          htmlStr = htmlStr.replace(/\n/g,'')
          //显示确认框
          mui.confirm(htmlStr,"编辑商品",['确认','取消'],function(e){
            if(e.index === 0 ){
                //确认编辑
                //获取尺码和数量
                let size = $('.lt_size span.current').text()
                let num = $('.mui-numbox-input').val()

                $.ajax({
                    type:'post',
                    url:'/cart/updateCart',
                    data:{
                        id:id,
                        size:size,
                        num:num
                    },
                    dataType:'json',
                    success:function(res){
                        if(res.success){
                            //编辑成功,页面下拉刷新,mui的方法
                            mui(".mui-scroll-wrapper").pullRefresh().pulldownLoading()
                        }
                    }
                })
            }
          })
          // 动态添加的需要手动初始化数字框
            mui(".mui-numbox").numbox();
      })
    
      //点击尺码
      $('body').on('click','.lt_size span',function(){
          $(this).addClass('current').siblings().removeClass('current')
      })
})