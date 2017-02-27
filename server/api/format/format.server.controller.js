'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Format'); // MODIFY

exports.find = function (req, res) {

    Model.find({utilisateurId: req.user})
        .sort('format')
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

exports.createOne = function(req, res) {

    var data  = new Model({
        format: req.body.format,
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

exports.updateOne = function(req, res) {
	// console.log(' exports.updateOne  ' + JSON.stringify(req.body.categorie));
	Model.findOne(
		{_id: req.params.id},
		function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
				data.format = req.body.format; // A MODIFIER
				data.save(function(err,data){
					res.status(200).json(data);
				});
		}
	);
};






