const db = require('./db.js')

//用户对象
function Employee(employee){
    this.id = employee.id
    this.username = employee.username
    this.password = employee.password
    this.mobile = employee.mobile
    this.authority = employee.authority
}

Employee.getUserByName = function(username,callback){
    let selectSql = "select * from employee where username = ?"
    db.query(selectSql,[username],function(err,result){
        if(err){
            return callback(err)
        }
        let data = result[0]
        callback(err,data)
    })
}
module.exports = Employee