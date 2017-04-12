(function () {

    'use strict';

    angular
        .module('app.listeBase')
        .controller('ListeBaseController', ListeBaseController);

    ListeBaseController.$inject = ['$log', '$auth', '$routeParams', '$http',
        'listeBaseService', 'listeBaseServiceDetail', 'toasterService','focus',
        'categorieService',  'epicerieService','produitService'];

    function ListeBaseController($log, $auth, $routeParams, $http,
        listeBaseService, listeBaseServiceDetail, toasterService, focus,
        categorieService,  epicerieService, produitService) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.categoriesSel = [];
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
            }
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

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

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

        function cancel() {
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
        function removeItem(_produits, _item, _itemDetail) {
            var item = new listeBaseServiceDetail();
            item.$deleteOneDetail({id: _item._id, id2: _itemDetail._id});
            for (var i in _item.listeBaseDetail) {
                if (_item.listeBaseDetail[i]._id === _itemDetail._id) {
                    _produits.push({
                        _id: _item.listeBaseDetail[i].produit_id,
                        produit: _item.listeBaseDetail[i].produit,
                        fullConditionnement: _item.listeBaseDetail[i].conditionnement,
                        description : _item.listeBaseDetail[i].description,
                        marqueId : {
                            marque : _item.listeBaseDetail[i].marque
                        },
                        categorieId : {
                            categorie : _item.listeBaseDetail[i].categorie
                        }
                    });
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

            $http.get('/api/epicerie/favori')
                .then(function success(response) {
                    vm.item = {
                        epicerieId: response.data._id
                    };

                  //  vm.epicerieWidget.text(response.data.epicerie);
                    vm.epicerieWidget.value(response.data.epicerie);

                }, function error(response) {
                    alert('something went wrong')
                    console.log(response);
                });

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
                    toasterService.error(e.data.message);
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
            item.description = attr_note;
            item.$save(function (result) {

                   vm.item.listeBaseDetail.push({
                        _id : result._id,
                        produit_id: attr_produit_id,
                        produit: attr_produit,
                        marque : attr_marque,
                        categorie : attr_categorie,
                        conditionnement : attr_conditionnenent,
                        description : attr_note
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
        }

        function _update(_item) {
            _item.$update(
                function () {
              /*      angular.forEach(vm.items, function (item, key) {
                        if (item._id === _item._id) {

                            if (vm.item.epicerieId && vm.item.epicerieId.epicerie) {
                                vm.items[key].epicerieId.epicerie = vm.item.epicerieId.epicerie;
                            vm.items[key].epicerieId.epicerie = vm.epicerieWidget.text();}
                        }
                    }); */
                    toasterService.update(_item.nom);
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

