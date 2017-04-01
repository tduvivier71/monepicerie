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
        index: true,
		required: 'Le produit est obligatoire.'
	},
    marqueId: {
        type: Schema.Types.ObjectId,
        ref: 'Marque'
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

    // dernier prix
	prix:{
		 type: Number,
		 default: '0'
    },

    // derniere epicerie
	epicerie: {
        type: String,
        default: '',
        trim: true
    },

	uniteId:{
		type: Schema.Types.ObjectId,
		ref: 'Unite'
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
    },

	historiques: [ProduitHistoriqueSchema]

});

function getPrix(num){
	return (num/100).toFixed(2);
}

function setPrix(num){
	return num*100;
}

ProduitSchema.set('toJSON', { virtuals: true })



ProduitSchema.virtual('fullFormat').get(function() {

    if (this.nombre  === 0 && this.formatId.format === '') {
        return '';
    }

    if (this.nombre === 0 && this.formatId.format !== '') {
        return '1 ' + this.formatId.format;
    }

    return this.nombre + ' ' + this.formatId.format;

});

ProduitSchema.virtual('fullUnite').get(function() {

	if (this.quantite  === 0 ) {
		return '';
	}

    return this.quantite + ' ' + this.uniteId.abreviation;
});

ProduitSchema.virtual('fullConditionnement').get(function() {

    if (this.fullFormat === '' && this.fullUnite !== '') {
        return this.fullUnite;
    }

    if (this.fullFormat !== '' && this.fullUnite === '') {
        return this.fullFormat;
    }

	if (this.fullFormat !== '' && this.fullUnite !== '') {
        return this.fullFormat + ' (' + this.fullUnite + ')';
    }

});



ProduitSchema.index({produit: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Produit', ProduitSchema);

