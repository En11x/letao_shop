const express = require('express')

const router = express.Router()


router.get('/*',function(req,res){
    console.log(req.originalUrl)
})

module.exports = router