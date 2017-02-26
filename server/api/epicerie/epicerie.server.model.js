'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var EpicerieSchema = new Schema({
	epicerie: {
		type: String,
		default: '',
		trim: true,
	//	unique: true,
		required: 'Le nom est obligatoire.'
	},

    adresse: {
        type: String,
        default: '',
        trim: true
    },

    // lieu: {
    //     type: String,
    //     default: '',
    //     trim: true
    // },

    favori : {
    	type: Boolean,
	    default: false
	},

    // latitude : {
    //     type: Number,
    //     default: 0
    // },
    //
    // longitude : {
    //     type: Number,
    //     default: 0
    // },

	location : {
		lat: Number,
		lng: Number
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur'
    }

});

mongoose.model('Epicerie', EpicerieSchema);