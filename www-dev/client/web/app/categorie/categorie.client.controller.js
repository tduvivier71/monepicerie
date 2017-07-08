(function () {

    'use strict';

    angular
        .module('app.categorie')
        .controller('CategorieController', CategorieController);

    CategorieController.$inject = ['categorieService', 'toasterService','focus', 'helperService'];

    function CategorieController(categorieService, toasterService, focus, helperService) {

        var vm = this;

        vm.focusSearch = 'searchItem_input_focus';
        vm.focusItem = 'categorie_input_focus';
        vm.sortingItem = 'categorie';

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.sorting = {
            type: '',
            reverse: false
        };

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

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
                toasterService.remove(_item.categorie);
                vm.items.splice(  vm.items.indexOf(_item), 1);
            }, function (e) {
                toasterService.error(e.data);
            });
            _setBrowse();
        }

        function save(_form, _item) {
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
        }

        function setInsert() {
            vm.item = {};
            focus(vm.focusItem);
            _resetForm('dsInsert');
        }

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _cancelEdit() {
            helperService.revertSelectedItem(vm.items, vm.selectedItem);
            _setBrowse();
        }

        function _cancelInsert() {
            _setBrowse();
        }

        function _create(_item) {
            var item = new categorieService();
            item.categorie = _item.categorie;
            item.favori = _item.favori;
            item.$save(
                function () {
                    if (item.favori ) {
                        angular.forEach(vm.items, function (item, key) {
                            if (item.favori === true) {
                                vm.items[key].favori = false;
                            }
                        });
                    }
                    vm.items.push(item);
                    toasterService.save(_item.categorie);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data.message);
                    focus(vm.focusItem);
                }
            );
        }

        function _init() {
            _setBrowse();
            categorieService.query('', function (result) {
                vm.items = result;
            });
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.categorie);
                    if ( _item.favori ) {
                        angular.forEach(vm.items, function (item, key) {
                            if ( item.favori === true &&  _item._id !== item._id) {
                                vm.items[key].favori = false;
                            }
                        });
                    }
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data.message);
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

