(function () {

    'use strict';

    angular
        .module('app.liste')
        .controller('ListeController', ListeController);

    ListeController.$inject = ['$q', '$auth',
        'toasterService', 'focus', 'listeService', 'listeServiceDetail', 'categorieService',  'epicerieService','produitService'];

    function ListeController($q, $auth,
         toasterService, focus, listeService, listeServiceDetail, categorieService,  epicerieService, produitService) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
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

        vm.isCollapsed = false;

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.removeItem = removeItem;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;
        vm.createListeDetail = _createListeDetail;

        vm.filterCategorie = filterCategorie;
        vm.getCategories = getCategories;


        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        vm.isAuthenticated = function() {
            return $auth.isAuthenticated();
        };

        // ************************************************************************************************************/
        // Object configuration
        // ************************************************************************************************************/

        var attr_id;
        var attr_produit;
        var attr_marque;
        var attr_categorie;
        var attr_conditionnenent;
        var attr_note;
        var attr_prix;

        vm.sortableProduitsOptions = {
         //   cursor : 'none',
         //   scroll : false,
            placeholder: "app",
            connectWith: ".apps-container",
            'ui-floating': true,
            start: function (event, ui) {
                attr_id = ui.item.attr('id');
                attr_produit = ui.item.attr('data-produit');
                attr_marque = ui.item.attr('data-marque');
                attr_categorie = ui.item.attr('data-categorie');
                attr_conditionnenent = ui.item.attr('data-conditionnenent');
                attr_note = ui.item.attr('data-note');
                attr_prix = ui.item.attr('data-prix');
            }
        };

        vm.sortableItemsOptions = {
            placeholder: "app",
         //   connectWith: ".apps-container",
         //   'ui-floating': true,
            receive: function (event, ui) {
                _createListeDetail(vm.item._id, attr_id);
            },
        };

        vm.datePickerOptions = {
            format: "yyyy-MM-dd",
            parseFormats: ["yyyy-MM-ddTHH:mm:sszzz"]
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
                    vm.item.epicerie = this.text();
                }
            }
        };

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

        /**
         * Remove selected liste
         * @param {Object} _item
         */
        function remove(_item) {
            console.log('remove');
            _item.$remove(function () {
                toasterService.remove(_item.date);
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

        /**
         * Remove selected item form liste
         * @param {Object} _item
         * @param {Object} _itemDetail
         */
        function removeItem(_item, _itemDetail) {
            console.log('remove');
            var item = new listeServiceDetail();
            item.$deleteOneDetail({id:_item._id, id2: _itemDetail._id});
            for (var i in _item.listeDetail) {
                if (_item.listeDetail[i]._id === _itemDetail._id) {
                    _item.listeDetail.splice(i, 1);
                }
            }
            toasterService.remove(_itemDetail.produitId.produit);
        }

        /**
         * Save liste
         */
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
            vm.isCollapsed = true;
        }

        /**
         * Set insert State for new liste
         */
        function setInsert() {
            console.log('setInsert');
            _resetForm();
            _resetItem();
            vm.state = 'dsInsert';
            //TODO Focus ne fonctionne pas
            focus('epicerie_focus');
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
                var item = new listeService();
                item.date = _item.date;
                item.epicerieId = _item.epicerieId === "" ? _item.epicerieId = undefined : _item.epicerieId;
                item.$save(
                    function (result) {
                        vm.items.push(item);
                        toasterService.save(item.date);
                        if (_oneMore) {
                            _resetForm();
                            setInsert();
                        }
                        else {
                            vm.isCollapsed = true;
                        }
                        vm.item = result;
                        vm.oneMore = false;
                    },
                    function (e) {
                        toasterService.error(e.data);
                        focus('date_focus');
                    }
                );
            } else {
                focus('date_focus');
            }
        }

        function _createListeDetail(_id, _produitId) {
            var item = new listeServiceDetail();
            item._id = _id;
            item.produit = attr_produit;
            item.marque = attr_marque;
            item.categorie = attr_categorie;
            item.conditionnement = attr_conditionnenent;
            item.note = attr_note;
            item.$save(function (result) {
                    vm.item.listeDetail.push({
                        _id : result._id,
                        produit: attr_produit,
                        marque : attr_marque,
                        categorie : attr_categorie,
                        conditionnement : attr_conditionnenent,
                        note : attr_note
                    });
                    toasterService.save(attr_produit);
                }
            );
        }

        function _init() {
            focus('searchText');
            _setBrowse();
            _resetItem();
            vm.items = listeService.query();
            vm.produits = produitService.query();
            vm.categories = categorieService.query();
            vm.epiceries = epicerieService.query();
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
                            if (vm.item.epicerieId && vm.item.epicerieId.epicerie) {
                                vm.items[key].epicerieId.epicerie = vm.item.epicerieId.epicerie;
                            }
                        }
                    });
                    toasterService.update(result.date);
                    vm.isCollapsed = true;
                },
                function (e) {
                    toasterService.error(e.data);
                }
            );
        }

        function _resetItem() {
            for (var prop in  vm.item)
                { if ( vm.item.hasOwnProperty(prop)) {
                    delete  vm.item[prop];
                }
            }
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
        }

        function _setBrowse() {
            console.log('_setBrowse');
            vm.sorting.type = 'produit';
            vm.state = 'dsBrowse';
            vm.selectedItem = null;
            vm.form.$dirty = false;
            focus('searchItem_focus');
        }
    }

})();

