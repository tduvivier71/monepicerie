/**
 * LISTES DE BASE
 */

'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('ListeBase'), // MODIFY
    SubModel = mongoose.model('ListeBaseDetail'),
	url = require('url'); // MODIFY

exports.find = function (req, res) {

	var filter = {};

    Model.find(filter)
        .populate('epicerieId')
        .populate('listeDetail.produitId')
        .exec(function (err, data) {
            if (err) {
                return res.status(400).json(err);
            }
            if (!data) {
                return res.status(404).json({"message": "non trouvé"});
            }
            res.status(200).json(data); // return a array
            console.log('liste find : ' + data);
        });

};

exports.createOne = function (req, res) {

    var data = new Model({
        nom: req.body.nom,
        epicerieId: req.body.epicerieId
    });

    data.save(function (err, data) {

        if (err) {
            return res.status(400).json(err);
        }

        Model.findOne( {_id : data.id} )
            .populate('epicerieId')
            .populate('listeBaseDetail.produitId')
            .exec(function (err, data) {
                if (err) {
                    return res.status(400).json(err);
                }
                res.status(201).json(data);
                console.log('liste createOne : ' + data);
            });

    });

};

// DELETE LES DETAILS EN MEME TEMPS ?????
exports.deleteOne = function(req, res) {
    helpers.deleteOne(req, res, Model);
};


exports.createOneDetail = function(req, res) {
    Model.findById(req.params.id,
        function (err, data) {
            if (!err) {
                data.listeBaseDetail.push({
                    produitId: req.body.produitId,
                    produit: req.body.produit,
                    marque: req.body.marque,
                    categorie: req.body.categorie,
                    conditionnement: req.body.conditionnement,
                    note: req.body.note
                });
                data.save(function (err, data) {
                    if (err) {return res.status(400).json(err);}
                    var lastDetail = data.listeBaseDetail[data.listeBaseDetail.length-1];
                    res.status(201).json(lastDetail);
                });
            }
        }
    );
};

exports.deleteOneDetail = function(req, res) {
    console.log('**deleteOneDetail**');
    console.log('id : ' + req.params.id);
    console.log('id2 : ' + req.params.id2);

    Model.findById(req.params.id,
        function (err, data) {
            if (err) {
                console.log('**deleteOneDetail -> err **');
                return res.status(404).json({"err": err});
            }
            if (!data) {
                console.log('**deleteOneDetail -> id non trouvé **');
                return res.status(404).json({"id non trouvé": req.body.id});
            }
            console.log('**deleteOneDetail -> data trouvé **');
            console.log(data);
            //console.log('**data.listeDetail** : ' + data.listeDetail );
            data.listeBaseDetail.id(req.params.id2).remove();
            data.save(function (err) {
                if (err) {console.log('**data save deleteOneDetail -> err **');}
                console.log('the sub-doc was removed');
            });

        }
    );
};
