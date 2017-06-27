'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'Schema'
var FormatSchema = new Schema({

	format: {
		type: String,
		default: '',
		trim: true,
        index: true,
        required: [true, 'Le format est obligatoire.'],
        maxlength: [50, 'La longueur maximale pour le format est de 50 caractères.']
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }

});

FormatSchema.index({format: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Format', FormatSchema);