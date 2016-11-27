'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProduitHistoriqueSchema = new Schema({

	epicerieId : {type: Schema.Types.ObjectId,
			   	  ref: 'Epicerie'},
	date : { type : Date,
			 default : Date.now()},
	prix : { type : Number,
			 default : 0},
	enPromotion:{
		type: Boolean,
		default: false
	}
});

mongoose.model('ProduitHistorique', ProduitHistoriqueSchema); 

// Define a new 'Schema'
var ProduitSchema = new Schema({
	produit: {
		type: String,
		default: '',
		trim: true,
		// unique: true,
		required: 'Le produit est obligatoire.'
	},
	marque: {
		type: String,
		default: '',
		trim: true
	},
	formatId: {
		type: Schema.Types.ObjectId,
		ref: 'Format'
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	categorieId:{
		type: Schema.Types.ObjectId,
		ref: 'Categorie',
		required: 'La catégorie est obligatoire.'
	},
	quantite:{
		type: Number,
		default: '0'
	},
	nombre:{
		type: Number,
		default: '0'
	},
	prix:{
		type: Number,
		default: '0'
	},
	uniteId:{
		type: Schema.Types.ObjectId,
		ref: 'Unite'
	},
	historiques: [ProduitHistoriqueSchema]

	/*historiques: [ {epicerie:
						{type : String,
					  	 trim: true}
				   },
				   {prix:
						{type: Number}
				   },
				   {date : { type : Date,
						default : Date.now()}
				   }]*/

});

function getPrix(num){
	return (num/100).toFixed(2);
}

function setPrix(num){
	return num*100;
}

mongoose.model('Produit', ProduitSchema);