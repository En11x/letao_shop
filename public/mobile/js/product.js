$(function(){
    //从地址栏获取传递过来的productId,发送请求，渲染页面
    let productId = getSearch('productId')
    //发送请求
    $.ajax({
        type:'get',
        url:'/product/queryProductDetail',
        data:{
            id:productId
        },
        dataType:'json',
        success:function(res){
            //res是一个对象,一个商品的所有信息
            let htmlStr = template('productTpl',res)
            $('.lt_main .mui-scroll').html( htmlStr )

            //手动初始化轮播图
            //获得slider插件对象
            let gallery = mui('.mui-slider');
            gallery.slider({
            interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
            });

            //手动初始化数字框
            mui(".mui-numbox").numbox()
        }
    })

    //给尺码添加选中功能
    //委托点击事件
    $('.lt_main').on('click','.lt_size span',function(){
        $(this).addClass('current').siblings().removeClass('current')
    })

    //加入购物车功能
    //注册点击事件
    $('#addCart').click(function(){
        //获取尺码和数量
        //尺码
        let size = $('.lt_size span.current').text()
        //数量
        let num = $('.mui-numbox-input').val()
        if( !size ){
            return mui.toast('请选择尺码',{
                duration:1500
            })
        }
        //发送ajax请求
        $.ajax({
            type:'post',
            url:'/cart/addCart',
            data:{
                productId:productId,
                size:size,
                num:num
            },
            dataType:'json',
            success:function(res){
                if(res.success){
                    //添加成功,弹出确认框
                    mui.confirm('添加成功','温馨提示',['去购物车','继续浏览'],function(e){
                        if( e. index === 0){
                            //去购物车
                            location.href = 'cart.html'
                        }
                    })
                }
            }
        })
    })
})