'use strict';

var mongoose = require('mongoose');
var	helpers = require('../shared/helpers.server.controller.js');
var	Model = mongoose.model('Utilisateur');
var jwt = require('jwt-simple');
var moment = require('moment');
var request = require('request');
var config = require('../../config/config');

/*
 |--------------------------------------------------------------------------
 | Middleware
 |--------------------------------------------------------------------------
 */

function createJWT(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------
 */

exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function(req, res) {
	Model.findOne(
		{_id: req.params.id},
		function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
				data.nom = req.body.nom;
				data.prenom = req.body.prenom;
			    data.courriel = req.body.courriel;
				data.motDePasse = req.body.motDePasse;
				data.save(function(err,data){
					res.status(200).json(data);
				});
		}
	);
};

/*
 |--------------------------------------------------------------------------
 | Local login (connection)
 |--------------------------------------------------------------------------
 */

module.exports.localLogin = function (req, res) {

    if (!req.body.courriel || !req.body.motDePasse) {
        return res.status(404).json({ message : "Tous les champs sont requis"});
    }

    Model.findOne({courriel: req.body.courriel}, function (err, user) {
        if (!user) {
            return res.status(401).send({message: 'Adresse de courriel non trouvée'});
        }

        if (!user.validPassword(req.body.motDePasse)) {
            return res.status(401).send({message: 'Mot de passe invalide'});
        }

        var token =  createJWT(user);
        var utilisateur =
            {"nom" : user.nom,
             "prenom" : user.prenom};

        res.status(200).json({token: token, user: utilisateur });

    });
};

/*
 |--------------------------------------------------------------------------
 | Local signup (inscription)
 |--------------------------------------------------------------------------
 */

module.exports.localSignUp =  function(req, res) {

    if (!req.body.nom || !req.body.prenom || !req.body.courriel || !req.body.motDePasse) {
        return res.status(404).json({ message : "Tous les champs sont requis"});
    }

    Model.findOne({ courriel: req.body.courriel }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'Cette adresse courriel est déjà utilisée' });
        }
        var user = new Model({
            provider: 'local',
            nom: req.body.nom,
            prenom: req.body.prenom,
            courriel: req.body.courriel
        });

        user.setPassword(req.body.motDePasse);

        user.save(function(err, result) {
            if (err) {
                res.status(500).send({ message: err.message });
            }
            res.status(200).json({token: createJWT(user)});
        });
    });
};


/*
 |--------------------------------------------------------------------------
 | Login with Facebook
 |--------------------------------------------------------------------------
 */

module.exports.facebookLogin = function(req, res) {
    var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.FACEBOOK.CLIENT_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({url: accessTokenUrl, qs: params, json: true}, function (err, response, accessToken) {
        if (response.statusCode !== 200) {
            return res.status(500).send({message: accessToken.error.message});
        }

        // Step 2. Retrieve profile information about the current user.
        request.get({url: graphApiUrl, qs: accessToken, json: true}, function (err, response, profile) {
            if (response.statusCode !== 200) {
                return res.status(500).send({message: profile.error.message});
            }
            if (req.header('Authorization')) {
                Model.findOne({facebook: profile.id}, function (err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({message: 'There is already a Facebook account that belongs to you'});
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    Model.findById(payload.sub, function (err, user) {
                        if (!user) {
                            return res.status(400).send({message: 'Utilisateur non trouvé'});
                        }
                        user.provider = 'facebook';
                        user.facebook = profile.id;
                        user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
                        user.displayName = user.displayName || profile.name;
                        user.save(function () {
                            var token = createJWT(user);
                            res.send({token: token});
                        });
                    });
                });
            } else {
                // Step 3. Create a new user account or return an existing one.
                Model.findOne({facebook: profile.id}, function (err, existingUser) {
                    if (existingUser) {
                        var token = createJWT(existingUser);
                        return res.send({token: token});
                    }
                    var user = new Model();
                    user.provider = 'facebook';
                    user.facebook = profile.id;
                    user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.displayName = profile.name;
                    user.save(function () {
                        var token = createJWT(user);
                        res.send({token: token});
                    });
                });
            }
        });
    });
};

/*
 |--------------------------------------------------------------------------
 | Login with Google
 |--------------------------------------------------------------------------
 */

module.exports.googleLogin = function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: config.GOOGLE.CLIENT_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
        var accessToken = token.access_token;
        var headers = { Authorization: 'Bearer ' + accessToken };

        // Step 2. Retrieve profile information about the current user.
        request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
            if (profile.error) {
                return res.status(500).send({message: profile.error.message});
            }
            // Step 3a. Link user accounts.
            if (req.header('Authorization')) {
                Model.findOne({ google: profile.sub }, function(err, existingUser) {
                    if (existingUser) {
                        return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
                    }
                    var token = req.header('Authorization').split(' ')[1];
                    var payload = jwt.decode(token, config.TOKEN_SECRET);
                    Model.findById(payload.sub, function(err, user) {
                        if (!user) {
                            return res.status(400).send({ message: 'User not found' });
                        }
                        user.provider = 'google';
                        user.google = profile.sub;
                        user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                        user.displayName = user.displayName || profile.name;
                        user.save(function() {
                            var token = createJWT(user);
                            res.send({ token: token });
                        });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                Model.findOne({ google: profile.sub }, function(err, existingUser) {
                    if (existingUser) {
                        return res.send({ token: createJWT(existingUser) });
                    }
                    var user = new Model();
                    user.provider = 'google';
                    user.google = profile.sub;
                    user.picture = profile.picture.replace('sz=50', 'sz=200');
                    user.displayName = profile.name;
                    user.save(function() {
                        var token = createJWT(user);
                        res.send({ token: token });
                    });
                });
            }
        });
    });
};










