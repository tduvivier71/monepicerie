'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EpicerieSchema = new Schema({
	epicerie: {
		type: String,
		default: '',
		trim: true,
	    index: true,
		required: 'Le nom est obligatoire.'
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
        required: 'utilisateurId est obligatoire.'
    }

});

EpicerieSchema.index({epicerie: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Epicerie', EpicerieSchema);