const db = require('./db.js')

function Brand(brand){
    this.id = brand.id
    this.brandName = brand.brandName
    this.categoryId = brand.categoryId
    this.brandLogo = brand.brandLogo
    this.isDelete = brand.isDelete
    this.hot = brand.hot
}

Brand.addSecondCategory = function(brand,callback){
    let selectSql = 'insert into brand (id,brandName,categoryId,brandLogo,isDelete,hot) values(null,?,?,?,1,?)'
    db.query(selectSql,[brand.brandName,brand.categoryId,brand.brandLogo,brand.hot],function(err,result){
        if(err)return callback(err)
        callback(err,result)
    })
}


module.exports = Brand