const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan')
const bodyParser = require('body-parser'); 
const session = require('express-session');
const fileUpload = require("express-fileupload");
const responseTime = require('response-time')

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const apiRouter = require('./routes/api');
const websiteRouter = require('./routes/website');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'my pet name is shanky',saveUninitialized: true,resave: true}));
app.use('/uploads',express.static('uploads'));
app.use(responseTime());

app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/website', websiteRouter);
app.use('/', indexRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  // render the error page
 if(res.status(err.status || 500)){
  res.json('505')
  //res.json(res.locals.error)
  }else{
  res.json('404')
}
});

module.exports = app;