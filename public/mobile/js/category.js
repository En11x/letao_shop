$(function(){
    //已进入页面发送请求，获取数据,获取左侧一级分类数据进行渲染
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        dataType:'json',
        success:function(res){
            let htmlStr = template('leftTpl',res)
            $('.lt_category_left ul').html(htmlStr)

            //已进入页面。渲染第一个一级分类，对应的二级分类内容
            renderSecondById(res.rows[0].id)
        }
    })

    //通过事件委托给左侧的一级分类添a标签加点击事件，显示对应的二级分类内容
    $(".lt_category_left").on('click','li a',function(){
        $(this).addClass('current').parent().siblings().children().removeClass('current')
        let id = $(this).data('id')
        renderSecondById(id)
    })

    //通过一级分类的ID，查找二级分类内容，并渲染
    function renderSecondById(id){
        $.ajax({
            type:'get',
            url:'/category/querySecondCategory',
            data:{
                id:id
            },
            dataType:'json',
            success:function(res){
                let htmlStr = template('rightTpl',res)
                $('.lt_category_right ul').html(htmlStr)
            }
        })
    }
})