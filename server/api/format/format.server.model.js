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
	//	unique: true,
		required: 'Le format est obligatoire.'
	},
	creation:{
		creationdt: {
			type: Date,
			"default": Date.now
		}//,
	//	utilisateurid: {
	//		type: Schema.ObjectId,
	//		ref: 'Utilisateur'
	//	}
	}
});

mongoose.model('Format', FormatSchema);