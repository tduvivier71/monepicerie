(function () {

    'use strict';

    angular
        .module('app.marque')
        .controller('MarqueController', MarqueController);

    MarqueController.$inject = ['marqueService', 'toasterService','focus', 'helperService'];

    function MarqueController(marqueService, toasterService, focus, helperService) {

        var vm = this;

        vm.focusSearch = 'searchItem_input_focus';
        vm.focusItem = 'categorie_input_focus';
        vm.sortingItem = 'marque';

        /* Variables */
        vm.items = [];          // List of object
        vm.form = {};           // Object
        vm.searchItem = '';     // string
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

        function remove(_item, _i) {
            _item.$remove(function () {
                toasterService.remove(_item.marque);
                vm.items.splice(_i, 1);
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
            var item = new marqueService();
            item.marque = _item.marque;
            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(_item.marque);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data.message);
                    focus(vm.focusItem);
                }
            );
        }

        function _init() {
            marqueService.query('', function (result) {
                vm.items = result;
                _setBrowse();
            });
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.marque);
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

