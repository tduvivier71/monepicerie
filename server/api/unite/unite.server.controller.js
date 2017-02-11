'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Unite'); // MODIFY

exports.find = function(req, res) {
	Model.find('')
		.sort('unite')
		.populate('coutParId')
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
        unite: req.body.unite, // A MODIFIER
    	abreviation: req.body.abreviation, // A MODIFIER
    	operation: req.body.operation, // A MODIFIER
    	nombre: req.body.nombre, // A MODIFIER
    	coutParId: req.body.coutParId // A MODIFIER
    });

    data.save(function(err, data) {
        if (err) {return res.status(400).json(err);}
        // use findOne for re-populate
        Model.findOne( { _id: data.id })
            .populate('coutParId')
            .exec(function(err, data) {
                res.status(201).json(data);
                console.log('Unite createOne : ' + data);
            });
    });
};



exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function(req, res) {
	// console.log(' exports.updateOne  ' + JSON.stringify(req.body.categorie));
	Model.findOne({_id: req.params.id})
        .populate('coutParId')
		.exec(function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
				data.unite = req.body.unite; // A MODIFIER
				data.abreviation = req.body.abreviation; // A MODIFIER
			    data.operation = req.body.operation; // A MODIFIER
				data.nombre = req.body.nombre; // A MODIFIER
                data.coutParId = req.body.coutParId; // A MODIFIER
				data.save(function(err,data){
					res.status(200).json(data);
				});
		});

};






