'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ListeBaseDetailSchema = new Schema({
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

mongoose.model('ListeBaseDetail', ListeBaseDetailSchema);

var ListeBaseSchema = new Schema({

    nom: {
        type: String,
        default: '',
        trim: true
    },
    epicerieId: {
        type: Schema.Types.ObjectId,
        ref: 'Epicerie'
    },
    listeBaseDetail: [ListeBaseDetailSchema]
});

mongoose.model('ListeBase', ListeBaseSchema);