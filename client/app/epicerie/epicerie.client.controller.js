(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['$log', '$filter','epicerieService', 'focus'];

    function EpicerieController($log, $filter, epicerieService, focus) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.items = [];          // List of object
        vm.insertItem = '';     // string
        vm.editItem = '';       // string
        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string

        vm.sorting = {
            type: 'epicerie',
            reverse: false
        };

        /* Fonctions */
        vm.create = create;
        vm.update = update;
        vm.updateByEnter = updateByEnter;
        vm.remove = remove;   
        vm.freezeOrderBy  = freezeOrderBy;

        vm.setInsert = setInsert;
        vm.setEdit = setEdit;
        vm.cancelInsert = cancelInsert;
        vm.cancelInsertEsc = cancelInsertEsc;
        vm.cancelEditEsc = cancelEditEsc;
        vm.cancelEdit = cancelEdit;

        vm.getTemplate = getTemplate;

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

         function freezeOrderBy() {

            vm.items = $filter('orderBy')(vm.items, 'epicerie');
        /*    for (var i = 0; i < vm.items.length && i <= 9999; ++i) {
                vm.items[i]['frozenOrderBy'] = ("000" + i).slice(-4);
            } */
            vm.sorting.type = 'frozenOrderBy';
        }       

        function setInsert() {
            if (vm.selectedItem !== null) {
                _revertSelectedItem();
            }
            _setInsert();
        }

        function setEdit(item) {
            $log.info('setEdit');
            if (vm.selectedItem !== null &&
                item.epicerie !== vm.selectedItem.epicerie) {
                _revertSelectedItem();
            }
            vm.selectedItem = angular.copy(item);
            _setEdit();
        }

        function cancelInsert() {
            _setBrowse();
        }

        function cancelInsertEsc(e) {
            if (e.keyCode === 27) {
                _setBrowse();
            }
        }

        function cancelEdit(item) {
            if (item.epicerie !== vm.selectedItem.epicerie) {
                item.epicerie = angular.copy(vm.selectedItem.epicerie);
            }
            _setBrowse();
        }

        function cancelEditEsc(e, item) {
            if (e.keyCode === 27) {
                cancelEdit(item);
            }
        }

        function create() {
            if (vm.insertItem !== '') {
                var item = new epicerieService();
                item.epicerie = vm.insertItem;
                item.$save(
                    function () {
                        vm.items.push(item);
                        _setInsert();
                    },
                    function (e) {
                        vm.error = e.data.message;
                    }
                );
            }
        }

        function update(item) {
            console.log('update ' + JSON.stringify(item));
            item.$update(
                function () {
                    _setBrowse();
                },
                function (e) {
                    vm.error = e.data.message;
                }
            );
        }

        function updateByEnter(e,item) {
            if (e.keyCode === 13) {
                update(item);
            }
        }

        function getTemplate(item) {
            if (vm.selectedItem !== null &&
                vm.selectedItem._id === item._id) {
                return 'edit';
            }
            else {
                return 'display';
            }
        }

        function remove(item) {
            if (vm.selectedItem !== null &&
                item.epicerie !== vm.selectedItem.epicerie) {
                _revertSelectedItem();
            }
            item.$remove(function () {
                for (var i in vm.items) {
                    if (vm.items[i] === item) {
                        vm.items.splice(i, 1);
                    }
                }
            });
            _setBrowse();
        }

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _init() {
            focus('searchText');
            _find();
            _setBrowse();
        }

        function _find() {
            vm.items = epicerieService.query();
        }

        function _resetError() {
            vm.error = '';
        }

        function _setBrowse() {
            $log.info('_setBrowse');
            vm.sorting.type = 'epicerie';
            vm.state = 'dsBrowse';
            vm.selectedItem = null;
            vm.form.$dirty = false;
            focus('searchItem_focus');
            _resetError();
        }

        function _setInsert() {
            vm.state = 'dsInsert';
            vm.insertItem = '';
            focus('insertItem_focus');
            vm.form.$dirty = false;
            _resetSearchItem();
            _resetError();
        }

        function _setEdit() {
            vm.state = 'dsEdit';
            focus('editItem_focus');
            _resetError();
        }

        function _resetSearchItem() {
            vm.searchItem = '';
        }

        function _revertSelectedItem() {
            angular.forEach(vm.items, function (item, key) {
                if (item._id === vm.selectedItem._id) {
                    vm.items[key].epicerie = vm.selectedItem.epicerie;
                }
            });
            vm.selectedItem = null;
        }
    }

})();

