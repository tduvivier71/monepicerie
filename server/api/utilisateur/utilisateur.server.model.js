'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

var UtilisateurShema = new Schema({
	nom: {
		type: String,
		trim: true
	},
	prenom: {
		type: String,
		trim: true
	},
    provider: {
        type: String, // local, facebook, google ...
    },
    hash: {
        type: String
    },
    salt: {
        type: String
    },
	courriel: {
		type: String,
		lowercase: true,
		trim: true,
		index: { unique: true }
	},
	facebook: {
        type: String
    },
    google: {
    	type: String
	},
    picture: {
        type: String
    },
    displayName: {
        type: String
    }
});

UtilisateurShema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(256).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
};

UtilisateurShema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 512, 'sha512').toString('hex');
	return this.hash === hash;
};

mongoose.model('Utilisateur', UtilisateurShema);