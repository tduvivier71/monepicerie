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

    favori : {
    	type: Boolean,
	default: false
	},
	creation:{
		creationdt: {
			type: Date,
			"default": Date.now
		}
	}
});

mongoose.model('Epicerie', EpicerieSchema);