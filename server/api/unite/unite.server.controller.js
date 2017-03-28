'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Unite'); // MODIFY

exports.find = function (req, res) {

    Model.find({utilisateurId: req.user})
        .sort('unite')
        .populate('coutParId')
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

exports.createOne = function (req, res) {

    var data = new Model({
        unite: req.body.unite, // A MODIFIER
        abreviation: req.body.abreviation, // A MODIFIER
        operation: req.body.operation, // A MODIFIER
        nombre: req.body.nombre, // A MODIFIER
        coutParId: req.body.coutParId._id, // A MODIFIER
        utilisateurId: req.user
    });

    data.save(function (err, data) {

        if (err) {
            return helpers.handleSaveError(res, err, req.body.unite);
        }

        //   res.status(201).json(data);


        Model.findOne({
            utilisateurId: req.user,
            _id: data.id
        })
            .populate('coutParId')
            .exec(function (err, data) {
                res.status(201).json(data);
            });

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

            if (err) {
                return res.status(400).json(err);
            }
            if (!data) {
                return res.status(404).json();
            }

            data.unite = req.body.unite; // A MODIFIER
            data.abreviation = req.body.abreviation; // A MODIFIER
            data.operation = req.body.operation; // A MODIFIER
            data.nombre = req.body.nombre; // A MODIFIER
            data.coutParId = req.body.coutParId; // A MODIFIER

            data.save(function (err, data) {

                if (err) {
                    return helpers.handleSaveError(res, err, req.body.unite);
                }

                Model.findOne({
                    _id: req.params.id,
                    utilisateurId: req.user})
                .populate('coutParId')
                .exec(function (err, data) {
                    if (err) {
                        return res.status(400).json(err);
                    }
                    res.status(200).json(data);
                });


            });

        });

};






