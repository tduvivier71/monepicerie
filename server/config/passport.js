/**
 * Created by Thierry on 2016/10/17.
 */

'use strict';

var passport = require('passport'),
    mongoose = require('mongoose');

module.exports = function() {

    var Utilisateur = mongoose.model('Utilisateur');

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        Utilisateur.findOne({
            _id: id
        }, function(err, user) {
            done(err, user);
        });
    });

    require('./strategies/local.js')();
 ;

};