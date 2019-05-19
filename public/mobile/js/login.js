$(function(){
    //1.给登录按钮添加点击事件
    //2.获取用户名和密码
    //3.发送ajax请求验证
    //    登录成功, (1) 如果传了地址过来, 跳转到传过来的地址页面
    //              (2) 如果没有传地址, 直接跳转个人中心
    //    登录失败, 提示用户登陆失败
    $('#loginBtn').click(function(){
        //获取用户名和密码
        let username = $('#username').val()
        let password = $('#password').val()
        if( username.trim() === "" ){
            mui.toast('用户名不能为空!')
            return 
        }
        if ( password.trim() === "" ) {
            mui.toast("请输入密码!");
            return
        }
        $.ajax({
            type:'post',
            url:'/user/login',
            data:{
                username:username,
                password:password
            },
            dataType:'json',
            success:function(res){
                if(res.error)return mui.toast('用户名或者密码错误')
                //登录成功
                if(res.success){
                    //跳转到个人中心页面
                    location.href = 'user.html'
                }
            }
        })

    })
})