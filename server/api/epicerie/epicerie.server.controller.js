'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Epicerie'); // !! A MODIFIER !!

exports.find = function(req, res) {
	Model.find({utilisateurId: req.user})
		.sort('epicerie')
		.exec(function(err, data) {
			if (err) {return res.status(400).json(err);}
			res.status(200).json(data);
		});
};

exports.findFavori = function(req, res) {
    Model.find('')
        .sort('epicerie')
        .exec(function(err, data) {
            if (err) {return res.status(400).json(err);}
            res.status(200).json(data);
        });
};

exports.findOne = function(req, res) {
	helpers.findOne(req, res, Model);
};

exports.createOne = function(req, res) {

    var data  = new Model({
        epicerie: req.body.epicerie,
        adresse: req.body.adresse,
        favori: req.body.favori,
        location: req.body.location,
        utilisateurId: req.user
    });

    data.save(function(err, data) {

        if (err) {
            return helpers.handleSaveError(res, err, req.body.epicerie);
        }

        if (data.favori) {
            Model.findOne({favori: data.favori}, function (err, data2) {
                if (err) {
                    return res.status(400).json(err);
                }
                if (data2) {
                    data2.favori = false;
                    data2.save(function (err, data2) {
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
    Model.findOne(
        {_id: req.params.id},
        function (err, data) {
            if (err) {
                return helpers.handleSaveError(res, err, req.body.epicerie);
            }
            if (!data) {
                return res.status(404).json();
            }

            if  (req.body.favori || req.body.favori !== data.favori) {

                Model.findOne({favori: true}, function (err, data2) {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    if (data2) {
                        data2.favori = false;
                        data2.save(function (err, data2) {
                        });
                    }
                });
            }

            data.epicerie = req.body.epicerie; // !! A MODIFIER !!
            data.adresse = req.body.adresse; // !! A MODIFIER !!
            data.favori = req.body.favori; // A MODIFIER
            data.location = req.body.location;
            data.save(function (err, data) {
                res.status(200).json(data);
            });
        }
    );
};






