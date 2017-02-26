'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'Schema'
var CategorieSchema = new Schema({
	categorie: {
		type: String,
		default: '',
		trim: true,
		unique: true,
		required: 'La catégorie est obligatoire.'
	},
	favori : {
		type: Boolean,
		default: false
    },
    utilisateurId: {
		type: Schema.ObjectId,
		ref: 'Utilisateur'
    }

});

mongoose.model('Categorie', CategorieSchema);