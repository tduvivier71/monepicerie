'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var UniteSchema = new Schema({
	unite: {
		type: String,
		default: '',
		trim: true,
		unique: true,
		required: "L'unité est obligatoire."
	},
	abreviation: {
		type: String,
		required: "L'abréviation de l'unité est obligatoire."
	},
	operation: {
		type: String,
		default: 'division',
	},
	nombre: {
		type: Number
	},
	coutParId:{
		type: Schema.Types.ObjectId,
		ref: 'Unite'
	}
});

mongoose.model('Unite', UniteSchema);