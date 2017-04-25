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

	conditionnement : {

        quantite:{
            type: Number,
            default: '0'
        },

        format:{
        	type: String
		},

        nombre:{
            type: Number,
            default: '0'
        },

        unite:{
            type: String
        }
	},

    prixRecent: {

        prix:{
            type: Number,
            default: '0'
        },

        epicerie: {
            type: String,
            default: '',
            trim: true
        }
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

ProduitSchema.set('toJSON', { virtuals: true })

ProduitSchema.virtual('fullFormat').get(function() {

	if (!this.formatId || !this.formatId.format) {
        return '';
	}

    if (this.conditionnement && this.conditionnement.quantite ) {
        if (this.conditionnement.quantite === 0) {
            if (this.formatId.format === '') {
                return '';
            } else {
                return this.formatId.format.toLowerCase();
            }
        } else {
            return this.conditionnement.quantite + ' ' + this.formatId.format.toLowerCase();
		}
    }

    return '';

});

ProduitSchema.virtual('fullConditionnement').get(function() {

    if (this.fullFormat === '' && this.fullUnite !== '') {
        return this.fullUnite.toLowerCase();
    }

    if (this.fullFormat !== '' && this.fullUnite === '') {
        return this.fullFormat.toLowerCase();
    }

    if (this.fullFormat !== '' && this.fullUnite !== '') {
        return this.fullFormat.toLowerCase() + ' (' + this.fullUnite.toLowerCase() + ')';
    }

});

ProduitSchema.virtual('fullUnite').get(function() {

	if (!this.conditionnement.nombre) {
        return '';
	}

	if (this.conditionnement.nombre  !== 0 && this.uniteId && this.uniteId.abreviation) {
        return this.conditionnement.nombre + ' ' + this.uniteId.abreviation.toLowerCase();
    }

    return '';

});


//ProduitSchema.index({produit: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Produit', ProduitSchema);

