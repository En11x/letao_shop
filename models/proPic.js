const db = require('./db.js')

function ProPic(pic){
    this.id = pic.id
    this.picName = pic.picName
    this.productId = pic.productId
    this.picAddr = pic.picAddr
}

ProPic.addPic = function(pic,callback){
    let selectSql = 'insert into product_picture(id,picName,productId,picAddr) values(null,?,?,?)'
    db.query(selectSql,[pic.picName,pic.productId,pic.picAddr],function(err,result){
        if(err)return callback(err)
        callback(err,result)
    })
}

ProPic.queryPic = function(proId,callback){
    let selectSql = 'select * from product_picture where productId in ('+proId+')'
    db.query(selectSql,function(err,result){
        if(err) return callback(err)
        callback(err,result)
    })
}

module.exports = ProPic