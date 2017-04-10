'use strict';

var	config = require('./config'),
    gracefulShutdown,
	mongoose = require('mongoose');

module.exports = function() {

	var db = mongoose.connect(config.db);

	require('../api/categorie/categorie.server.model');
	require('../api/epicerie/epicerie.server.model');
	require('../api/marque/marque.server.model');
	require('../api/unite/unite.server.model');
	require('../api/format/format.server.model');
	require('../api/produit/produit.server.model');
	require('../api/liste/liste.server.model');
    require('../api/liste-base/liste-base.server.model');
    require('../api/liste-rapide/liste-rapide.server.model');
	require('../api/utilisateur/utilisateur.server.model');

	//require('../api/produit/produitHistorique.server.model');

	db.connection.on('connected',function() {
		console.log('Moogonse connected to : ' +  config.db);
	});

	db.connection.on('error',function(err) {
		console.log('Moogonse connection error : ' +  err);
	});

	db.connection.on('disconnected',function(err) {
		console.log('Erreur fatale - Moogonse disconnected...' +  err);
	});

	// CAPTURE APP TERMINATION / RESTART EVENTS
	// To be called when process is restarted or terminated
		gracefulShutdown = function(msg, callback) {
			mongoose.connection.close(function() {
				console.log('Mongoose disconnected through ' + msg);
				callback();
			});
		};
	// For nodemon restarts
		process.once('SIGUSR2', function() {
			gracefulShutdown('nodemon restart', function() {
				process.kill(process.pid, 'SIGUSR2');
			});
		});
	// For app termination
		process.on('SIGINT', function() {
			gracefulShutdown('app termination', function() {
				process.exit(0);
			});
		});

	// For Heroku app termination
	/* process.on('SIGTERM', function() {
		gracefulShutdown('Heroku app termination', function() {
			process.exit(0);
		});
	}); */


	return db;
};