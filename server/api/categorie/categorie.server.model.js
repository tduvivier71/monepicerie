'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var CategorieSchema = new Schema({

	categorie: {
		type: String,
		default: '',
		trim: true,
        index: true,
		required: [true, 'La catégorie est obligatoire.']
	},

	favori : {
		type: Boolean,
		default: false
    },

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }

});

CategorieSchema.index({categorie: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Categorie', CategorieSchema);