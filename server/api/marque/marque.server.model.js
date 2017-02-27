'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MarqueSchema = new Schema({

	marque: {
		type: String,
		default: '',
		trim: true,
        index: true,
		required: 'La marque est obligatoire.'
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true
    }

});

MarqueSchema.index({marque: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Marque', MarqueSchema);