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
        trim: true,
        index: true,
        required: [true, 'Le nom de la liste est obligatoire.'],
        maxlength: [50, 'La longueur maximale pour le nom de la liste est de 50 caractères.']
    },

    epicerieId: {
        type: Schema.Types.ObjectId,
        ref: 'Epicerie'
    },

    utilisateurId: {
        type: Schema.ObjectId,
        ref: 'Utilisateur',
        index: true,
        required: [true, 'Un utilisateur est obligatoire.']
    },

    listeBaseDetail: [ListeBaseDetailSchema]
});

ListeBaseSchema.index({nom: 1, utilisateurId: 1}, {unique: true});

mongoose.model('ListeBase', ListeBaseSchema);