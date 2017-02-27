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
		required: "L'unité est obligatoire."
	},
	abreviation: {
		type: String,
        default: '',
		required: "L'abréviation de l'unité est obligatoire."
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
    }
});

UniteSchema.index({unite: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Unite', UniteSchema);