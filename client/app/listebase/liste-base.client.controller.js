(function () {

    'use strict';

    angular
        .module('app.listeBase')
        .controller('ListeBaseController', ListeBaseController);

    ListeBaseController.$inject = ['$log', '$auth', '$routeParams',
        'listeBaseService', 'listeBaseServiceDetail', 'toasterService','focus',
        'categorieService',  'epicerieService','produitService'];

    function ListeBaseController($log, $auth, $routeParams,
        listeBaseService, listeBaseServiceDetail, toasterService, focus,
        categorieService,  epicerieService, produitService) {

        var vm = this;

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object

        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string

        vm.sorting = {
            type: 'categorie',
            reverse: false
        };

        vm.input1_focus = 'nom_input_focus';
        vm.isCollapsed = false;

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.removeItem = removeItem;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

        var attr_id;
        var attr_produit;
        var attr_produit_id;
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
                attr_produit_id = ui.item.attr('data-produit_id');
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
        // Entry point function
        // ************************************************************************************************************/

        _init();

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

        function remove(_item) {
            _item.$remove(function () {
                toasterService.remove(_item.nom);
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

            var item = new listeBaseServiceDetail();

            item.$deleteOneDetail({id: _item._id, id2: _itemDetail._id});

            for (var i in _item.listeBaseDetail) {
                if (_item.listeBaseDetail[i]._id === _itemDetail._id) {
                    _item.listeBaseDetail.splice(i, 1);
                }
            }

            toasterService.remove(_itemDetail.produit);
        }

        function save(_form, _item) {
            if (!_form.$valid) {
                focus(vm.input1_focus);
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            focus(vm.input1_focus);
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.isCollapsed = true;

            var ids = [];

            vm.item.listeBaseDetail.forEach(function(element) {
                ids.push(element.produitId);
            });

            var queryParam = {listeIds: ids };
            vm.produits = produitService.query(queryParam);

        }

        function setInsert() {
            vm.item = {};
            vm.produits = produitService.query();
            focus(vm.input1_focus);
            _resetForm('dsInsert');
        }

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _cancelEdit() {
            _revertSelectedItem();
            _setBrowse();
        }

        function _cancelInsert() {
            _setBrowse();
        }

        function _create(_item) {
            var item = new listeBaseService();
            item.nom = _item.nom;
            item.epicerieId = _item.epicerieId === "" ? _item.epicerieId = undefined : _item.epicerieId;
            item.$save(
                function (result) {
                    vm.item = result;
                    vm.isCollapsed = true;
                    vm.items.push(item);
                    toasterService.save(_item.nom);
                    vm.state = 'dsEdit';
                }, function (e) {
                    toasterService.error(e.data);
                    focus(vm.input1_focus);
                }
            );
        }

        function _createListeDetail(_id, _produitId) {
            var item = new listeBaseServiceDetail();
            item._id = _id;
            item.produitId = attr_produit_id;
            item.produit = attr_produit;
            item.marque = attr_marque;
            item.categorie = attr_categorie;
            item.conditionnement = attr_conditionnenent;
            item.note = attr_note;
            item.$save(function (result) {
                    vm.item.listeBaseDetail.push({
                        _id : result._id,
                        produit_id: attr_produit_id,
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

            listeBaseService.query('', function (result) {
                vm.items = result;
                if (state === 'insert') {
                    setInsert();
                } else {
                    _setBrowse();
                }
            });


            vm.categories = categorieService.query();
            vm.epiceries = epicerieService.query();

        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.nom);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus(vm.input1_focus);
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
            vm.sorting.type = 'nom';
            _resetForm('dsBrowse');
        }

    }

})();
