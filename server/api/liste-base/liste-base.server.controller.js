/**
 * LISTES DE BASE
 */

'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('ListeBase'), // MODIFY
    SubModel = mongoose.model('ListeBaseDetail'),
	url = require('url'); // MODIFY

exports.find = function(req, res) {
	var filter = {};
	Model.find( filter )
		.populate('epicerieId')
		.populate('listeDetail.produitId')
		.exec(function(err, data) {
			if (err)
			{return res.status(400).json(err);}
			if (!data)
			{return res.status(404).json({"message":"non trouvé"});}
			res.status(200).json(data); // return a array
			console.log('liste find : ' + data);
		});
};

exports.createOne = function(req, res) {
	var data  = new Model({
		date: req.body.date,
		epicerieId: req.body.epicerieId,
		gabarit: req.body.epicerieId,
		nomGabarait: req.body.nomGabarait
	});
	data.save(function(err, data) {
		if (err) {return	res.status(400).json(err);}
		Model.findOne( { _id: data.id })
			.populate('epicerieId')
			.populate('listeDetail.produitId')
			.exec(function(err, data) {
				if (err) {return	res.status(400).json(err);}
				res.status(201).json(data);
				console.log('liste createOne : ' + data);
			});
	});
};