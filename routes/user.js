const express = require('express')
const crypto = require('crypto')
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

//用户登录
router.post('/login',function(req,res){
    let md5 = crypto.createHash('md5')
    let password = md5.update(req.body.password).digest('base64')
    User.getUserByName(req.body.username,function(err,data){
        console.log(data)
        if(data.length === 0)return res.send({"error":403,"message":'用户名不存在!'})
        if(data[0].password != password) return res.send({"error":403,"message":'密码错误!'})
        req.session.user = data
        console.log(req.session)
        res.send({"success":true})
    })
})
//查询用户信息
router.get('/queryUserMessage',function(req,res){
    let id = req.session.user[0].id
    User.queryUserMessage(id,function(err,data){
        if(err) return res.send({'error':403,"message":'数据库错误'})
        res.send(data) 
    })
})

//退出登录
router.get('/logout',function(req,res){
    req.session.user = null
    res.send({ "success": true })
})

module.exports = router