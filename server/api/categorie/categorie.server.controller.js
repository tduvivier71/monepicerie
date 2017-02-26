'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Categorie'); // MODIFY

exports.find = function (req, res) {

    Model.find({utilisateurId: req.user})
        .sort('categorie')
        .exec(function (err, data) {
            if (err) {
                return res.status(400).json(err);
            }
            if (!data) {
                return res.status(404).json();
            }
            res.status(200).json(data);
        });

};

exports.findOne = function(req, res) {
	helpers.findOne(req, res, Model);
};

exports.findUnique = function (req, res) {
    Model.findOne({categorie: req.params.categorie}, function (err, data) {
        if (err) {
            return res.status(400).json(err);
        }
        if (!data) {
            return res.status(404).json();
        }
        res.status(200).json(data);
    });
};

exports.createOne = function(req, res) {

    var data  = new Model({
        categorie: req.body.categorie,
        favori: req.body.favori,
        utilisateurId: req.user
    });

    data.save(function(err, data) {
        if (err) {
        	return res.status(400).json(err);
        }
        res.status(201).json(data);
    });

};

exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function (req, res) {

    var update = true;

    Model.findOne({categorie: req.body.categorie}, function (err, data) {
        console.log('findOne : ' + JSON.stringify(data));
        if (err) {
            return res.status(400).json(err);
        }
        if (data) {
            // data.id = data._id.toString();
            update = data.id === req.params.id;
        }
        if (update) {
            Model.findOne({_id: req.params.id},
                function (err, data) {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    if (!data) {
                        return res.status(404).json();
                    }
                    data.categorie = req.body.categorie; // A MODIFIER
                    data.favori = req.body.favori; // A MODIFIER
                    // data.utilisateurId = req.body.utilisateurId;
                    data.save(function (err, data) {
                        res.status(200).json(data);
                    });
                }
            );
        } else {
            res.status(409).json('La catégorie ne peut être renommnée "' + req.body.categorie + '" car elle existe déjà.');
        }
    });
};






