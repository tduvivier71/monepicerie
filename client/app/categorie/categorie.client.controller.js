(function () {

    'use strict';

    angular
        .module('app.categorie')
        .controller('CategorieController', CategorieController);

    CategorieController.$inject = ['$log',
                                   'categorieService', 'toasterService','focus'];

    function CategorieController($log,
                                 categorieService, toasterService, focus) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} categorie
         * @property  {boolean} favori
         * @function reset
         */
        vm.item = {
            categorie: '',
            favori: false,
            reset: function () {
                this.categorie = '';
                this.favori = false;
            }
        };

        /* Variables */
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
            if (!_form.$valid) {
                focus('categorie_input_focus');
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            focus('categorie_input_focus');
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
        }

        function setInsert() {
            focus('categorie_input_focus');
            _resetForm('dsInsert');
            vm.item.reset();
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
            var item = new categorieService();
            item.categorie = _item.categorie;
            item.favori = _item.favori;
            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(_item.categorie);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('categorie_input_focus');
                }
            );
        }

        function _init() {
            vm.item.reset();
            vm.items = categorieService.query();
            _setBrowse();
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.categorie);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('categorie_input_focus');
                }
            );
        }

        function _setBrowse() {
            focus('searchItem_input_focus');
            vm.sorting.type = 'categorie';
            _resetForm('dsBrowse');

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
    }

})();

