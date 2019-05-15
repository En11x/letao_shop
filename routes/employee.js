const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const Employee = require('../models/employee.js')


router.post("/employeeLogin",(req,res)=>{
    let md5 = crypto.createHash('md5')
    let password = md5.update(req.body.password).digest("base64")
    Employee.getUserByName(req.body.username,function(err,result){
        if (!result) return res.send({ "error": 1000, "message": "用户名不存在! " })
        if(result.password != password) return res.send({"error":1001,"message":"密码错误!"})
        req.session.employee = result
        res.send({ "success": true });
    })
 
})

router.get("/employeeLogout",function(req,res) {
    req.session.employee=null;
    res.send({ "success": true });
});


module.exports = router