$(function(){
    //一进入页面，发送ajax请求,渲染用户信息
    $.ajax({
        type:'get',
        url:'/user/queryUserMessage',
        dataType:'json',
        success:function(res){
            //登录成功，获取到用户的信息
            let htmlStr = template('tpl',res[0])
            $('#userInfo').html(htmlStr)
        }
    })


    //点击退出按钮,退出登录状态
    // 1. 用户端清空浏览器缓存 (就是将cookie中的sessionId清除)
    // 2. 调用后台提供的退出接口, 让后台销毁当前用户 session存储空间, 清空用户信息
    $('#logout').click(function(){
        $.ajax({
            type:'get',
            url:'/user/logout',
            success:function(res){
                if(res.success){
                    location.href ='login.html'
                }
            }
        })
    })
})