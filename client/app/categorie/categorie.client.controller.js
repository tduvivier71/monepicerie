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

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object

        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string
        vm.oneMore = false;      // boolean

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
            console.log('cancel');
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

        function save(_form, _item, _oneMore) {
            console.log('save');
            if (vm.state === 'dsInsert') {
                _create(_form, _item, _oneMore);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            console.log('setEdit');
            _resetForm();
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.state = 'dsEdit';
            focus('categorie_focus');
        }

        function setInsert() {
            console.log('setInsert');
            _resetForm();
            vm.item = undefined;
            vm.state = 'dsInsert';
            focus('categorie_focus');
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
                var item = new categorieService();
                item.categorie = _item.categorie;
                item.$save(
                    function () {
                        vm.items.push(item);
                        toasterService.save(_item.categorie);
                        if (_oneMore) {
                            _resetForm();
                            setInsert();
                        }
                        else {
                            _setBrowse();
                        }
                        vm.oneMore = false;
                    }, function (e) {
                        toasterService.error(e.data);
                        focus('categorie_focus');
                    }
                );
            } else {
                focus('categorie_focus');
            }
        }

        function _init() {
            focus('searchText');
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
                }
            );
        }

        function _setBrowse() {
            _resetForm();
            $log.info('_setBrowse');
            vm.sorting.type = 'categorie';
            vm.state = 'dsBrowse';
            focus('searchItem_focus');
        }

        function _resetForm() {
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

