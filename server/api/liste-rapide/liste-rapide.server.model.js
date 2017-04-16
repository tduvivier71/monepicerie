'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ListeRapideSchema = new Schema({
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
    produitId: {
        type: Schema.Types.ObjectId,
        ref: 'Produit'
    },
    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    }
});

ListeRapideSchema.index({produit: 1, utilisateurId: 1}, {unique: true});

mongoose.model('ListeRapide', ListeRapideSchema);