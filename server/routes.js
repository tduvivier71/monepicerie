'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var moment = require('moment');

var categorie = require('./api/categorie/categorie.server.controller.js');
var epicerie = require('./api/epicerie/epicerie.server.controller.js');
var marque = require('./api/marque/marque.server.controller.js');
var unite = require('./api/unite/unite.server.controller.js');
var format = require('./api/format/format.server.controller.js');
var produit = require('./api/produit/produit.server.controller.js');
var liste = require('./api/liste/liste.server.controller.js');
var listeBase = require('./api/liste-base/liste-base.server.controller.js');
var utilisateur = require('./api/utilisateur/utilisateur.server.controller.js');

/*
 |--------------------------------------------------------------------------
 | Middleware
 |--------------------------------------------------------------------------
 */

function ensureAuthenticated(req, res, next) {
    if (!req.header('Authorization')) {
        return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
    }
    var token = req.header('Authorization').split(' ')[1];

    var payload = null;
    try {
        payload = jwt.decode(token, 'thisIsSecret'); // config.TOKEN_SECRET);
    }
    catch (err) {
        return res.status(401).send({ message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'Token has expired' });
    }
    req.user = payload.sub;
    next();
}

/*
 |--------------------------------------------------------------------------
 | Routes
 |--------------------------------------------------------------------------
 */

router.get('/api/categorie', ensureAuthenticated, categorie.find);
router.post('/api/categorie', ensureAuthenticated, categorie.createOne);
router.get('/api/categorie/:id', ensureAuthenticated, categorie.findOne);
router.put('/api/categorie/:id', ensureAuthenticated, categorie.updateOne);
router.delete('/api/categorie/:id', ensureAuthenticated, categorie.deleteOne);
router.get('/api/categorie/unique/:categorie', ensureAuthenticated, categorie.findUnique);

router.get('/api/epicerie', ensureAuthenticated, epicerie.find);
router.get('/api/epicerie/favori', ensureAuthenticated, epicerie.findFavori);
router.post('/api/epicerie', ensureAuthenticated, epicerie.createOne);
router.get('/api/epicerie/:id', ensureAuthenticated, epicerie.findOne);
router.put('/api/epicerie/:id', ensureAuthenticated, epicerie.updateOne);
router.delete('/api/epicerie/:id', ensureAuthenticated, epicerie.deleteOne);

router.get('/api/marque', ensureAuthenticated, marque.find);
router.post('/api/marque', ensureAuthenticated, marque.createOne);
router.get('/api/marque/:id', ensureAuthenticated ,marque.findOne);
router.put('/api/marque/:id', ensureAuthenticated, marque.updateOne);
router.delete('/api/marque/:id', ensureAuthenticated, marque.deleteOne);

router.get('/api/unite', ensureAuthenticated, unite.find);
router.post('/api/unite', ensureAuthenticated, unite.createOne);
router.get('/api/unite/:id', ensureAuthenticated,unite.findOne);
router.put('/api/unite/:id', ensureAuthenticated, unite.updateOne);
router.delete('/api/unite/:id', ensureAuthenticated, unite.deleteOne);

router.get('/api/format', ensureAuthenticated, format.find);
router.post('/api/format', ensureAuthenticated, format.createOne);
router.get('/api/format/:id', ensureAuthenticated, format.findOne);
router.put('/api/format/:id', ensureAuthenticated, format.updateOne);
router.delete('/api/format/:id', ensureAuthenticated, format.deleteOne);

router.post('/api/produit', ensureAuthenticated, produit.createOne);
router.put('/api/produit/:id', ensureAuthenticated, produit.updateOne);
router.delete('/api/produit/:id', ensureAuthenticated, produit.deleteOne);
router.get('/api/produit/:id', ensureAuthenticated, produit.findOne);
router.get('/api/produit', ensureAuthenticated, produit.find);

router.post('/api/liste', ensureAuthenticated, liste.createOne);
router.post('/api/liste/:id/detail', ensureAuthenticated, liste.createOneDetail);
router.put('/api/liste/:id', ensureAuthenticated, liste.updateOne);
router.delete('/api/liste/:id', ensureAuthenticated, liste.deleteOne);
router.delete('/api/liste/:id/detail/:id2', ensureAuthenticated, liste.deleteOneDetail);
router.get('/api/liste/:id', ensureAuthenticated, liste.findOne);
router.get('/api/liste', ensureAuthenticated, liste.find);

router.get('/api/listebase', ensureAuthenticated, listeBase.find);
router.post('/api/listebase', ensureAuthenticated, listeBase.createOne);
router.delete('/api/listebase/:id', ensureAuthenticated, listeBase.deleteOne);

router.post('/api/listebase/:id/detail', ensureAuthenticated, listeBase.createOneDetail);
router.delete('/api/listebase/:id/detail/:id2', ensureAuthenticated, listeBase.deleteOneDetail);

router.get('/api/utilisateur/:id',  utilisateur.getMe);
router.put('/api/utilisateur/:id',  utilisateur.updateMe);

router.post('/auth/signin', utilisateur.localLogin);
router.post('/auth/signup', utilisateur.localSignUp);
router.post('/auth/facebook/', utilisateur.facebookLogin);
router.post('/auth/google/', utilisateur.googleLogin);

module.exports = router;