'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EpicerieSchema = new Schema({
	epicerie: {
		type: String,
		default: '',
		trim: true,
	    index: true,
        required: [true, "L'épicerie est obligatoire."],
        maxlength: [50, "La longueur maximale pour l'épicerie est de 50 caractères."]
	},

    adresse: {
        type: String,
        default: '',
        trim: true
    },

    favori : {
    	type: Boolean,
	    default: false
	},

	location : {
		lat: Number,
		lng: Number
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }

});

EpicerieSchema.index({epicerie: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Epicerie', EpicerieSchema);