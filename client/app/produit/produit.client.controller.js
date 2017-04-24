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

            if (isNaN(price) || isNaN(qtt) || isNaN(nb) || operation==='' || qtt <= 0 || nb <= 0) {
                return x;
            }

            if (operation==='aucune') {
                x = price / (nb * qtt);
                return x.toFixed(7)  + '/' + abr;
            }

            if (isNaN(nombre) || nombre <= 0) {
                return x;
            }

            if (operation==='division') {
                x = price / (nb * qtt);
                x = x / nombre;
            }

            if (operation==='multiplication') {
                x = price / (nb * qtt);
                x = x * nombre;
            }

            return x.toFixed(7) + '/' + abr;
        };
    }

    ProduitController.$inject = ['$scope','$log', '$filter', '$location', '$http', '$q', '$sce',
        'toasterService', 'produitService', 'categorieService', 'focus', 'uniteService', 'formatService', 'epicerieService','marqueService','helperService'];

    function ProduitController($scope, $log, $filter, $location, $http, $q, $sce,
                               toasterService, produitService, categorieService, focus, uniteService, formatService, epicerieService, marqueService, helperService) {

        var vm = this

        vm.focusSearch = 'searchItem_input_focus';
        vm.focusItem = 'produit_input_focus';
        vm.focusDescription = 'description_textArea_focus';
        vm.sortingItem = 'produit';

        /* Variables */
        vm.item = {};
        vm.items = [];          // List of object
        vm.form = {};           // Object
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.sorting = {
            type: '',
            reverse: false
        };


        vm.insertHisto = {};
        vm.statutD = 'D';
        vm.addHisto = false;
        vm.categories = [];     // List of object
        vm.selectedCategories = [];
        vm.unites = [];
        vm.marques = [];      // List of object


        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

        vm.addNewMarque = _addNewMarque;
        vm.addNewCategorie = _addNewCategorie;
        vm.addNewFormat = _addNewFormat;

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

        vm.no_template1 = "<div>Aucune correspondance. Voulez-vous ajouter  <i>'#: instance.text() #'</i> ?</div><br/>";

        vm.no_template2 = "class='k-button' ng-click=" +  '"vm.addNewMarque()"' ;
        vm.no_template  = vm.no_template1 + "<button " + vm.no_template2 + ">Ajouter</button>";

        vm.no_templateCat1 = "class='k-button' ng-click=" +  '"vm.addNewCategorie()"' ;
        vm.no_templateCat2 = vm.no_template1 + "<button " + vm.no_templateCat1 + ">Ajouter</button>";

        vm.no_templateFor1 = "class='k-button' ng-click=" +  '"vm.addNewFormat()"' ;
        vm.no_templateFor2 = vm.no_template1 + "<button " + vm.no_templateFor1 + ">Ajouter</button>";


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
            dataValueField: "_id",
            filter:"contains",
         //   dataSource: vm.marques,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/marque')
                            .then(function success(response) {
                                e.success(response.data);
                            }, function error(response) {
                                alert('something went wrong')
                                console.log(response);
                            });
                    }
                }
            },

            valuePrimitive: false, //
            autoBind: false, //
            clearButton: true,
            ignoreCase: true,
            delay: 50,
            noDataTemplate: vm.no_template,
            suggest: true,
            highlightFirst: true// ,
            // change : function(e) {
            //     if (this.select() < 0) {
            //         this.value("");
            //     }
            //     else {
            //         vm.item.marqueId.marque  = this.text();
            //     }
            // }
        };

        vm.selectOptionsCategorie = {
            placeholder: "Sélectionnez une catégorie...",
            dataTextField: "categorie",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false, // obligatoire
         //   dataSource: vm.categories,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/categorie')
                            .then(function success(response) {
                                e.success(response.data);
                            }, function error(response) {
                                alert('something went wrong')
                                console.log(response);
                            });
                    }
                }
            },
            clearButton: false,
            delay: 50,
            noDataTemplate: vm.no_templateCat2,
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
            //dataSource: vm.formats,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/format')
                            .then(function success(response) {
                                e.success(response.data);
                            }, function error(response) {
                                alert('something went wrong')
                                console.log(response);
                            });
                    }
                }
            },
            clearButton: true,
            delay: 50,
            noDataTemplate: vm.no_templateFor2,
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
          //  filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false, //!Important
            dataSource: vm.unites,
            clearButton: true,
            delay: 50
          //  noDataTemplate: 'Aucune correspondance...',
          //  suggest: true,
           // highlightFirst: true
            // ,
            // change : function(e) {
            //     if (this.select() < 0) {
            //         this.value("");
            //     }
            //     else {
            //         vm.item.uniteId.unite = this.text();
            //     }
            // }
        };

        vm.selectOptionsEpicerie = {
            placeholder: "Sélectionnez une épicerie...",
            dataTextField: "epicerie",
            dataValueField: "_id",
          //  filter:"contains",
            valuePrimitive: false,
            autoBind: false,
            dataSource: vm.epiceries,
            clearButton: true,
            delay: 50,
            noDataTemplate: 'Aucune correspondance...',
            //suggest: true,
            // highlightFirst: true
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
                focus(vm.focusDescription);
            }
        }

        function remove(_item, _i) {
            _item.$remove(function () {
                toasterService.remove(_item.produit);
                vm.items.splice(_i, 1);
            }, function (e) {
                toasterService.error(e.data.message);
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
                 focus(vm.focusItem);
                 return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            focus(vm.focusItem);
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.insertHisto = {};
        }

        function setInsert() {
            vm.item = {};
            vm.insertHisto = {}; // to do do better
            vm.isCollapsed = true;
            focus(vm.focusItem);
            _resetForm('dsInsert');


            $http.get('/api/epicerie/favori')
                .then(function success(response) {
                    vm.item = {
                        date :  moment().toDate(),
                        epicerieId: response.data ? response.data.id : null
                    };

                    if (response.data) {
                        vm.epicerieWidget.value(response.data.epicerie);
                    }

                }, function error(response) {
                    alert('something went wrong')
                    console.log(response);
                });
        }

        function createHisto() {

            vm.addHisto = true;

            if (vm.insertHisto.prix &&  vm.insertHisto.epicerieId) {

                if (vm.insertHisto.date === "") {
                    vm.insertHisto.date = moment();
                }
                else {
                    vm.insertHisto.date = moment(vm.insertHisto.date);
                }

                if (!vm.item.historiques) {
                    vm.item.historiques = [];
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
            vm.addHisto = false;
            histo.statut = 'D';
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
            var value = vm.marqueWidget.text();
            try {
                if (value) {
                    var item = new marqueService();
                    item.marque = value;
                    item.$save(
                        function () {
                            vm.marqueWidget.dataSource.read();
                            toasterService.save(value);
                        },
                        function (e) {
                            toasterService.error(e.data.message);
                        }
                    );
                }
            } finally {
                vm.marqueWidget.close();
            }
        }

        function _addNewCategorie() {
            var value = vm.categorieWidget.text();
            try {
                if (value) {
                    var item = new categorieService();
                    item.categorie = value;
                    item.$save(
                        function () {
                            vm.categorieWidget.dataSource.read();
                            toasterService.save(value);
                        },
                        function (e) {
                            toasterService.error(e.data.message);
                        }
                    );
                }
            } finally {
                vm.categorieWidget.close();
            }
        }

        function _addNewFormat() {
            var value = vm.formatWidget.text();
            try {
                if (value) {
                    var item = new formatService();
                    item.format = value;
                    item.$save(
                        function () {
                            vm.formatWidget.dataSource.read();
                            toasterService.save(value);
                        },
                        function (e) {
                            toasterService.error(e.data.message);
                        }
                    );
                }
            } finally {
                vm.formatWidget.close();
            }
        }


        function _cancelEdit() {
            helperService.revertSelectedItem(vm.items, vm.selectedItem);
            _setBrowse();
        }

        function _cancelInsert() {
            _setBrowse();
        }

        function _create(_item) {
            vm.addHisto = false;
            var item = new produitService();
            item.produit = _item.produit;
            item.marqueId = _item.marqueId === "" ? _item.marqueId = undefined : _item.marqueId;
            item.categorieId = _item.categorieId === "" ? _item.categorieId = undefined : _item.categorieId;
            item.formatId = _item.formatId === "" ? _item.formatId = undefined : _item.formatId;
            item.uniteId = _item.uniteId === "" ? _item.uniteId = undefined : _item.uniteId; // Important : _item.uniteId._id
            item.conditionnement = {
                quantite : _item.conditionnement.quantite,
                nombre : _item.conditionnement.nombre
            };
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
                    toasterService.error(e.data.message);
                    focus(vm.focusItem);
                }
            );

        }

        function _init() {

            produitService.query('', function (result) {
                vm.items = result;
                _setBrowse();
            });

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
                    focus(vm.focusItem);
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

        function _setBrowse() {
            focus(vm.focusSearch);
            vm.sorting.type = vm.sortingItem;
            _resetForm('dsBrowse');
        }
    }

})();

