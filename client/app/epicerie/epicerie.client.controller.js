(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['NgMap', '$timeout', '$sce',
                                  'epicerieService', 'toasterService', 'focus'];

    function EpicerieController(NgMap, $timeout, $sce,
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
        vm.cancelEsc = cancelEsc;
        vm.clearPlace = clearPlace;

        // Montréal
        vm.latitude = 45.5699091;
        vm.longitude = -73.5721709;
        vm.zoom = 10;

        vm.tips = $sce.trustAsHtml("Réinitialiser </br> le lieu ou l'adresse");

        function cancelEsc(e) {
            if (e.keyCode === 27) {
                _clearSearchItem();
            }
        };

        function clearPlace () {
            vm.searchPlace = '';
            focus('searchPlace_focus');
        }

        function _clearSearchItem () {
            vm.searchPlace = '';
            focus('searchPlace_focus');
        }

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
                window.alert("Aucun lieu n'a été trouvé !");
                return;
            }

            vm.item.epicerie = vm.place.name;
            vm.item.adresse = vm.place.formatted_address;

            $timeout(function() {
                //vm.map.setCenter(vm.place.geometry.location);

                vm.latitude = vm.place.geometry.location.lat();
                vm.longitude = vm.place.geometry.location.lng();

                vm.map.setZoom(16);
            }, 1000);
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
                focus('epicerie_input_focus');
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
            } else {
                _update(_item);
            }
        }

        function setEdit(_item) {
            vm.searchPlace = '';
            _resetForm('dsEdit');
            vm.selectedItem = angular.copy(_item);
            vm.item = _item;
            vm.zoom = 16;
            vm.latitude = _item.location.lat;
            vm.longitude = _item.location.lng;
        }

        function setInsert() {
            vm.item = {};
            vm.searchPlace = '';
            _resetForm('dsInsert');
            vm.zoom = 10;
            vm.latitude = 45.5699091;
            vm.longitude = -73.5721709;
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
                item.adresse = _item.adresse;
                item.favori = _item.favori;
                item.location = {
                    lat: vm.place.geometry.location.lat(),
                    lng: vm.place.geometry.location.lng()
                };

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
                        toasterService.save(item.epicerie);
                        _setBrowse();
                    }, function (e) {
                        toasterService.error(e.data);
                        focus('epicerie_input_focus');
                    }
                );
            }
        }

        function _init() {
            epicerieService.query('', function (result) {
                vm.items = result;
                focus('searchPlace_focus');
                _setBrowse();
            });
        }

        function _update(_item) {
            _item.$update(
                function () {
                    toasterService.update(_item.epicerie);

                    if ( vm.item.favori ) {
                        angular.forEach(vm.items, function (item, key) {
                            if ( item.favori === true &&  vm.item._id !== item._id) {
                                vm.items[key].favori = false;
                            }
                        });
                    }

                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('epicerie_input_focus');
                }
            );
        }

        function _setBrowse() {
            focus('searchItem_input_focus');
            _resetForm('dsBrowse');
            vm.sorting.type = 'epicerie';
            vm.place = {}; // CHANGER !!!
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

