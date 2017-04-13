'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListeDetailSchema = new Schema({
    produit: {
        type: String,
        default: '',
        trim: true
    },
    marque: {
        type: String,
        default: '',
        trim: true
    },
    categorie: {
        type: String,
        default: '',
        trim: true
    },
    conditionnement: {
        type: String,
        default: '',
        trim: true
    },
    note: {
        type: String,
        default: '',
        trim: true
    },
    produitId: {
        type: Schema.Types.ObjectId,
        ref: 'Produit'
    }
});

mongoose.model('ListeDetail', ListeDetailSchema);

// Define a new 'Schema'
var ListeSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    epicerieId: {
        type: Schema.Types.ObjectId,
        ref: 'Epicerie'
    },
    modeleId: {
        type: Schema.Types.ObjectId,
        ref: 'ListeBase'
    },
    listeDetail: [ListeDetailSchema]
});

mongoose.model('Liste', ListeSchema);