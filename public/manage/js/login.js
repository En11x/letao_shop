// 表单验证
$(function(){
    $("#login-form")
        .bootstrapValidator({
            //配置图标
            feedbackIcons:{
                valid:'glyphicon glyphicon-ok',
                invalid:'glyphicon glyphicon-remove',
                validating:'glyphicon glyphicon-refresh'
            },

            //对字段进行校验
            fields:{
                username:{
                    //校验的规则
                    validators:{
                        //非空校验
                        notEmpty:{
                            //为空时显示的提示的信息
                            message:"用户名不能为空"
                        },
                        //长度要求 2-6 位
                        stringLength:{
                            min:2,
                            max:6,
                            message:"用户名长度必须是2-6位"
                        },
                        callback:{
                            message:"用户名不存在"
                        }
                    }
                },
                password:{
                    //校验的规则
                    validators:{
                        //非空校验
                        notEmpty:{
                            //为空时显示的提示的信息
                            message:"密码不能为空"
                        },
                        //长度要求 2-6 位
                        stringLength:{
                            min:6,
                            max:12,
                            message:"用户名长度必须是6-12位"
                        },
                        callback:{
                            message:"密码错误"
                        }
                    }
                }
            }
        })
        //ajax提交数据
        .on('success.form.bv',function(e){
            //阻止默认提交
            e.preventDefault()
            
            let data = $("#login-form").serialize()

            $.ajax({
                type:'POST',
                url:"/employee/employeeLogin",
                dataType:'json',
                data:data,
                success:function(res){
                    console.log(res)
                    if(res.success){
                        //登录成功
                        location.href = "/manage/index.html"
                    }
                    if(res.error == 1000){
                        console.log(1)
                        //用户名不存在
                        //参数1、字段名称
                        //参数2、校验状态
                        //参数3、校验规则, 可以设置提示文本
                        $("#login-form").data('bootstrapValidator').updateStatus('username','INVALID','callback')
                    }
                    if(res.error == 1001){
                        //密码错误
                        $("#login-form").data('bootstrapValidator').updateStatus('password','INVALID','callback')
                    }
                }
            })
        })


    //重置表单
    $('[type="reset"]').click(function(){
        $("#login-form").data('bootstrapValidator').resetForm();
    })
})

