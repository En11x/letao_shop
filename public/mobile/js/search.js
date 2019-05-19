$(function(){
    // 要渲染历史记录，先读取历史记录
    //约定一个键名 search_list

    //可以放在控制台执行,进行假数据初始化
    // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ]
    // var jsonStr = JSON.stringify(arr)
    // localStorage.setItem('search_list',jsonStr)

    //读取本地 Localstorage 获取记录进行渲染
    render()
    //封装一个方法,读取历史记录
    function getHistory(){
        let history = localStorage.getItem('search_list')||"[]"
        let arr = JSON.parse(history)  //转化成数组
        return arr
    }

    //进行渲染
    function render(){
        let arr = getHistory()
        let htmlStr = template('historyTpl',{arr:arr})
        $('.lt_history').html(htmlStr)
    }


    //清空本地历史记录
    //1.通过事件委托给清空记录绑定事件
    //2.清空本地历史记录
    //3.重新渲染界面
    $('.lt_history').on('click','.btn_empty',function(){
        // 弹出确认框
        mui.confirm('你确定要清空历史记录吗？','温馨提示',['取消','确认'],function(e){
            //点击确认
            if(e.index === 1){
                localStorage.removeItem('search_list')
                render()
            }
        })
    })


    //删除单条历史记录
    //通过事件委托绑定点击事件
    //获取删除记录的下标
    //从本地历史中移除这条记录
    //重新渲染
    $('.lt_history').on('click','.btn_delete',function(){
        var This = this
        //弹出提示框
        mui.confirm('确定删除本条记录？','温馨提示',['取消','确认'],function(e){
            if(e.index === 1){
                let index = $(This).data('index')
                let arr = getHistory()
                arr.splice(index,1)
                let jsonStr = JSON.stringify(arr)
                localStorage.setItem('search_list',jsonStr)
                render()
            }
        })
    })

    //点击搜索按钮，将记录添加到本地历史中
    //注册事件
    $('.search_btn').click(function(){
        let data = $('.search_input').val().trim()
        if(data === ''){
            return mui.toast('请输入搜索关键字',{
                duration:2500
            })
        }
        //获取本地历史记录
        let arr = getHistory()
        //不要重复项，如果有将以前的移除，将最新的添加到首部
        let index = arr.indexOf(data)
        if( index > -1){
            //存在
            arr.splice(index,1)
        }
        //数组的长度控制在10以内
        if(arr.length>=10){
            //删除最后一个
            arr.pop()
        }
        //在首部添加
        arr.unshift(data)
        //转换为json
        let jsonStr = JSON.stringify(arr)
        //更新
        localStorage.setItem('search_list',jsonStr)
        //重新渲染
        render()
        $('.search_input').val('')
        //搜索完成，跳转到搜索列表页面,将关键字传递过去
        location.href = 'searchList.html?key='+data
    })
})