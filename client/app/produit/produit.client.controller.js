/*
* Si valeur primitive = true mettre _id à la fin du k-ng-model
* Sinon ne pas le mettre
*
* */

(function () {

    'use strict';

    angular
        .module('app.produit')
        .controller('ProduitController', ProduitController)
        .filter('coutPar', coupPar);

    function coupPar() {
        return function(price, qtt, nb, operation, nombre, abr) {

            var x = 0;

            if (isNaN(price) || isNaN(qtt) || isNaN(nb) || isNaN(nombre) || operation==='') {
                return x;
            }

            if  (qtt <= 0 || nb <= 0 || nombre <= 0) {
                return x;
            }

            if (operation==='Divisé par') {
                x = price / (nb * qtt);
                x = x / nombre;
            }

            if (operation==='Multiplié par') {
                x = price / (nb * qtt);
                x = x * nombre;
            }

            return x.toFixed(7) + '/' + abr;
        };
    }

    ProduitController.$inject = ['$scope','$log', '$filter', '$location', '$http', '$q', '$sce',
        'toasterService', 'produitService', 'categorieService', 'focus', 'uniteService', 'formatService', 'epicerieService','marqueService'];

    function ProduitController($scope, $log, $filter, $location, $http, $q, $sce,
                               toasterService, produitService, categorieService, focus, uniteService, formatService, epicerieService, marqueService) {

        var vm = this

        /**
         * typedef {Object}
         * @property
         * @property
         * @function reset
         */
        vm.insertHisto = {
            epicerieId: '',
            date: '',
            prix: 0,
            enPromotion: false,
            reset : function() {
                this.epicerieId = '';
                this.marque = '';
                this.prix = 0;
                this.enPromotion = false;
            }
        };



    //    historiques: [vm.itemHistorique],

        vm.item = {
            produit: '',
            marque: '',
            formatId: '',
            description: '',
            categorieId: '',
            quantite: 0,
            nombre: 0,
            prix: 0,
            uniteId: '',
            historiques: [],
            reset : function() {
                this.produit = '';
                this.marque = '';
                this.formatId = '';
                this.description = '';
                this.categorieId = '';
                this.quantite =  0;
                this.nombre = 0;
                this.prix = 0;
                this.uniteId = '';
                this.historiques = [];
            }
        };

        //       this.historiques = [];


        vm.statutD = 'D';
        vm.addHisto = false;

        /* Variables */
        vm.form = {};           // Object

        vm.items = [];          // List of object
        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string

        vm.categories = [];     // List of object
        vm.selectedCategories = [];
        vm.unites = [];
        vm.marques = [];      // List of object

        vm.sorting = {
            type: 'produit',
            reverse: false
        };

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

        vm.addNewMarque = _addNewMarque;

        vm.createHisto = createHisto;
        vm.deleteHisto = deleteHisto;

        vm.filterCategorie = filterCategorie;
        vm.getCategories = getCategories;
        vm.clearCategorie = clearCategorie;
        vm.collapse = collapse;

        vm.isCollapsed = true;

        vm.tips = $sce.trustAsHtml('Réinitialiser </br> la sélection');



        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        // ************************************************************************************************************/
        // Object configuration
        // ************************************************************************************************************/

        vm.datePickerOptions = {
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy-MM-ddTHH:mm:sszzz"]
        };

        vm.no_template1 = "<div>Aucune correspondance. Voulez-vous ajouter  <i>'#: instance.element.val() #'</i> ?</div><br/>";
      //  vm.no_template2 = "class='k-button' onClick=" +  '"vm.addNewMarque('  + "'#: instance.element[0].id #', '#: instance.element.val() #')" + '"';
         vm.no_template2 = "class='k-button' ng-click=" +  '"vm.addNewMarque()"' ;
     //   vm.no_template2 = "class='k-button' onClick=" +  '"vm.addNewMarque('  + "'#: vm.instance.element.val() #')" + '"';
        vm.no_template  = vm.no_template1 + "<button " + vm.no_template2 + ">Ajouter</button>";


        /** MULTI CATÉGORIE !!!! **/
        vm.selectOptionsMultiCategories = {
            placeholder: "Sélection de catégorie(s)...",
            dataTextField: "categorie",
            dataValueField: "_id",
            valuePrimitive: true, // true obligatoire
            autoBind: false,
            delay: 50,
            clearButton: false,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            dataSource: vm.categories,
            change: function () {
                vm.filterCategorie();
            }
        };

        vm.selectOptionsMarque = {
            placeholder: "Sélectionnez une marque...",
            dataTextField: "marque",
            dataValueField: "marque",
            filter:"contains",
            dataSource: vm.marques,
            valuePrimitive: true, //  true obligatoire, n'est pas un objet
            autoBind: false, //
            clearButton: true,
            ignoreCase: true,
            delay: 50,
            noDataTemplate: vm.no_template,
            suggest: true,
            highlightFirst: true
        };

        vm.selectOptionsCategorie = {
            placeholder: "Sélectionnez une catégorie...",
            dataTextField: "categorie",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false, // obligatoire
            dataSource: vm.categories,
            clearButton: false,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.categorieId.categorie = this.text();
                }
            }
        };

        vm.selectOptionsFormat = {
            placeholder: "Sélectionnez un format...",
            dataTextField: "format",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false,
            dataSource: vm.formats,
            clearButton: true,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.formatId.format = this.text();
                }
            }
        };

        vm.selectOptionsUnite = {
            placeholder: "Sélectionnez une unité...",
            dataTextField: "unite",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false, //!Important
            dataSource: vm.unites,
            clearButton: true,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.uniteId.unite = this.text();
                }
            }
        };

        vm.selectOptionsEpicerie = {
            placeholder: "Sélectionnez une épicerie...",
            dataTextField: "epicerie",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false,
            autoBind: false,
            dataSource: vm.epiceries,
            clearButton: true,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.insertHisto.epicerie = this.text();
                }
            }
        };

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        /**
         * Cancel edit/insert
         */
        function cancel() {
            if (vm.state === 'dsInsert') {
                _cancelInsert();
            } else {
                _cancelEdit();
            }
        }

        function collapse() {
            vm.isCollapsed = !vm.isCollapsed;
            if (!vm.isCollapsed) {
                focus("description_textArea_focus");
            }
        }

        function remove(_item) {
            _item.$remove(function () {
                toasterService.remove(_item.produit);
                for (var i in vm.items) {
                    if (vm.items[i] === _item) {
                        vm.items.splice(i, 1);
                    }
                }
            }, function (e) {
                toasterService.error(e.data);
            });
            _setBrowse();
        }

        function save(_form, _item) {
            if (vm.addHisto) {
                vm.addHisto = false;
                vm.form.prix_input.$setValidity("required",true);
                vm.form.epicerieId_select.$setValidity("required",true);
            }

            if (!_form.$valid) {
                 focus('produit_input_focus');
                 return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        /**
         * Set edit state
         */
        function setEdit(_item) {
            focus('produit_input_focus');
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
        }

        /**
         * Set insert State
         */
        function setInsert() {
            vm.item.reset();
            vm.isCollapsed = true;
            focus('produit_input_focus');
            _resetForm('dsInsert');
           // vm.insertHisto.reset();
        }

        /**
         * Create Histo
         * */
        function createHisto() {

            vm.addHisto = true;

            if (vm.insertHisto.prix &&  vm.insertHisto.epicerieId) {

                if (vm.insertHisto.date === "") {
                    vm.insertHisto.date = moment();
                }
                else {
                    vm.insertHisto.date = moment(vm.insertHisto.date);
                }

                vm.item.historiques.push(
                    {
                        epicerieId: vm.insertHisto.epicerieId,
                        epicerie: vm.insertHisto.epicerie,
                        date: vm.insertHisto.date,
                        prix: vm.insertHisto.prix,
                        enPromotion: vm.insertHisto.enPromotion,
                        statut: 'I'
                    }
                );
            }
        }

        function deleteHisto(histo, $index) {
            //   if (histo.statut = 'I') {
            //       vm.item.historiques.splice($index,1)
            //   } else
            vm.addHisto = false;
            histo.statut = 'D';
            console.log('histo : ' + JSON.stringify(histo));
        }

        function getCategories() {
            return categorieService.query();
        }

        function clearCategorie() {
            vm.selectedCategories.length = 0;
            filterCategorie();
        }

        function filterCategorie() {
            var queryParam = {catId: vm.selectedCategories};
            vm.items = produitService.query(queryParam);
        }


        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _addNewMarque() {
            var value = vm.marqueWidget.value();
            try {
                if (value) {
                    var item = new marqueService();
                    item.marque = value;
                    item.$save(
                        function () {
                            vm.items.push(item);
                            toasterService.save(value);
                        },
                        function (e) {
                            toasterService.error(e.data);
                        }
                    );
                }
            } finally {
                vm.marqueWidget.close();
            }
        }

        function _cancelEdit() {
            _revertSelectedItem();
            _setBrowse();
        }

        function _cancelInsert() {
            _setBrowse();
        }

        function _create(_item) {
            vm.addHisto = false;
            var item = new produitService();
            item.produit = _item.produit;
            item.marque = _item.marque;
            item.categorieId = _item.categorieId._id;
            item.formatId = _item.formatId === "" ? _item.formatId = undefined : _item.formatId;
            item.uniteId = _item.uniteId === "" ? _item.uniteId = undefined : _item.uniteId._id; // Important : _item.uniteId._id
            item.quantite = _item.quantite;
            item.nombre = _item.nombre;
            item.description = _item.description;
            item.enPromotion = _item.enPromotion;
            item.historiques = [];

            if (vm.insertHisto.epicerieId) {
                item.historiques.push(
                    {
                        epicerieId: vm.insertHisto.epicerieId,
                        epicerie: vm.insertHisto.epicerie,
                        date: vm.insertHisto.date ||  moment(),
                        prix: vm.insertHisto.prix || 0,
                        enPromotion: vm.insertHisto.enPromotion || false,
                        statut: 'I'
                    }
                );
            }

            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(item.produit);
                    _setBrowse();
                },
                function (e) {
                    toasterService.error(e.data);
                    focus('produit_input_focus');
                }
            );

        }

        function _init() {
            vm.item.reset();
            vm.insertHisto.reset();
            vm.items = produitService.query();
            vm.categories = categorieService.query();
            vm.unites = uniteService.query();
            vm.formats = formatService.query();
            vm.epiceries = epicerieService.query();
            vm.marques = marqueService.query();
            _setBrowse();
            vm.loadTags = function () {
                var deferred = $q.defer();
                deferred.resolve(vm.categories);
                return deferred.promise;
            };
        }

        function _update(_item) {
            _item.$update(
                function (result) {
                    angular.forEach(vm.items, function (item, key) {
                        if (item._id === _item._id) {
                            vm.items[key].categorieId.categorie = vm.item.categorieId.categorie;
                            if (vm.item.formatId && vm.item.formatId.format) {
                                vm.items[key].formatId.format = vm.item.formatId.format;
                            }
                            if (vm.item.uniteId && vm.item.uniteId.unite) {
                                vm.items[key].uniteId.unite = vm.item.uniteId.unite;
                            }
                        }
                    });
                    toasterService.update(result.produit);
                    _setBrowse();
                },
                function (e) {
                    toasterService.error(e.data);
                }
            );
        }

        function _resetForm(state) {
            vm.state = state;
            if (vm.form.$dirty || vm.form.$submitted) {
                vm.form.$setPristine();
                vm.form.$setUntouched();
            }
        }

        function _revertSelectedItem() {
            angular.forEach(vm.items, function (item, key) {
                if (item._id === vm.selectedItem._id) {
                    vm.items[key].produit = vm.selectedItem.produit;
                }
            });
            vm.selectedItem = null;
        }

        function _setBrowse() {
            focus('searchItem_input_focus');
            vm.sorting.type = 'produit';
            _resetForm('dsBrowse');
            vm.state = 'dsBrowse';
        }
    }

})();

