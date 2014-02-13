var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    MongoStore = require('connect-mongo')(express),
    settings = require('./settings'),
    flash = require('connect-flash'),
    app = express();


app.set('port', process.env.PORT || 3001);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(express.session({
    secret: settings.cookieSecret,
    key: settings.db, //cookie name
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }, //30 days
    store: new MongoStore({
        db: settings.db
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
routes(app);