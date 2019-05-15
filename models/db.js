'use strict'
const mysql = require('mysql')

const pool = mysql.createPool({
    host : '127.0.0.1',
    user : 'root',
    password : '123456',
    database : 'letao',
    port:3306
})

//如果传了连个参数，那么第一个参数就是SQL操作字符串，第二个参数就是回调函数
//如果传了三个参数，第一个是SQL操作字符窜，第二个数组，第三个是回调函数
exports.query = function(){
    let args = arguments
    let sqlStr = args[0]
    let params = []
    let callback
    if(args.length === 2 && typeof args[1] === "function" ){
        callback = args[1]
    }else if(args.length === 3 && Array.isArray(args[1]) && typeof args[2] === 'function'){
        params = args[1]
        callback = args[2]
    }else{
        throw new Error("参数个数不匹配")
    }

    pool.getConnection(function(err,connection){
        if(err) return callback(err)
        connection.query(sqlStr,params,function(err,rows){
            if(err){ callback(err) }
            connection.release()
            callback.apply(null,arguments)
        })
    })
}