(function () {

    'use strict';

    angular
        .module('app.liste')
        .controller('ListeController', ListeController);

    ListeController.$inject = ['$routeParams','$http','$q', '$auth',
        'toasterService', 'focus', 'listeService', 'listeServiceDetail',
        'categorieService',  'epicerieService','produitService'];

    function ListeController($routeParams, $http, $q, $auth,
         toasterService, focus, listeService, listeServiceDetail,
         categorieService,  epicerieService, produitService) {

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

        vm.input1_focus = 'date_input_focus';
        vm.isCollapsed = false;

        vm.search1Open = false;
        vm.search2Open = false;

        vm.toggle = true;

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

        vm.openSearch1 = openSearch1;
        vm.addCategorie = addCategorie;
        vm.categorieRemove = categorieRemove;
        vm.deleteAllDetail = deleteAllDetail;
        vm.chooseProduit = chooseProduit;

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
            valuePrimitive: false,
            autoBind: false,
            //  dataSource: vm.epiceries,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/epicerie')
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
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.epicerieId.epicerie = this.text();
                }
            }
        };

        vm.selectOptionsModele = {
            placeholder: "Sélectionnez un modèle...",
            dataTextField: "nom",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false, // false obligatoire car c est un objet
            autoBind: false, // obligatoire
            //   dataSource: vm.categories,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/listebase')
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
            noDataTemplate: 'Aucune correspondance',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.modele = this.text();
                }
            }
        };

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        vm.isAuthenticated = function() {
            return $auth.isAuthenticated();
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

        function chooseProduit(_produit, _item, _produits, _i) {
            _item.listeBaseDetail.push({
                produit_id: _produit._id,
                produit: _produit.produit,
                conditionnement: _produit.fullConditionnement,
                description: _produit.description,
                marque: (!_produit.marqueId)  ? "" : _produit.marqueId.marque,
                categorie: _produit.categorieId.categorie
            });

            _produits.splice(_i, 1);

        }

        function deleteAllDetail() {
            var i = vm.item.listeBaseDetail.length; //or 10
            while(i--) {
                vm.item.listeBaseDetail.splice(i, 1);
            }
            var item = new listeBaseServiceDetail();
            item.$deleteAllDetail({id: vm.item._id});
            vm.produits = produitService.query();
            toasterService.error('La liste a été vidée.');
        }

        function openSearch1() {
            vm.search1Open = true;
            focus('search1Item_focus');
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
            var item = new listServiceDetail();
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
            vm.item = {};
            vm.produits = produitService.query();
            focus(vm.input1_focus);
            _resetForm('dsInsert');
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

            var state = $routeParams.state;

            listeService.query('', function (result) {
                vm.items = result;
                if (state === 'insert') {
                    setInsert();
                } else {
                    _setBrowse();
                }
            });


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
                    vm.items[key] = vm.selectedItem;
                }
            });
            vm.selectedItem = null;
        }

        function _setBrowse() {
            focus('searchItem_input_focus');
            vm.sorting.type = 'date';
            _resetForm('dsBrowse');
        }
    }

})();

