(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['NgMap', '$timeout',
                                  'epicerieService', 'toasterService', 'focus'];

    function EpicerieController(NgMap, $timeout,
                                epicerieService, toasterService, focus) {

        var vm = this;

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object

        vm.searchItem = '';     // string
        vm.selectedItem = {};   // Object
        vm.state = '';          // string
        vm.error = '';          // string

        vm.sorting = {
            type: 'epicerie',
            reverse: false
        };

        /* Fonctions */
        vm.cancel = cancel;
        vm.remove = remove;
        vm.save = save;
        vm.setEdit = setEdit;
        vm.setInsert = setInsert;
        vm.placeChanged = placeChanged;

        // Montréal
        vm.latitude = 45.5699091;
        vm.longitude = -73.5721709;

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        function placeChanged()  {
            vm.place = this.getPlace();
            if (!vm.place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            $timeout(function() {
                vm.map.setCenter(vm.place.geometry.location);
                vm.map.setZoom(17);
            }, 500);
        }

        function cancel() {
            if (vm.state === 'dsInsert') {
                _cancelInsert();
            } else {
                _cancelEdit();
            }
        }

        function remove(_item) {
            _item.$remove(function () {
                toasterService.remove(_item.epicerie);
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
                vm.epicerie_input_focus = true;
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.latitude = _item.location.lat;
            vm.longitude = _item.location.lng;
            vm.epicerie_input_focus = true;
        }

        function setInsert() {
            _resetForm('dsInsert');
            focus('epicerie_input_focus');
            vm.item.epicerie = '';
            vm.item.favori = false;
            vm.epicerie_input_focus = true;
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
            if (vm.place.geometry) {
                var item = new epicerieService();
                item.epicerie = _item.epicerie;
                item.favori = _item.favori;
                item.location = {
                    lat: vm.place.geometry.location.lat(),
                    lng: vm.place.geometry.location.lng()
                };

                item.$save(
                    function () {
                        vm.items.push(item);
                        toasterService.save(item.epicerie);
                        _setBrowse();
                    }, function (e) {
                        toasterService.error(e.data);
                        vm.epicerie_input_focus = true;
                    }
                );
            }
        }

        function _init() {
            focus('searchText');
            vm.items = epicerieService.query();
            _setBrowse();
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.epicerie);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                }
            );
        }

        function _setBrowse() {
            _resetForm('dsBrowse');
            vm.place = {};
            vm.sorting.type = 'epicerie';
            focus('searchItem_focus');
        }

        function _resetForm(state) {
            vm.state = state;
            if (vm.form && vm.form.$dirty && vm.form.$submitted) {
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

