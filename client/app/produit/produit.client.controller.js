(function () {

    'use strict';

    angular
        .module('app.produit')
        .controller('ProduitController', ProduitController)
        .filter('coutPar', coupPar);

    function coupPar() {
        return function(price, qtt, nb, operation, nombre, abr) {
            var x = null;
            if (!isNaN(price) && !isNaN(qtt)  && !isNaN(nb) && !isNaN(nombre) && operation!=='' && qtt > 0 && nb > 0 && nombre > 0)  {
                x = price / (nb * qtt);
                x = x / nombre;
            }
            return x.toFixed(7) + '/' + abr;
        };
    }

    ProduitController.$inject = ['$scope','$log', '$filter', '$location', '$http', '$q',
        'toasterService', 'produitService', 'categorieService', 'focus', 'uniteService', 'formatService', 'epicerieService','marqueService'];

    function ProduitController($scope, $log, $filter, $location, $http, $q,
                               toasterService, produitService, categorieService, focus, uniteService, formatService, epicerieService, marqueService) {

        var vm = this;

        vm.statutD = 'D';

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string
        vm.insertHisto = {};    // object;

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


        vm.selectOptionsMultiCategories = {
            placeholder: "Sélection de catégorie(s)...",
            dataTextField: "categorie",
            dataValueField: "_id",
            valuePrimitive: true,
            autoBind: false,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            dataSource: vm.categories
        };

        vm.selectOptionsMarque = {
            placeholder: "Sélectionnez une marque...",
            dataTextField: "marque",
            filter:"contains",
            dataSource: vm.marques,
            valuePrimitive: true,
            clearButton: true,
            ignoreCase: true,
            autoBind: true,
            delay: 50,
            noDataTemplate: vm.no_template
        };

        vm.selectOptionsCategorie = {
            placeholder: "Sélectionnez une catégorie...",
            dataTextField: "categorie",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: true,
            autoBind: false,
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
            valuePrimitive: true,
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
            valuePrimitive: true,
            autoBind: false,
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
            valuePrimitive: true,
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
            console.log('cancel');
            if (vm.state === 'dsInsert') {
                _cancelInsert();
            } else {
                _cancelEdit();
            }
        }

        function remove(_item) {
            console.log('remove');
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

        function save(_form, _item, _oneMore) {
            console.log('save');
            if (vm.state === 'dsInsert') {
                _create(_form, _item, _oneMore);
            } else {
                _update(_item);
            }
        }

        /**
         * Set edit state
         */
        function setEdit(_item) {
            console.log('setEdit');
            _resetForm();
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.state = 'dsEdit';
            focus('produit_focus');

            vm.insertHisto.epicerie = '';
            vm.insertHisto.epicerieId = '';
            vm.insertHisto.prix = 0;
            vm.insertHisto.date = new Date();
            vm.insertHisto.enPromotion = false;

        }

        /**
         * Set insert State
         */
        function setInsert() {
            console.log('setInsert');
            _resetForm();
            _resetItem();
            vm.state = 'dsInsert';
            focus('produit_focus');

            vm.insertHisto.epicerie = '';
            vm.insertHisto.epicerieId = '';
            vm.insertHisto.prix = 0;
            vm.insertHisto.date = new Date();
            vm.insertHisto.enPromotion = false;
        }

        /**
         * Create Histo
         * */
        function createHisto() {
            if (vm.insertHisto.date === null) {
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
            vm.insertHisto = {};  // ! TO DO
        }

        function deleteHisto(histo, $index) {
            //   if (histo.statut = 'I') {
            //       vm.item.historiques.splice($index,1)
            //   } else
            histo.statut = 'D';
            console.log('histo : ' + JSON.stringify(histo));
        }

        function getCategories() {
            console.log('getCategories');
            return categorieService.query();
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
            console.log('cancelEdit');
            _revertSelectedItem();
            _setBrowse();
        }

        function _cancelInsert() {
            console.log('_cancelInsert');
            _setBrowse();
        }

        function _create(_form, _item, _oneMore) {
            console.log('create');
            if (_form.$valid) {
                var item = new produitService();
                item.produit = _item.produit;
                item.marque = _item.marque;
                item.categorieId = _item.categorieId;
                item.formatId = _item.formatId === "" ? _item.formatId = undefined : _item.formatId;
                item.uniteId = _item.uniteId === "" ? _item.uniteId = undefined : _item.uniteId;
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
                            date: vm.insertHisto.date || new Date.now(),
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
                        if (_oneMore) {
                            _resetForm();
                            setInsert();
                        }
                        else {
                            _setBrowse();
                        }
                        vm.oneMore = false;
                    },
                    function (e) {
                        toasterService.error(e.data);
                        focus('produit_focus');
                    }
                );
            } else {
                focus('produit_focus');
            }
        }

        function _init() {
            focus('searchText');
            _setBrowse();
            _resetItem();
            vm.items = produitService.query();
            vm.categories = categorieService.query();
            vm.unites = uniteService.query();
            vm.formats = formatService.query();
            vm.epiceries = epicerieService.query();
            vm.marques = marqueService.query();
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

        function _resetItem() {
            //vm.item = {};
            vm.item = {
                produit: "",
                categorieId: "",
                marque: "",
                formatId: "",
                quantite: "",
                nombre: "",
                uniteId: "",
                description: "",
                historiques: []
            };
        }

        function _resetForm() {
            if (vm.form.$dirty || vm.form.$submitted) {
                vm.form.$setPristine();
                vm.form.$setUntouched();
            }
        }

        function _resetSearchItem() {
            vm.searchItem = '';
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
            console.log('_setBrowse');
            vm.enLot = false;
            vm.sorting.type = 'produit';
            vm.state = 'dsBrowse';
            vm.selectedItem = null;
            vm.form.$dirty = false;
            focus('searchItem_focus');
        }
    }

})();
