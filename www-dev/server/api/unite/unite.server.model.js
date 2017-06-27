'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UniteSchema = new Schema({
	unite: {
		type: String,
		default: '',
		trim: true,
        index: true,
		required: [true, "L'unité est obligatoire."],
        maxlength: [50, "La longueur maximale de l'unité est de 50 caractères."]
	},
	abreviation: {
		type: String,
        default: '',
		required: [true, "L'abréviation de l'unité est obligatoire."],
        maxlength: [5, "La longueur maximale de l'abréviation est de 5 caractères."]
	},
	operation: {
		type: String,
		default: 'aucune',
	},
	nombre: {
		type: Number,
        default: 0,
	},
	coutParId:{
		type: Schema.Types.ObjectId,
		ref: 'Unite'
	},
    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }
});

UniteSchema.index({unite: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Unite', UniteSchema);