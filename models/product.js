const db = require("./db.js");
//日期工具类
const moment = require("moment");

function Product(pro) {
  this.id = pro.id;
  this.proName = pro.proName;
  this.oldPrice = pro.oldPrice;
  this.price = pro.price;
  this.proDesc = pro.proDesc;
  this.size = pro.size;
  this.statu = pro.statu;
  this.updateTime = pro.updateTime;
  this.num = pro.num;
  this.brandId = pro.brandId;
}

//查询product表的全部信息
//如果传了product参数，就是条件查询
Product.queryProductDetailList = function(product, page, callback) {
  let selectSql = "select * from product where 1=1";
  let param = new Array();
  //如果出入产品名字
  if (product.proName) {
    //like %name%   查询包含name 的产品
    selectSql = selectSql + "AND proName LIKE ?";
    param[0] = "%" + product.proName + "%";
  }
  //传入品牌ID
  if (product.brandId) {
    selectSql = selectSql + "AND brandId = ?";
    param[param.length] = product.brandId;
  }
  //传入产品价格
  if (product.price) {
    //按价格顺序
    if (product.price == 1) selectSql = selectSql + "ORDER BY price";
    //降序
    if (product.price == 2) selectSql = selectSql + "ORDER BY price DESC";
  } else if (product.num) {
    if (product.num == 1) selectSql = selectSql + " ORDER BY num ";
    if (product.num == 2) selectSql = selectSql + " ORDER BY num DESC ";
  } else {
    selectSql = selectSql + " ORDER BY id DESC ";
  }
  //limit 3,10  从第4行检索10行数据
  selectSql = selectSql + 'LIMIT ?,?'
  param[param.length] = (page.page-1)*page.size
  param[param.length] = page.size
//   console.log(selectSql)
//   console.log(param)
  db.query(selectSql,param,function(err,result){
      if(err)return callback(err)
      callback(err,result)
  })
};

Product.countProductDetailList = function(callback){
    let selectSql = 'select count(id) as count FROM product WHERE 1=1'
    db.query(selectSql,function(err,result){
        if(err)return callback(err)
        callback(err,result[0])
    })
}

Product.addProduct = function(product,callback){
  var selectSql = 'insert into product (id,proName,oldPrice,price,proDesc,size,statu,updateTime,num,brandId)  values (null,?,?,?,?,?,?,?,?,?)';
  db.query(selectSql, [product.proName, product.oldPrice, product.price, product.proDesc, product.size, product.statu, product.updateTime, product.num, product.brandId], function (err, result) {
    if (err) {
      console.log(err);
      return callback(err);
    }
    callback(err, result);
  });
}

Product.queryProduct = function(product,page,callback){
  let selectSql = 'select * from product where statu = 1'
  let params = new Array()
  if( product.proName ){
    selectSql += ' AND proName LIKE ?'
    params[0] = '%'+product.proName+'%'
  }
  if( product.brandId ){
    selectSql += ' AND brandId = ?'
    params[params.length] = product.brandId
  }
  if( product.price ){
    //升序
    if( product.price ==1 ) selectSql += ' ORDER BY price'
    //降序
    if( product.price == 2 ) selectSql += ' ORDER BY price DESC'
  }else if( product.num ){
    //升序
    if( product.num ==1 ) selectSql += ' ORDER BY num'
    //降序
    if( product.num == 2 ) selectSql += ' ORDER BY num DESC'
  }
  selectSql += ' LIMIT ?,?'
  params[params.length] = (page.page -1) *page.size
  params[params.length] = page.size
  db.query(selectSql,params,function(err,result){
    if(err) return callback(err)
    callback(err,result)
  })
}

Product.queryProductDetail = function(productId,callback){
  let selectSql = 'select * from product where id = ?'
  db.query(selectSql,[productId],function(err,result){
    if(err) return callback(err)
    callback(err,result)
  })
}
module.exports = Product