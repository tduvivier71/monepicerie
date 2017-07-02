    /**
     * Created by Thierry on 2017/07/01.
     */
    // Invoke 'strict' JavaScript mode
    'use strict';

    var express = require('express');

    process.env.ENV = process.env.ENV || 'development';
    var config = require('./config/config');

    var mongoose = require('./config/mongoose');

    var path = require('path');
    var morgan = require('morgan');
    var compression = require('compression');
    var bodyParser = require('body-parser');
    var methodOverride = require('method-override');
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    var flash = require('connect-flash');
    var cors = require('cors');

    // Create a new Express application instance
    var app = express();

    var db = mongoose();

    // Configure the MongoDB session storage
    var mongoStore = new MongoStore({
        mongooseConnection: db.connection,
        collection: config.sessionCollection});

    config.port = process.env.PORT || config.port;

    app.set('env',  process.env.ENV);
    app.set('port', config.port);

    app.use(cors());

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());


    app.use(methodOverride());
    app.use(flash());

    if (app.get('env') === 'development') {
        app.use(express.static(path.join(__dirname, '../client/web')));
        app.use(express.static(path.join(__dirname, '../client/web/asset')));
    } else {
        app.use(express.static(path.join(__dirname, './public')));
    }

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
        store: mongoStore
    }));

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(morgan('dev'));
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
        app.use(compression());
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

    var routes = require('./routes.js');
    app.use('/', routes);

    app.listen(app.get('port'), function() {
        console.log("Node app is running at localhost:" + app.get('port'));
    })



