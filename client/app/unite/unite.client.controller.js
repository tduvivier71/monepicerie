(function () {

    'use strict';

    angular
        .module('app.unite')
        .controller('UniteController', UniteController);

    UniteController.$inject = ['$log',
        'uniteService', 'toasterService','focus'];

    function UniteController($log, uniteService, toasterService, focus) {

        var vm = this;

        /* Variables */

        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object


        vm.coutPar = '';

        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string
        vm.oneMore = false;      // boolean

        vm.sorting = {
            type: 'unite',
            reverse: false
        };

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
            valuePrimitive: true,
            autoBind: false,
            dataSource: vm.items,
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
                    vm.coutPar = this.text();
                }
            }
        };

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

        function changeOperation(_operation) {
            vm.item.operation = _operation;
            if (_operation === 'aucune') {
                vm.item.nombre = null;
                vm.item.conversionId = null;
            } else {
                focus('nombre_focus');
            }
        }

        function remove(_item) {
            _item.$remove(function () {
                toasterService.remove(_item.unite);
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
            focus('unite_focus');
        }

        function setInsert() {
            console.log('setInsert');
            _resetItem();
            _resetForm();
            vm.state = 'dsInsert';
            focus('unite_focus');
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
                var item = new uniteService();
                item.unite = _item.unite;
                item.abreviation = _item.abreviation;
                item.operation = _item.operation;
                item.nombre = _item.nombre;
                item.coutParId = _item.coutParId;
                item.$save(
                    function () {
                        vm.items.push(item);
                        toasterService.save(_item.unite);
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
                        focus('unite_focus');
                    }
                );
            } else {
                focus('unite_focus');
            }
        }

        function _init() {
            focus('searchText');
            vm.items = uniteService.query();
            _setBrowse();
            _resetItem();
        }

        function _update(_item) {
            _item.$update(
                function (result) {
                    /*angular.forEach(vm.items, function (item, key) {
                        if (item._id === _item._id && vm.item.coutParId) {
                            vm.item.coutParId.unite = vm.coutPar;
                            vm.items[key] = vm.item.coutParId.unite;
                        }
                    });*/
                    toasterService.update(result.unite);
                    // _setBrowse();
                    _init();
                }, function (e) {
                    toasterService.error(e.data);
                }
            );
        }

        function _setBrowse() {
            _resetForm();
            $log.info('_setBrowse');
            vm.sorting.type = 'unite';
            vm.state = 'dsBrowse';
            focus('searchItem_focus');
        }

        function _resetForm() {
            if (vm.form.$dirty || vm.form.$submitted) {
                vm.form.$setPristine();
                vm.form.$setUntouched();
            }
        }

        function _resetItem() {
            vm.item = {
                unite : null,
                abreviation : null,
                operation: 'aucune',
                nombre : null,
                coutParId : null
            };
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

