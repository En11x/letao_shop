const db = require('./db.js')

function User(user){
    this.id = user.id;
    this.username = user.username;
    this.password = user.password;
    this.mobile = user.mobile;
    this.isDelete = user.isDelete
}
//查询user里所有信息 有限制
User.queryUser = function(page,callback){
    let selectSql = 'select * from user '
    selectSql += ' LIMIT ?,?'
    db.query(selectSql,[(page.page - 1)*page.size,page.size],function(err,result){
        if(err){
            return callback(err)
        }
        callback(err,result)
    })
}

//查询user数据的总数量
User.countUser = function(callback){
    let selectSql = 'select count(id) as count FROM user'
    db.query(selectSql,function(err,result){
        if(err){
            return callback(err)
        }
        callback(err,result[0])
    })
}

//根据id更新用户状态
User.updateUser = function(user,callback){
    let selectSql = 'UPDATE user SET isDelete = ? WHERE id= ?'
    db.query(selectSql,[parseInt(user.isDelete),user.id],function(err,result){
        if(err) return callback(err)
        callback(err,result)
    })
}

//查找user
User.getUserByName = function(username,callback){
    let selectSql = 'select * from user where username =? AND isDelete =1'
    db.query(selectSql,[username],function(err,result){
        if(err)return callback(err)
        callback(err,result)
    })
}

//查询信息
User.queryUserMessage = function(id,callback){
    let selectSql = 'select * from user where id = ?'
    db.query(selectSql,[id],function(err,result){
        if(err)return callback(err)
        callback(err,result)
    })
}
module.exports = User