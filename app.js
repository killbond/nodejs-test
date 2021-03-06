var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require ('express-session');
var engine = require('ejs-locals');

nconf = require('nconf');

var app = express();

nconf.argv()
    .env()
    .file({ file: path.join(__dirname,'/config/' + app.get('env') + '.json') });

app.use(session({
    secret: nconf.get('session:secret'),
    saveUninitialized: false,
    resave: false
}));

var routes = require('./routes/index');

// view engine setup
app.engine('ejs', engine);
app.set('views',__dirname + '/views');
app.set('view engine', 'ejs'); // so you can render('index')

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
