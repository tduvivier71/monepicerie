'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Epicerie'); // !! A MODIFIER !!

exports.find = function(req, res) {
	Model.find('')
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
	helpers.createOne(req, res, Model);
};

exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function(req, res) {
	Model.findOne(
		{_id: req.params.id},
		function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
				data.epicerie = req.body.epicerie; // !! A MODIFIER !!
                data.lieu = req.body.lieu; // !! A MODIFIER !!
                data.adresse = req.body.adresse; // !! A MODIFIER !!
                data.favori = req.body.favori; // A MODIFIER
                data.latitude = req.body.latitude; // A MODIFIER
                data.longitude = req.body.longitude; // A MODIFIER
				data.save(function(err,data){
					res.status(200).json(data);
				});
		}
	);
};






