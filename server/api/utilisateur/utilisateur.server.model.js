'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
    bcrypt = require('bcryptjs');

var UtilisateurShema = new Schema({

	provider: {
		type: String, // local, facebook, google ...
		required: 'Le provider est requis.'
	},
	nom: {
		type: String,
		default: '',
		trim: true,
		required: 'Le nom est obligatoire.'
	},
	prenom: {
		type: String,
		default: '',
		trim: true
	},
	motDePasse: {
		type: String,
		select: false
	},
	courriel: {
		type: String,
		lowercase: true,
		trim: true,
	//	match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
		index: { unique: true }
	},

	hash: {
		type: String
	},
	salt: {
		type: String
	},
	facebook: String,
    google: String,
    picture: String,
    displayName: String

});

UtilisateurShema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UtilisateurShema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};

UtilisateurShema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('motDePasse')) {
		return next();
	}
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.motDePasse, salt, function(err, hashedPassword) {
			user.motDePasse = hashedPassword;
			next();
		});
	});
});

UtilisateurShema.methods.comparePassword = function(motDePasse, done) {
	bcrypt.compare(motDePasse, this.motDePasse, function(err, isMatch) {
		done(err, isMatch);
	});
};

/*

UtilisateurShema.virtual('fullName').get(function() {
	return this.prenom + ' ' + this.nom;
}).set(function(fullName) {
	var splitName = fullName.split(' ');
	this.prenom = splitName[0] || '';
	this.nom = splitName[1] || '';
});


UtilisateurShema.pre('save', function(next){
	var user = this;
	if (!user.isModified("motDePasse")) {
		return done();
	}

	bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) { return done(err); }
		bcrypt.hash(user.motDePasse, salt, noop,
    function(err, hashedPassword) {
			if (err) { return done(err); }
			user.motDePasse = hashedPassword;
			done();
		});
	});

	next();

})

UtilisateurShema.methods.hashPassword = function(motDePasse) {
	return crypto.pbkdf2Sync(motDePasse, SALT_FACTOR, 10000,
		64).toString('base64');
};

UtilisateurShema.methods.authenticate = function(motDePasse) {
	return this.motDePasse === this.hashPassword(motDePasse);
};


*/

mongoose.model('Utilisateur', UtilisateurShema);