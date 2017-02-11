(function () {

    'use strict';

    angular
        .module('app.format')
        .controller('FormatController', FormatController);

    FormatController.$inject = ['$log',
                                'formatService', 'toasterService', 'focus'];

    function FormatController($log,
                              formatService, toasterService, focus) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} format
         * @function reset
         */
        vm.item = {
            format: '',
            reset: function () {
                this.format = '';
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
            type: 'format',
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
                toasterService.remove(_item.format);
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
                focus('format_input_focus');
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            focus('format_input_focus');
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
        }

        function setInsert() {
            focus('format_input_focus');
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
            var item = new formatService();
            item.format = _item.format;
            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(_item.format);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('format_input_focus');
                }
            );
        }

        function _init() {
            vm.item.reset();
            vm.items = formatService.query();
            _setBrowse();
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.format);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('format_inpput_focus');
                }
            );
        }

        function _setBrowse() {
            focus('searchItem_input_focus');
            vm.sorting.type = 'format';
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

