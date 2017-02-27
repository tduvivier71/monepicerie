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
		required: 'Le format est obligatoire.'
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
    }

});

FormatSchema.index({format: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Format', FormatSchema);