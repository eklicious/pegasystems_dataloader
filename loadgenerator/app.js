var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pegaRouter = require('./routes/pega');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/pega/member/:id', pegaRouter.member.get);
app.get('/pega/member/update/:id', pegaRouter.member.update);
app.get('/pega/claim/:id', pegaRouter.claim.get);
app.get('/pega/claim/update/:id', pegaRouter.claim.update);
app.get('/pega/claim/add/:id', pegaRouter.claim.add);
app.get('/pega/provider/:id', pegaRouter.provider.get);
app.get('/pega/provider/update/:id', pegaRouter.provider.update);
app.get('/pega/memberPolicy/:id', pegaRouter.memberPolicy.get);
app.get('/pega/memberPolicy/update/:id', pegaRouter.memberPolicy.update);
app.get('/pega/transaction/:providerId/:memberId/:claimId', pegaRouter.transaction.test);

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
