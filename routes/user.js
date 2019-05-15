const express = require('express')
const User = require('../models/user.js')
const Page = require('../models/page.js')
const router = express.Router()

// 查询用户的信息
router.get('/queryUser',function(req,res){
    
    let page = new Page({
        page:req.query.page?parseInt(req.query.page):0,
        size:req.query.pageSize?parseInt(req.query.pageSize):10
    })

    User.queryUser(page,function(err,data){
        //查询到的数据
        if(err) return res.send({'error':403,'message':'数据库异常'})
        User.countUser(function(err,result){
            //user里的总数量console.log(result.count)
            if(err) return res.send({'error':403,'message':'数据库异常'})
            page.total = result.count 
            page.rows = data
            res.send(page)
        })
    })
})

router.post('/updateUser',function(req,res){
    let user = new User({
        id:req.body.id,
        isDelete : req.body.isDelete
    })
    User.updateUser(user,function(err,result){
        if(err) return res.send({'error':403,"message":'数据库错误'})
        res.send({"success":true})
    })
})

module.exports = router