const express = require("express");
const formidable = require("formidable");
const uuid = require("node-uuid");
const path = require("path");
const fs = require("fs");
const Category = require("../models/category.js");
const Page = require("../models/page.js");
const Brand = require("../models/brand.js");

const router = express.Router();

// 查询用户的信息
router.get("/queryTopCategoryPaging", function(req, res) {
  let page = new Page({
    page: req.query.page ? parseInt(req.query.page) : 0,
    size: req.query.pageSize ? parseInt(req.query.pageSize) : 10
  });

  Category.queryTopCategoryPaging(page, function(err, data) {
    //查询到的数据
    if (err) return res.send({ error: 403, message: "数据库异常" });
    Category.countTopCategory(function(err, result) {
      //user里的总数量console.log(result.count)
      if (err) return res.send({ error: 403, message: "数据库异常" });
      page.total = result.count;
      page.rows = data;
      res.send(page);
    });
  });
});

router.post("/addTopCategory", function(req, res) {
  let category = new Category({
    categoryName: req.body.categoryName ? req.body.categoryName : ""
  });
  Category.addTopCategory(category, function(err, result) {
    if (err) return res.send({ error: 403, message: "数据库错误" });
    res.send({ success: true });
  });
});

router.post("/addSecondCategory", function(req, res) {
  let brand = new Brand({
    brandName: req.body.brandName ? req.body.brandName : "",
    categoryId: req.body.categoryId ? parseInt(req.body.categoryId) : "",
    isDelete: req.body.isDelete ? parseInt(req.body.isDelete) : "",
    hot: req.body.hot ? parseInt(req.body.hot) : "",
    brandLogo: req.body.brandLogo ? req.body.brandLogo : ""
  });

  Brand.addSecondCategory(brand, function(err, result) {
    if (err) return res.send({ error: 403, message: "数据库错误" });
    res.send({ success: true });
  });
});

router.get("/querySecondCategoryPaging", function(req, res) {
  let page = new Page({
    page: req.query.page ? parseInt(req.query.page) : 0,
    size: req.query.pageSize ? parseInt(req.query.pageSize) : 10
  });

  Category.querySecondCategoryPaging(page, function(err, data) {
    //查询到的数据
    if (err) return res.send({ error: 403, message: "数据库异常" });
    Category.countSecondCategory(function(err, result) {
      //user里的总数量console.log(result.count)
      if (err) return res.send({ error: 403, message: "数据库异常" });
      page.total = result.count;
      page.rows = data;
      res.send(page);
    });
  });
});

router.post("/addSecondCategoryPic", function(req, res) {
  //创建表单上传
  let form = new formidable.IncomingForm();
  //设置编辑
  form.encoding = "utf-8";
  //设置文件存储路径
  form.uploadDir = "public/upload/brand";
  //保留文件后缀名
  form.keepExtensions = true;
  //设置单文件大小限制 2m
  form.maxFieldsSize = 2 * 1024 * 1024;
  //form.maxFields =1000 设置所有文件的大小综合
  //fields 包含请求的表单的所有数据
  //files 类型为file的input数据
  form.parse(req, function(err, fields, files) {
    //获取type=file 的input数据
    //pic1 是input type=file的name属性
    let file = files.pic1;
    //获取文件后缀名
    // uuid.v1() 获取唯一标识，时间戳
    let picName = uuid.v1() + path.extname(file.name);
    //对文件更名和路径 (oldPath,newPath,callback)
    //将图片换个地方保存并改名
    fs.rename(file.path, "public/upload/brand/" + picName, function(err) {
      if (err) return res.send({ error: 403, message: "图片保存异常" });
      //将保存成功的路径返回
      res.send({ picAddr: "/upload/brand/" + picName });
    });
  });
});

router.get('/queryTopCategory',function(req,res){
  Category.queryTopCategory(function(err,data){
    if(err) res.send({"error":403,"message":'查询失败'})
    let obj={
      total:data.length,
      rows:data
    }
    res.send(obj)
  })
})

router.get('/querySecondCategory',function(req,res){
  Category.querySecondCategory(req.query.id,function(err,data){
    if(err) res.send({"error":403,"message":'查询失败'})
    let obj={
      total:data.length,
      rows:data
    }
    res.send(obj)
  })
})

module.exports = router;
