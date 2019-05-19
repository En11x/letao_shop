$(function(){
    //解析地址栏参数, 将参数赋值到input框中
    let search = getSearch('key');
    $('.search_input').val( search )
    
    render()
    //获取input框,请求数据，进行渲染
    function render(){
        $('.lt_product').html('<div class="loading"></div>')
        //三个参数
        let params = {}
        //搜索关键字
        params.proName = $('.search_input').val()
        params.page = 1
        params.size = 100

        //两个可选的参数
        //获取当前高亮的a标签
        let $current = $('.lt_sort a.current')
        if( $current.length >0 ){
            //当前a标签有current类,需要进行排序
            //按照什么进行排序
            let sortName = $current.data('type')
            //升序还是降序，可以通过箭头的方向判断 (1升序 2降序)
            let sortValue = $current.find('i').hasClass('fa-angle-down')?2:1
            //需要排序，将参数增加到param
            params[sortName] = sortValue
        }
        setTimeout(function(){
            $.ajax({
                type:'post',
                url:'/product/queryProduct',
                data:params,
                dataType:'json',
                success:function(res){
                    if(res.length == 0){
                        return $('.lt_product').html('<p class="empty">没有搜索到商品！</p>')
                    }
                    let htmlStr = template('tpl',{data:res})
                    $('.lt_product').html(htmlStr)
                }
            })
        },1000)
    }

    //点击搜索按钮,实现搜索功能
    $('.search_btn').click(function(){
        //获取搜索框的值
        let key = $('.search_input').val().trim()
        if( key === ''){
            return mui.toast('请输入关键字',{
                duration:1500
            })
        }
        //获取本地历史数组
        let jsonStr = localStorage.getItem('search_list')
        let arr = JSON.parse(jsonStr)

        //不能重复
        let index = arr.indexOf(key)
        if( index > -1 ){
            //表示存在,删除原来的值，添加到首部
            arr.splice(index,1)
        }

        //不能超过10个
        if(arr.length>=10){
            arr.pop()
        }
        //添加到首部
        arr.unshift(key)

        //更新本地数据
        localStorage.setItem('search_list',JSON.stringify(arr))
        //重新渲染
        render()
    })



    //点击价格或者库存，切换current，实现排序
    //注册点击事件
    $('.lt_sort a[data-type]').click(function(){
        //当前a高亮，点击切换箭头方向
        if($(this).hasClass('current')){
            $(this).find('i').toggleClass("fa-angle-down").toggleClass("fa-angle-up")
        }else{
            //加上类名currrent
            $(this).addClass('current').siblings().removeClass('current')
        }
        render()
    })
})