'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Marque'); // MODIFY

function handleError(res, err, msg) {

    if (err.name === 'MongoError' && err.code === 11000) {
        msg = 'La valeur "' + msg + '" existe déjà.';
    }

    return res.status(400).json({
        'success': false,
        'message': msg
    });
}

exports.find = function (req, res) {

    Model.find({utilisateurId: req.user})
        .sort('marque')
        .exec(function (err, data) {
            if (err) {
                return handleError(res, err, 'marque');
                //return res.status(400).json(err);
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

exports.createOne = function (req, res) {

    var data = new Model({
        marque: req.body.marque,
        utilisateurId: req.user
    });

    data.save(function (err, data) {
        if (err) {
            return handleError(res, err, req.body.marque);
        }
        res.status(201).json(data);
    });

};

exports.deleteOne = function(req, res) {
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function(req, res) {
	Model.findOne(
		{_id: req.params.id},
		function(err, data) {
			if (err) {
			    return res.status(400).json(err);
			}
			if (!data) {
			    return res.status(404).json();
			}
				data.marque = req.body.marque; // MODIFY
				data.save(function(err,data){
                    if (err) {
                        return res.status(400).json(err);
                    }
					res.status(200).json(data);
				});
		}
	);
};






