$(function() {
  //区域滚动

  //mui实现的选择器，可以生成mui实例，就可以调用mui实例的方法
  mui(".mui-scroll-wrapper").scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false //是否显示滚动条
  });

  //获得slider插件对象
  let gallery = mui(".mui-slider");
  gallery.slider({
    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
  });
});

//解析地址栏传递的参数
function getSearch(name) {
  //获取url后面的参数 ?name=1&password=12123&desc=%E5%BHY
  let search = location.search;

  //解析成中文 ?name=1&password=12123&desc=中文
  search = decodeURI(search);

  //将问好去掉
  search = search.slice(1);
  //根据&&进行切割 ['name=1','password=123','desc=中文']
  
  let arr = search.split("&");
  let obj = {};
  arr.forEach(function(v, i) {
    let key = v.split("=")[0];
    let value = v.split("=")[1];
    obj[key] = value;
  });
  return obj[name];
}
