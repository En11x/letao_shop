const express = require('express')

const ProPic = require('../models/proPic')
const Cart = require('../models/cart')

const router = express.Router()

router.get('/queryCart',function(req,res){
    Cart.queryCart(req.query.id,function(err,data){
        if(err)return res.send({'error':403,"message":'数据库错误!'})
        // console.log(data)
        if(data.length === 0)return res.send(data)
        let idStr = ''
        for(let i = 0; i< data.length; i++ ){
            if( i == 0 ){
                idStr += data[i].productId
            }else{
                idStr += ','+data[i].productId
            }
            data[i].pic = new Array()
        }
        //console.log(idStr) 获取产品ID
        //将获取的ID，获取产品对应的图片
        ProPic.queryPic(idStr,function(err,picData){
            if(err)return res.send({'error':403,"message":'数据库错误!'})
            for(let i=0; i<picData.length; i++){
                for(let j=0;j<data.length;j++){
                    if(data[j].productId == picData[i].productId){
                        data[j].pic.push(picData[i])
                    }
                }
            }
            res.send(data)
        })
        
    })
})

router.post('/updateCart',function(req,res){
    let cart = new Cart({
        id : parseInt( req.body.id ),
        num: req.body.num?parseInt( req.body.num ) :'',
        size:req.body.size?req.body.size:''
    })
    Cart.updateCart(cart,function(err,data){
        if(err)return res.send({'error':403,"message":'编辑失败!'})
        res.send({"success":true})
    })
})

router.post('/deleteCart',function(req,res){
    console.log(req.body.id)
    Cart.deleteCart(parseInt(req.body.id),function(err,data){
        if(err) return res.send({'error':403,"message":'编辑失败!'})
        res.send({"success":true})
    })
})

router.post('/addCart',function(req,res){
    let cart = new Cart({
        userId:req.session.user[0].id,
        productId:req.body.productId,
        num:req.body.num,
        size:req.body.size
    })
    Cart.addCart(cart,function(err,data){
        if(err) return res.send({'error':403,"message":'添加失败!'})
        res.send({"success":true})
    })
})
module.exports = router