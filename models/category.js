const db = require('./db.js')

function Category(category){
    this.id = category.id;
    this.categoryName = category.categoryName;
    this.isDelete = category.isDelete
}
//查询category里所有信息 有限制
Category.queryTopCategoryPaging = function(page,callback){
    let selectSql = 'select * from category order by id desc '
    selectSql += ' LIMIT ?,?'
    db.query(selectSql,[(page.page - 1)*page.size,page.size],function(err,result){
        if(err){
            return callback(err)
        }
        callback(err,result)
    })
}

//查询二级分类页面信息
Category.querySecondCategoryPaging = function(page,callback){
    let selectSql = 'SELECT b.*,c.categoryName FROM brand AS b LEFT JOIN category AS c ON b.categoryId=c.id order by b.id desc '
    selectSql += ' LIMIT ?,?'
    db.query(selectSql,[(page.page - 1)*page.size,page.size],function(err,result){
        if(err){
            return callback(err)
        }
        callback(err,result)
    })
}
Category.countSecondCategory = function(callback){
    let selectSql = 'select count(*) as count from brand'
    db.query(selectSql,function(err,result){
        if(err)return callback(err)
        callback(err,result[0])
    })
}

Category.countTopCategory = function(callback){
    let selectSql = 'select count(*) as count from category'
    db.query(selectSql,function(err,result){
        if(err)return callback(err)
        callback(err,result[0])
    })
}

//添加一级分类名
Category.addTopCategory = function(category,callback){
    let selectSql = 'insert into category (id,categoryName,isDelete) values (null,?,1)'
    db.query(selectSql,[category.categoryName],function(err,result){
        if(err) return callback(err)
        callback(err,result)
    })
}

module.exports = Category