'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Categorie');

exports.find = function (req, res) {

    Model.find({utilisateurId: req.user})
        .sort('categorie')
        .exec(function (err, data) {

            if (err) {
                return res.status(400).json(err);
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

        res.status(200).json(data);
    });
};

exports.createOne = function(req, res) {

    var data = new Model({
        categorie: req.body.categorie,
        favori: req.body.favori,
        utilisateurId: req.user
    });

    data.save(function (err, data) {

        if (err) {
            return helpers.handleSaveError(res, err, req.body.categorie);
        }

        if (data.favori) {
            Model.findOne({utilisateurId: req.user,
                           favori: data.favori,
                           _id : { $ne: data._id }}, function (err, data2) {

                if (data2) { //  TO DO BETTER
                    data2.favori = false;
                    data2.save(function (err, data2) {

                        if (err) {
                            return helpers.handleSaveError(res, err, data2.categorie);
                        }

                    });
                }

            });
        }

        res.status(201).json(data);
    });

};

exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function (req, res) {

    Model.findOne({
        utilisateurId: req.user,
        _id: req.params.id
    }, function (err, data) {

        if (!data) {
            return res.status(404).json();
        }

        if (req.body.favori || req.body.favori !== data.favori) {
            Model.findOne({
                utilisateurId: req.user,
                favori: true,
                _id: {$ne: data._id}
            }, function (err, data2) {

                if (data2) { //  TO DO BETTER
                    data2.favori = false;
                    data2.save(function (err, data2) {
                        if (err) {
                            return helpers.handleSaveError(res, err, data2.categorie);
                        }
                    });
                }
            });
        }

        data.categorie = req.body.categorie; // A MODIFIER
        data.favori = req.body.favori; // A MODIFIER
        data.save(function (err, data) {

            if (err) {
                return helpers.handleSaveError(res, err, data.categorie);
            }

            res.status(200).json(data);

        });

    });
};






