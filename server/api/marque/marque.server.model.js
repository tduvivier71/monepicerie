'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var MarqueSchema = new Schema({

	marque: {
		type: String,
		default: '',
		trim: true,
        index: true,
		required: [true, 'La marque est obligatoire.']
	},

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
		index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    } //,

 //   timestamps: true

});

MarqueSchema.index({marque: 1, utilisateurId: 1}, {unique: true});

mongoose.model('Marque', MarqueSchema);

MarqueSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('There was a duplicate key error'));
    }
});