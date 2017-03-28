(function () {

    'use strict';

    angular
        .module('app.unite')
        .controller('UniteController', UniteController);

    UniteController.$inject = ['$log',
        'uniteService', 'toasterService','focus', '$http'];

    function UniteController($log, uniteService, toasterService, focus, $http) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} unite
         * @property  {string} abreviation
         * @property  {string} operation
         * @property  {number} nombre
         * @property  {string} coutParId
         * @function reset
         */
        vm.item = {};

        /* Variables */
        vm.items = [];          // List of object
        vm.form = {};           // Object

        vm.coutPar = '';

        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string

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
            valuePrimitive: false,
            autoBind: false,
           // dataSource: vm.unites,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/unite')
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
            console.log('cancel');
            if (vm.state === 'dsInsert') {
                _cancelInsert();
            } else {
                _cancelEdit();
            }
        }

        function changeOperation(_operation) {
            vm.item.operation = _operation;
            focus('nombre_input_focus');
        }

        function remove(_item) {
            _item.$remove(function () {
                toasterService.remove(_item.unite);
                vm.comboCoutPar.dataSource.read();

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
                if (_item.unite) {
                    focus('abreviation_input_focus');
                }
                else {
                    focus('unite_input_focus');
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
            focus('unite_input_focus');
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
        }

        function setInsert() {
            focus('unite_input_focus');
            _resetForm('dsInsert');
            vm.item = {};
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
                    focus('unite_input_focus');
                }
            );
        }

        function _init() {
          //  vm.unites = uniteService.query();
            uniteService.query('', function (result) {
                vm.items = result;
                _setBrowse();
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

        function _setBrowse() {
            focus('searchItem_input_focus');
            vm.sorting.type = 'unite';
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

