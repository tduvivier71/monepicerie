(function () {

    'use strict';

    angular
        .module('app.liste')
        .controller('ListeController', ListeController);

    ListeController.$inject = ['$routeParams','$http','$q', '$auth', '$filter',
        'toasterService', 'focus', 'listeService', 'listeServiceDetail', 'produitService', 'listeRapideService'];

    function ListeController($routeParams, $http, $q, $auth, $filter,
         toasterService, focus, listeService, listeServiceDetail, produitService, listeRapideService) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.categoriesSel = [];
        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string

        vm.sorting = {
            type: 'produit',
            reverse: false
        };

        vm.input1_focus = 'date_input_focus';
        vm.isCollapsed = false;

        vm.search1Open = false;
        vm.search2Open = false;

        vm.listeRapide = [];

        vm.toggle = true;

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.removeItem = removeItem;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

        vm.createListeDetail = _createListeDetail;

        vm.addCategorie = addCategorie;
        vm.categorieRemove = categorieRemove;

        vm.openSearch1 = openSearch1;
        vm.deleteAllDetail = deleteAllDetail;
        vm.addProduitByChevron = _addProduitByChevron;
        vm.chooseListeRapide = chooseListeRapide

        // ************************************************************************************************************/
        // Object configuration
        // ************************************************************************************************************/
        var attr_id;
        var attr_produit;
        var attr_marque;
        var attr_categorie;
        var attr_conditionnenent;
        var attr_note;
        var attr_produitId;

        vm.sortableProduitsOptions = {
         //   cursor : 'none',
         //   scroll : false,
            placeholder: "app",
            connectWith: ".apps-container",
            'ui-floating': true,
            start: function (event, ui) {
                attr_id = ui.item.attr('data-id');
                attr_produit = ui.item.attr('data-produit');
                attr_marque = ui.item.attr('data-marque');
                attr_categorie = ui.item.attr('data-categorie');
                attr_conditionnenent = ui.item.attr('data-conditionnenent');
                attr_note = ui.item.attr('data-note');
                attr_produitId = ui.item.attr('data-produitId');
            }
        };

        vm.sortableListeRapideOptions = {
            //   cursor : 'none',
            //   scroll : false,
            placeholder: "app",
            connectWith: ".apps-container",
            'ui-floating': true,
            start: function (event, ui) {
                attr_produit = ui.item.attr('data-produit');
                attr_marque = ui.item.attr('data-marque');
                attr_categorie = ui.item.attr('data-categorie');
                attr_conditionnenent = ui.item.attr('data-conditionnenent');
                attr_note = ui.item.attr('data-note');
                attr_produitId = ui.item.attr('data-produitId');
            }
        };

        vm.sortableItemsOptions = {
            placeholder: "app",
            receive: function (event, ui) {
                var droppedDetail = {
                    produit : attr_produit,
                    marque : attr_marque,
                    categorie : attr_categorie,
                    conditionnement : attr_conditionnenent,
                    description : attr_note,
                    produitId : attr_produitId
                };
                _addDetailByDrop(vm.item._id, droppedDetail);
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
            clearButton: true,
            delay: 50,
            noDataTemplate: 'Aucune correspondance',
            suggest: true,
            highlightFirst: true,
            change : function(e) {
                if (this.select() < 0) {
                    this.value("");
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

        function addCategorie(categorie) {

            var found = vm.categoriesSel.some(function (el) {
                return el._id === categorie._id;
            });

            if (!found) {
                vm.categoriesSel.push(categorie);
                var arrayCatId = [];
                vm.categoriesSel.forEach(function(el) {
                    arrayCatId.push(el._id);
                });
                var queryParam = {catId: arrayCatId};
                vm.produits= produitService.query(queryParam);
            }

        }

        function categorieRemove(categorie) {
            for (var i in vm.categoriesSel) {
                if (vm.categoriesSel[i]._id === categorie._id) {
                    vm.categoriesSel.splice(i, 1);
                }
            }

            var arrayCatId = [];
            vm.categoriesSel.forEach(function(el) {
                arrayCatId.push(el._id);
            });
            var queryParam = {catId: arrayCatId};
            vm.produits= produitService.query(queryParam);

        }

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

        function _addProduitByChevron(_produit, _i) {

            var droppedDetail = {
                produit : _produit.produit,
                marque : (!_produit.marqueId)  ? "" : _produit.marqueId.marque,
                categorie : _produit.categorieId.categorie,
                conditionnement :  _produit.fullConditionnement,
                description : _produit.description,
                produitId : _produit._id
            };

            _createListeDetail(vm.item._id, droppedDetail);

            vm.produits.splice(_i, 1);

        }

        function _addDetailByDrop(_id, _detail) {
            _createListeDetail(_id, _detail);
        }

        function _createListeDetail(_id, _detail) {
            var item = new listeServiceDetail();
            item._id = _id;
            item.produit = _detail.produit;
            item.marque = _detail.marque;
            item.categorie = _detail.categorie;
            item.conditionnement = _detail.conditionnement;
            item.description = _detail.description;
            item.produitId = _detail.produitId;
            item.$save(function (result) {
                    vm.item.listeDetail.push({
                        _id : result._id,
                        produitId: result.produitId,
                        produit: result.produit,
                        marque : result.marque,
                        categorie : result.categorie,
                        conditionnement : result.conditionnement,
                        description : result.description
                    });
                    toasterService.save(result.produit);
                }
            );
        }

        function chooseListeRapide(_produit, _i) {

            var droppedDetail = {
                produit : _produit.produit,
                marque : _produit.marque,
                categorie : _produit.categorie,
                conditionnement :  _produit.conditionnement,
                description : _produit.description,
                produitId : _produit._id
            };

            _createListeDetail(vm.item._id, droppedDetail);

            vm.listeRapide.splice(_i, 1);

            _produit.$remove(function () {
                toasterService.remove(_produit.produit);
            }, function (e) {
                toasterService.error(e.data);
            });
        }

        function deleteAllDetail() {
            var i = vm.item.listeDetail.length; //or 10
            while(i--) {
                vm.item.listeDetail.splice(i, 1);
            }
            var item = new listeServiceDetail();
            item.$deleteAllDetail({id: vm.item._id});
            vm.produits = produitService.query();
            vm.listeRapide = listeRapideService.query();
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
            _item.$remove(function () {
                for (var i in vm.items) {
                    if (vm.items[i] === _item) {
                        vm.items.splice(i, 1);
                    }
                }
                toasterService.remove($filter('date')(_item.date, 'yyyy-MM-dd HH:mm:ss'));
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
        function removeItem(_produits, _item, _itemDetail) {
            var item = new listeServiceDetail();
            item.$deleteOneDetail({id: _item._id, id2: _itemDetail._id});
            for (var i in _item.listeDetail) {
                if (_item.listeDetail[i]._id === _itemDetail._id) {
                    _produits.push({
                        _id: _item.listeDetail[i].produit_id,
                        produit: _item.listeDetail[i].produit,
                        fullConditionnement: _item.listeDetail[i].conditionnement,
                        description : _item.listeDetail[i].description,
                        marqueId : {
                            marque : _item.listeDetail[i].marque
                        },
                        categorieId : {
                            categorie : _item.listeDetail[i].categorie
                        }
                    });
                    _item.listeDetail.splice(i, 1);
                }
            }
            toasterService.remove(_itemDetail.produit);
        }

        /**
         * Save liste
         */
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

        /**
         * Set edit state
         */
        function setEdit(_item) {
            focus(vm.input1_focus);
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.isCollapsed = true;

            var ids = [];

            vm.item.listeDetail.forEach(function(element) {
                ids.push(element.produitId._id);
            });

            var queryParam = {listeIds: ids };
            vm.produits = produitService.query(queryParam);
        }

        /**
         * Set insert State for new liste
         */
        function setInsert() {
            vm.item = {};

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

            vm.produits = produitService.query();
            focus(vm.input1_focus);
            _resetForm('dsInsert');

            vm.isCollapsed = false;




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
            var item = new listeService();
            item.date = _item.date;
            item.epicerieId = _item.epicerieId === "" ? _item.epicerieId = undefined : _item.epicerieId;
            item.modeleId = _item.modeleId === "" ? _item.modeleId = undefined : _item.modeleId;
            item.$save(
                function (result) {
                    vm.item = result;
                    vm.isCollapsed = true;
                    vm.items.push(item);
                    toasterService.save($filter('date')(_item.date, 'yyyy-MM-dd HH:mm:ss'));
                    vm.state = 'dsEdit';

                    var ids = [];

                    vm.item.listeDetail.forEach(function(element) {
                        ids.push(element.produitId);
                    });

                    var queryParam = {listeIds: ids };
                    vm.produits = produitService.query(queryParam);

                }, function (e) {
                    toasterService.error(e.data.message);
                    focus(vm.input1_focus);
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

            vm.listeRapide = listeRapideService.query();

        }


        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update($filter('date')(_item.date, 'yyyy-MM-dd HH:mm:ss'));
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data.message);
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
                if (item && item._id && vm.selectedItem && vm.selectedItem._id && item._id === vm.selectedItem._id) {
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

