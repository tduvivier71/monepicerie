// Invoke 'strict' JavaScript mode
'use strict';

var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	MongoStore = require('connect-mongo')(session),
	mongoose = require('mongoose'),
	flash = require('connect-flash');

var cors = require('cors');

// Define the Express configuration method
module.exports = function(db) {


	// Create a new Express application instance
	var app = express();

	// Configure the MongoDB session storage
	var mongoStore = new MongoStore({
		mongooseConnection: db.connection,
		collection: config.sessionCollection});


	app.set('port', normalizePort(process.env.PORT || '9000'));

	app.use(cors());

	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());

	app.use(methodOverride());
	app.use(flash());
	app.use(express.static('./client'));
	app.use(express.static('./client/asset'));
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: mongoStore
	}));




	//*******




	//*******

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
		app.use(compress());
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});

	var routes = require('../routes.js');
	app.use('/', routes);
	
	// Return the Server instance
	return app;
};

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}

