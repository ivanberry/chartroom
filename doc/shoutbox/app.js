var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var message = require('./lib/message');
var user = require('./lib/module/user');
var entry = require('./routes/entry');
var post = require('./routes/post');
var api = require('./routes/api');

var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');

const options = {
	secret: 'Amy'
};

var index = require('./routes/index');
var register = require('./routes/register');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session(options));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api.auth);
app.use(user);
app.use(message);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/register', register);
app.get('/login', login.form);
app.post('/login', login.login);
app.get('/logout', login.logout);
app.get('/post', post.get);
// app.post('/post', validate.required('title'), validate.lengthAbove('body',4), post.post);
app.post('/post',  post.post);
app.get('/', page(Entry.count, 2), entry.list);
app.get('/api/user/:id', api.user);
app.get('/api/entry/:page?', page(Entry.count, 2), api.entry);
app.use(index.notFound);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
