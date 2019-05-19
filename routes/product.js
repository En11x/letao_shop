const express = require("express");
const formidable = require("formidable");
const fs = require("fs");
const uuid = require("node-uuid");
const moment = require("moment");
const path = require("path");
const Page = require("../models/page.js");
const Product = require("../models/product.js");
const ProPic = require("../models/proPic.js");

const router = express.Router();

router.get("/queryProductDetailList", function(req, res) {
  let page = new Page({
    page: req.query.page ? parseInt(req.query.page) : 1,
    size: req.query.pageSize ? parseInt(req.query.pageSize) : 10
  });
  Product.queryProductDetailList({}, page, function(err, result) {
    if (err) return res.send({ error: 403, message: "数据库异常！" });
    Product.countProductDetailList(function(err, data) {
      if (err) return res.send({ error: 403, message: "数据库异常！" });
      page.total = data.count;
      page.rows = result;
      res.send(page);
    });
  });
});

router.get('/queryProductDetail',function(req,res){
  Product.queryProductDetail(parseInt(req.query.id),function(err,data){
    if (err) return res.send({ error: 403, message: "数据库异常！" })
    ProPic.queryPic(req.query.id,function(err,picData){
      if (err) return res.send({ error: 403, message: "数据库异常！" })
      data[0].pic = new Array()
      data[0].pic = picData
      res.send(data[0])
    })
  })
})

router.post("/addProductPic", function(req, res) {
  //创建表单上传
  let form = new formidable.IncomingForm();
  //设置编码
  form.encoding = "utf-8";
  //设置文件存储路径
  form.uploadDir = "public/upload/product";
  //保留后缀
  form.keepExtensions = true;
  //设置单文件大小限制 2m
  form.maxFieldsSize = 2 * 1024 * 1024;
  form.parse(req, function(err, fields, files) {
    // console.log(files)
    var file = files.pic1;
    // if (!file || file.name == "") break;
    let picName = uuid.v1() + path.extname(file.name);
    fs.rename(file.path, "public/upload/product/" + picName, function(err) {
      if (err) res.send({ error: 403, message: "图片保存异常！" });
      res.send({ picName: picName, picAddr: "/upload/product/" + picName });
    });
  });
});

let addPic = function(picName, picAddr, id) {
  ProPic.addPic(
    {
      picName: picName,
      productId: id,
      picAddr: picAddr
    },
    function(err, data) {
      console.log("加入一张图片成功！");
    }
  );
};

router.post("/addProduct", function(req, res) {
  let product = new Product({
    proName: req.body.proName ? req.body.proName : "",
    oldPrice: req.body.oldPrice ? parseFloat(req.body.oldPrice) : "",
    price: req.body.newPrice ? parseFloat(req.body.newPrice) : "",
    proDesc: req.body.proDesc ? req.body.proDesc : "",
    size: req.body.size ? req.body.size : "",
    statu: req.body.statu ? parseInt(req.body.statu) : "1",
    updateTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    num: req.body.num ? parseInt(req.body.num) : "",
    brandId: req.body.brandId ? parseInt(req.body.brandId) : ""
  });

  Product.addProduct(product, function(err, result) {
    //console.log(result.insertId) 产品插入数据表的ID
    if (err) return res.send({ error: 403, message: "数据库异常！" });
    if (req.body.picName1 && req.body.picAddr1) {
      addPic(req.body.picName1, req.body.picAddr1, result.insertId);
    }
    if (req.body.picName2 && req.body.picAddr2) {
      addPic(req.body.picName2, req.body.picAddr2, result.insertId);
    }
    if (req.body.picName3 && req.body.picAddr3) {
      addPic(req.body.picName3, req.body.picAddr3, result.insertId);
    }
    res.send({ success: true });
  });
});

router.post('/queryProduct',function(req,res){
  let product = new Product({
    proName : req.body.proName ? req.body.proName:'',
    brandId :  req.body.brandId ? req.body.brandId:'',
    price : req.body.price ? req.body.price:'',
    num : req.body.num ? req.body.num:''
  })
  let page = new Page({
    page : req.body.page?parseInt(req.body.page):1,
    size : req.body.size?parseInt(req.body.size):10
  })
  Product.queryProduct(product,page,function(err,data){
    if (err) return res.send({ error: 403, message: "数据库异常！" });
    if(data.length == 0) return res.send(data)
    let idStr = ''
    //拿到所有产品的ID
    for(let i=0;i<data.length;i++){
      if(i==0){
        idStr += data[i].id
      }else{
        idStr += ','+data[i].id
      }
      data[i].pic = new Array()
    }
    //拿到产品对应的图片数据
    ProPic.queryPic(idStr,function(err,picData){
      if (err) return res.send({ error: 403, message: "数据库异常！" })
      for(let i =0;i<data.length;i++){
        for( let j=0; j<picData.length; j++ ){
          if(picData[j].productId == data[i].id){
            data[i].pic.push(picData[j])
          }
        }
      }
      res.send(data)
    })
  })
})

module.exports = router;
