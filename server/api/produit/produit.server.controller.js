'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Produit'), // MODIFY
    SubModel = mongoose.model('ProduitHistorique'),
	CategorieModel =  mongoose.model('Categorie'), // MODIFY
	url = require('url'); // MODIFY


exports.find = function(req, res) {

	var filter = {};

	if(req.query) {

		if (req.query.hasOwnProperty('catId')) {
			filter = { categorieId : { $in: req.query.catId},
                       utilisateurId: req.user};
		}

		if (req.query.hasOwnProperty('prodId')) {
			filter = { _id : { $in: req.query.prodId},
                        utilisateurId: req.user};
		}

        if (req.query.hasOwnProperty('listeIds')) {
            filter = { _id : { $nin: req.query.listeIds} };
               // utilisateurId: req.user};
        }

	}

	Model.find( filter )
        .populate('marqueId')
		.populate('categorieId')
		.populate('uniteId')
		.populate({
			path:     'uniteId',
			populate: { path:  'coutParId',
				model: 'Unite' }
		})
		.populate('formatId')
		.populate('historiques.epicerieId')
		.exec(function(err, data) {
			if (err)
			{return res.status(400).json(err);}
			if (!data)
			{return res.status(404).json({"message":"non trouvé"});}
			res.status(200).json(data); // return a array
			console.log('produit find : ' + data);
		});
};


exports.findOne = function(req, res) {
    Model.findOne( { _id: req.params.id })
        .populate('marqueId')
        .populate('categorieId')
        .populate('uniteId')
        .populate('formatId')
        .populate({
            path:     'uniteId',
            populate: { path:  'coutParId',
                model: 'Unite' }
        })
        .populate('historiques.epicerieId')
        .exec(function(err, data) {
            if (err) {return res.status(400).json(err);}
            if (!data) {return res.status(404).json();}
            res.status(200).json(data);
        });
};

/*

exports.findAll = function(req, res) {

	console.log('**findAll**');

	Model.find({ _id: req.params.id })
		.sort('produit')
		.populate('categorieId')
		.populate('uniteId')
		.populate('uniteId.coutParId')
		.populate('formatId')
		.populate('historiques.epicerieId')
		.exec(function(err, data) {
			if (err) return res.status(400).json(err);
			if (!data) return res.status(404).json();
			res.status(200).json(data);

			console.log('findAll : ' + data);
		});
};

*/


exports.createOne = function(req, res) {

     var categorie;

	 CategorieModel.findOne(req.body.categorieId)
	 .exec(function (err, result) {
	 if (err) {return res.status(400).json(err);}
		 categorie = result.categorie;
	 });

	var data  = new Model({
		produit: req.body.produit,
		marqueId: req.body.marqueId,
		categorieId: req.body.categorieId,
		description: req.body.description,
		formatId: req.body.formatId,
	 	uniteId: req.body.uniteId,
        conditionnement: {
			quantite: req.body.conditionnement.quantite,
            format: req.body.formatId ? req.body.formatId.format : undefined,
            nombre: req.body.conditionnement.nombre,
			unite: req.body.uniteId ? req.body.uniteId.unite : undefined
        },

        utilisateurId: req.user
	});

	for (var i=0; i< req.body.historiques.length; ++i) {

		data.prixRecent.prix = req.body.historiques[i].prix;
        data.prixRecent.epicerie =  req.body.historiques[i].epicerieId.epicerie;

		data.historiques.push({
			epicerieId: req.body.historiques[i].epicerieId,
			date: req.body.historiques[i].date,
			prix: req.body.historiques[i].prix,
			enPromotion: req.body.historiques[i].enPromotion // A MODIFIER
		});
	}

    data.save(function (err, data) {
        if (err) {
            return helpers.handleSaveError(res, err, req.body.categorie);
        }
        // use findOne for re-populate
        Model.findOne({_id: data.id})
            .populate('marqueId')
            .populate('categorieId')
            .populate('uniteId')
            .populate({
                path: 'uniteId',
                populate: {
                    path: 'coutParId',
                    model: 'Unite'
                }
            })
            .populate('formatId')
            .populate('historiques.epicerieId')
            .exec(function (err, data) {
                res.status(201).json(data);
                console.log('produit createOne : ' + data);
            });
    });
};


exports.deleteOne = function(req, res) {
	console.log('**deleteOne**');
	helpers.deleteOne(req, res, Model);
};

exports.updateOne = function(req, res) {
	Model.findOne({_id: req.params.id})
	 	 .populate('categorieId')
		 .populate('uniteId')
		 .populate({
			path:     'uniteId',
			populate: { path:  'coutParId',
				model: 'Unite' }
		 })
		 .populate('formatId')
	     .populate('historiques.epicerieId')
		 .exec(function(err, data) {
			if (err) {return res.status(400).json(err);}
			if (!data) {return res.status(404).json();}
				data.produit = req.body.produit; // A MODIFIER
			    data.marqueId = req.body.marqueId; // A MODIFIER
			    data.categorieId = req.body.categorieId; // A MODIFIER
			    data.uniteId = req.body.uniteId; // A MODIFIER
			 	data.formatId = req.body.formatId; // A MODIFIER
			    data.conditionnement.quantite = req.body.conditionnement.quantite;
				data.conditionnement.nombre = req.body.conditionnement.nombre;
             	data.conditionnement.format = req.body.formatId ? req.body.formatId.format : undefined
             	data.conditionnement.unite = req.body.uniteId ? req.body.uniteId.unite : undefined

			    data.enPromotion =  req.body.enPromotion; // A MODIFIER

			    data.description = req.body.description; // A MODIFIER

			 	for (var i=0; i< req.body.historiques.length; ++i) {

					if (req.body.historiques[i].statut==='D') {
						if (SubModel.findOne({_id: req.body.historiques[i]._id})) {
							data.historiques.id(req.body.historiques[i]._id).remove();
						}
					} else
					if (req.body.historiques[i].statut==='I') {
                        data.prixRecent.prix = req.body.historiques[i].prix;
                        data.prixRecent.epicerie = req.body.historiques[i].epicerie;
						data.historiques.push({
							epicerieId: req.body.historiques[i].epicerieId,
							date: req.body.historiques[i].date,
							prix: req.body.historiques[i].prix,
							enPromotion: req.body.historiques[i].enPromotion
						});
					}
				}

			   /**
			   * Sort by most recent date and set prix
               */
				//	    data.historiques.sort(function(a,b) {
				//	    	return (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0);
				//	    });
				//	    data.prix = data.historiques[data.historiques.length-1];

			 	data.save(function(err,data){
					if (err) {console.log('Erreur ' + err);}
					Model.findOne( { _id: data.id })
                        .populate('marqueId')
						.populate('categorieId')
						.populate('uniteId')
						.populate('formatId')
						.populate('historiques.epicerieId')
						.populate({
							path:     'uniteId',
							populate: { path:  'coutParId',
								model: 'Unite' }
						})
						.exec(function(err, data) {
							if (err) {console.log('Erreur ' + err);}
							res.status(200).json(data);
							console.log('produit updateOne : ' + data);
						});
				});
		}
	);
};






