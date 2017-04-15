'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Liste'), // MODIFY
    SubModel = mongoose.model('ListeDetail'),
	url = require('url'); // MODIFY

exports.findOne = function(req, res) {
	Model.findOne( { _id: req.params.id,
      				  utilisateurId: req.user

	})
		.populate('epicerieId')
        .populate('modeleId')
		.populate('listeDetail.produitId')
		.exec(function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
			res.status(200).json(data);
		});
};

exports.find = function(req, res) {
    Model.find({  utilisateurId: req.user})
		.populate('epicerieId')
        .populate('modeleId')
		.populate('listeDetail.produitId')
		.exec(function(err, data) {

			if (err)
				{return res.status(400).json(err);}

		//	if (!data)
		//		{return res.status(404).json({"message":"non trouvé"});}

			res.status(200).json(data); // return a array

		});
};

exports.createOne = function (req, res) {

    var data = new Model({
        date: req.body.date,
        epicerieId: req.body.epicerieId,
        modeleId: req.body.modeleId,
        utilisateurId: req.user
    });

    if (req.body.modeleId && req.body.modeleId.listeBaseDetail) {
		for (var i=0; i< req.body.modeleId.listeBaseDetail.length; ++i) {
			console.log(i);
			data.listeDetail.push({
				produit: req.body.modeleId.listeBaseDetail[i].produit ? req.body.modeleId.listeBaseDetail[i].produit : null //,
		//		marque: req.body.modeleId.listeBaseDetail[i].marque ?  req.body.modeleId.listeBaseDetail[i].marque : null,
		//		categorie: req.body.modeleId.listeBaseDetail[i].categorie ? req.body.modeleId.listeBaseDetail[i].categorie : null,
		//		conditionnement: req.body.modeleId.listeBaseDetail[i].conditionnement ? req.body.modeleId.listeBaseDetail[i].conditionnement : null,
		//		note: req.body.modeleId.listeBaseDetail[i].description ? req.body.modeleId.listeBaseDetail[i].description : null //,
			//	 produitId: req.body.modeleId.listeBaseDetail[i].produitId ? req.body.modeleId.listeBaseDetail[i].produitId : null

			});
    	}
    }

    data.save(function (err, data) {

        if (err) {
            return helpers.handleSaveError(res, err, req.body.date);
        }

        Model.findOne({
            _id: data.id,
            utilisateurId: req.user
        })
            .populate('epicerieId')
            .populate('modeleId')
            .populate('listeDetail.produitId')
            .exec(function (err, data) {

            	if (err) {
                    return res.status(400).json(err);
                }

                if (!data) {
            		return res.status(404).json();
            	}

                res.status(201).json(data);

            });
    });
};


/**
 *
 * @param req
 * @param {object} res - _id, produit_id
 *
 */
exports.createOneDetail = function(req, res) {
	Model.findById(req.params.id,
		function (err, data) {
			if (!err) {
					data.listeDetail.push({
						produitId: req.body.produitId,
						produit: req.body.produit,
						marque: req.body.marque,
						categorie: req.body.categorie,
						conditionnement: req.body.conditionnement,
						note: req.body.note
				});
				data.save(function (err, data) {
					if (err) {return res.status(400).json(err);}
					var lastDetail = data.listeDetail[data.listeDetail.length-1];
					res.status(201).json(lastDetail);
				});
			}
		}
	);
};

exports.deleteOne = function(req, res) {
	console.log('**deleteOne**');
	helpers.deleteOne(req, res, Model);
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
			data.listeDetail.id(req.params.id2).remove();
			data.save(function (err) {
				if (err) {console.log('**data save deleteOneDetail -> err **');}
				console.log('the sub-doc was removed');
			});

		}
	);
};

exports.deleteAllDetail = function(req, res) {
    console.log('**deleteAllDetail**');
    console.log('id : ' + req.params.id);
    console.log('id2 : ' + req.params.id2);

    Model.findById(req.params.id,
        function (err, data) {
            if (err) {
                console.log('**deleteAllDetail -> err **');
                return res.status(404).json({"err": err});
            }
            if (!data) {
                console.log('**deleteAllDetail -> id non trouvé **');
                return res.status(404).json({"id non trouvé": req.body.id});
            }
            console.log('**deleteOneDetail -> data trouvé **');
            console.log(data);

            //console.log('**data.listeDetail** : ' + data.listeDetail );

            for(var i =0; i < data.listeDetail.length; i++ ) {
                data.listeDetail.remove(data.listeDetail[i]._id.toString());
            }

            data.save(function (err) {
                if (err) {console.log('**data save deleteOneDetail -> err **');}
                console.log('the sub-doc was removed');
            });

        }
    );
};

exports.updateOne = function(req, res) {

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

            data.date = req.body.date; // A MODIFIER
            data.epicerieId = req.body.epicerieId; // A MODIFIER
            data.modeleId = req.body.modeleId; // A MODIFIER

            data.save(function (err, data) {

                if (err) {
                    return helpers.handleSaveError(res, err, req.body.nom);
                }

                Model.findOne( {_id : data.id,
                    utilisateurId: req.user} )
                    .populate('epicerieId')
                    .populate('modeleId')
                    .populate('listeDetail.produitId')
                    .exec(function (err, data) {

                        if (err) {
                            return res.status(400).json(err);
                        }

                        res.status(200).json(data);
                    });



            });

        }
    );


};






