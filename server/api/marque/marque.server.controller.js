'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Marque'); // MODIFY

exports.find = function(req, res) {
	Model.find('')
		.sort('marque')
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
				data.marque = req.body.marque; // MODIFY
				data.save(function(err,data){
					res.status(200).json(data);
				});
		}
	);
};






