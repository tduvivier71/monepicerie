'use strict';

var mongoose = require('mongoose'),
	helpers = require('../shared/helpers.server.controller.js'),
	Model = mongoose.model('Produit'), // MODIFY
    SubModel = mongoose.model('ProduitHistorique'),
	CategorieModel =  mongoose.model('Categorie'), // MODIFY
	url = require('url'); // MODIFY


exports.findOne = function(req, res) {
	Model.findOne( { _id: req.params.id })
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

exports.find = function(req, res) {

	var filter = {};

	if(req.query) {
		if (req.query.hasOwnProperty('catId')) {
			filter = { categorieId : { $in: req.query.catId} };
		} else {
			if (req.query.hasOwnProperty('prodId')) {
				filter = { _id : { $in: req.query.prodId} };
			}
		}
	}

	Model.find( filter )
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
		produit: req.body.produit, // A MODIFIER
		marque: req.body.marque, // A MODIFIER
		categorieId: req.body.categorieId, // A MODIFIER
		description: req.body.description,
		formatId: req.body.formatId,
		quantite: req.body.quantite, // A MODIFIER
		nombre: req.body.nombre, // A MODIFIER
	 	uniteId: req.body.uniteId // A MODIDIFIER
	});

	for (var i=0; i< req.body.historiques.length; ++i) {
		data.prix = req.body.historiques[i].prix;
        data.epicerie = req.body.historiques[i].epicerie;
		data.historiques.push({
			epicerieId: req.body.historiques[i].epicerieId,
			date: req.body.historiques[i].date,
			prix: req.body.historiques[i].prix,
			enPromotion: req.body.historiques[i].enPromotion // A MODIFIER
		});
	}

	data.save(function(err, data) {
		if (err) {return	res.status(400).json(err);}
		// use findOne for re-populate
		Model.findOne( { _id: data.id })
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
			    data.marque = req.body.marque; // A MODIFIER
			    data.categorieId = req.body.categorieId; // A MODIFIER
			    data.uniteId = req.body.uniteId; // A MODIFIER
			 	data.formatId = req.body.formatId; // A MODIFIER
			    data.quantite = req.body.quantite; // A MODIFIER
				data.nombre = req.body.nombre; // A MODIFIER
			    data.enPromotion =  req.body.enPromotion; // A MODIFIER

			    data.description = req.body.description; // A MODIFIER

			 	for (var i=0; i< req.body.historiques.length; ++i) {

					if (req.body.historiques[i].statut==='D') {
						if (SubModel.findOne({_id: req.body.historiques[i]._id})) {
							data.historiques.id(req.body.historiques[i]._id).remove();
						}
					} else
					if (req.body.historiques[i].statut==='I') {
                        data.prix = req.body.historiques[i].prix;
                        data.epicerie = req.body.historiques[i].epicerie;
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






