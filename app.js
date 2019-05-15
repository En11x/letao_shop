const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
const logger = require('morgan')   //中间件记录日记

const manage = require('./routes/manage')
const employee = require('./routes/employee')
const user = require('./routes/user')
const category = require('./routes/category')
const product = require('./routes/product')


const app = express()

app.use(session({
  secret: 'letao',
  name: 'letao_shop',
  cookie: {maxAge: 8000000000},
  resave: false,
  saveUninitialized: true
}));

app.use(function(req,res,next){
  //获取访问路径
  // console.log(req.originalUrl)
  let url = req.originalUrl
  if (!req.session.employee
    && ((url.indexOf('/manage') > -1 && url.indexOf('.html') > -1) || url == '/manage/' )
    && url.indexOf('/manage/login.html') == -1) {
    return res.redirect('/manage/login.html');
  }
  next()
})


// view engine setup
app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './public/manage/'))


app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/manage/',manage)
app.use('/employee',employee)
app.use('/user',user)
app.use('/category',category)
app.use('/product',product)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
