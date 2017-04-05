/**
 * LISTES DE BASE
 */

'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('ListeBase'), // MODIFY
    SubModel = mongoose.model('ListeBaseDetail'),
	url = require('url'); // MODIFY

exports.find = function (req, res) {

    Model.find()
        .populate('produitId')
        .exec(function (err, data) {

            if (err) {
                return res.status(400).json(err);
            }

            res.status(200).json(data); // return a array
        });

};

exports.createOne = function (req, res) {

    var data = new Model({
        produit: req.body.produit,
        utilisateurId: req.user
    });

    data.save(function (err, data) {

        if (err) {
            return helpers.handleSaveError(res, err, req.body.produit);
        }

        Model.findOne( {_id : data.id,
                        utilisateurId: req.user} )
            .populate('produitId')
            .exec(function (err, data) {

                if (err) {
                    return res.status(400).json(err);
                }

                res.status(201).json(data);
            });

    });

};

// DELETE LES DETAILS EN MEME TEMPS ?????
exports.deleteOne = function(req, res) {
    helpers.deleteOne(req, res, Model);
};

exports.deleteAllProduit = function(req, res) {

};


