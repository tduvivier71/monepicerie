'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MarqueSchema = new Schema({
	marque: {
		type: String,
		default: '',
		trim: true,
		unique: true,
		required: 'Le nom est obligatoire.'
	}

	/*,
	creation:{
		creationdt: {
			type: Date,
			"default": Date.now
		}
	} */


});

mongoose.model('Marque', MarqueSchema);