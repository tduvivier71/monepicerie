(function () {

    'use strict';

    angular
        .module('app.unite')
        .controller('UniteController', UniteController);

    UniteController.$inject = ['uniteService', 'toasterService','focus', '$http', 'helperService'];

    function UniteController(uniteService, toasterService, focus, $http, helperService) {

        var vm = this;

        vm.focusSearch = 'searchItem_input_focus';
        vm.focusItem = 'unite_input_focus';
        vm.sortingItem = 'unite';
        vm.nombreFocus = 'nombre_input_focus';
        vm.abreviationFocus = 'abreviation_input_focus';


        /* Variables */

        vm.item = {};
        vm.items = [];          // List of object
        vm.form = {};           // Object
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.sorting = {
            type: 'unite',
            reverse: false
        };

        vm.coutPar = '';

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;

        vm.changeOperation = changeOperation;

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        vm.selectOptionsCoutParId = {
            placeholder: "Choisir une unité",
            dataTextField: "unite",
            dataValueField: "_id",
            filter:"contains",
            valuePrimitive: false,
            autoBind: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/unite')
                            .then(function success(response) {
                                e.success(response.data);
                            }, function error(response) {
                                alert('something went wrong');
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
            change : function() {
                if (this.select() < 0) {
                    this.value("");
                }
                else {
                    vm.item.coutParId.unite = this.text();
                }
            }
        };

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

        function changeOperation(_operation) {
            vm.item.operation = _operation;
            focus(vm.nombreFocus);
        }

        function remove(_item, _i) {
            _item.$remove(function () {
                toasterService.remove(_item.unite);
                vm.comboCoutPar.dataSource.read();
                vm.items.splice(_i, 1);

            }, function (e) {
                toasterService.error(e.data);
            });
            _setBrowse();
        }

        function save(_form, _item) {
            if (!_form.$valid) {
                if (_item.unite) {
                    focus(vm.abreviationFocus);
                }
                else {
                    focus(vm.focusItem);
                }
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }

            vm.comboCoutPar.dataSource.read();

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
            var item = new uniteService();
            item.unite = _item.unite;
            item.abreviation = _item.abreviation;
            item.operation = _item.operation;
            item.nombre = _item.nombre;
            item.coutParId = _item.coutParId === "" ? _item.coutParId = undefined : _item.coutParId;
            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(_item.unite);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data.message);
                    focus(vm.focusItem);
                }
            );
        }

        function _init() {

            _setBrowse();

            uniteService.query('', function (result) {
                vm.items = result;
            });

        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.unite);
                    _setBrowse();
                }, function (error) {
                    toasterService.error(error.data.message || error.data);
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

