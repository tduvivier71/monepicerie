'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MarqueSchema = new Schema({

	marque: {
		type: String,
		default: '',
		trim: true,
        index: true,
        required: [true, 'La marque est obligatoire.'],
        maxlength: [50, 'La longueur maximale pour la marque est de 50 caractères.']
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
		index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }

});

MarqueSchema.index({marque: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Marque', MarqueSchema);

