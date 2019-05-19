const db = require('./db.js')

function Cart(cart){
    this.id = cart.id
    this.userId = cart.userId
    this.productId = cart.productId
    this.num = cart.num
    this.size = cart.size
    this.isDelete = cart.isDelete
}
//查询cart表信息
Cart.queryCart = function(userId,callback){
    let selectSql = 'select c.id,c.productId,c.num,c.size,p.proName,p.price,p.oldPrice,p.num as productNum,p.statu,p.size as productSize from cart as c left join product as p on c.productId = p.id where c.userId = ? and c.isDelete = 1'
    db.query(selectSql,[userId],function(err,result){
        if(err)return callback(err)
        callback(err,result)
    })
}

//更新cart信息
Cart.updateCart = function(cart,callback){
    let selectSql = 'update cart set num =?,size =? where id = ?'
    db.query(selectSql,[cart.num,cart.size,cart.id],function(err,result){
        if(err) return callback(err)
        callback(err,result)
    })
}

//删除cart信息
Cart.deleteCart = function(id,callback){
    let selectSql = 'update cart set isDelete = 0 where id = '+id
    console.log(selectSql)
    db.query(selectSql,function(err,result){
        if(err) callback(err)
        callback(err,result)
    })
}
//添加
Cart.addCart = function(cart,callback){
    let selectSql = 'insert into cart (id,userId,productId,num,size,isDelete) values (null,?,?,?,?,1)'
    db.query(selectSql,[cart.userId,cart.productId,cart.num,cart.size],function(err,result){
        if(err)callback(err)
        callback(err,result)
    })
}
module.exports = Cart                                                                                                                                                                                                                                                                                                                                                                                                                    