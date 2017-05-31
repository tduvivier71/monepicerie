(function () {

  //  'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['NgMap', '$timeout', '$sce',
                                  'epicerieService', 'toasterService', 'focus', 'helperService'];

    function EpicerieController(NgMap, $timeout, $sce,
                                epicerieService, toasterService, focus, helperService) {

        var vm = this;

        vm.focusSearch = 'searchItem_input_focus';
        vm.focusItem = 'epicerie_input_focus';
        vm.focusPlace = 'searchPlace_focus';
        vm.sortingItem = 'epicerie';

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object
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
        vm.placeChanged = placeChanged;
        vm.cancelEsc = cancelEsc;
        vm.clearPlace = clearPlace;

        // Montréal
        vm.latitudeMtl = 45.4982948;
        vm.longitudeMtl =-73.5658087;
        vm.zoomMtl = 10;

        vm.tips = $sce.trustAsHtml("Réinitialiser </br> le lieu ou l'adresse");

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        function cancelEsc(e) {
            if (e.keyCode === 27) {
                _clearSearchItem();
            }
        }

        function clearPlace () {
            vm.searchPlace = '';
            focus(vm.focusPlace);
        }

        function placeChanged()  {
            vm.place = this.getPlace();

            if (!vm.place) {
                return;
            }

            if (!vm.place.geometry) {
                return;
            }

            if (vm.place.length === 0) {
                return;
            }

            vm.item.epicerie = vm.place.name;
            vm.item.adresse = vm.place.formatted_address;

            $timeout(function() {
                //vm.map.setCenter(vm.place.geometry.location);
                vm.latitude = vm.place.geometry.location.lat();
                vm.longitude = vm.place.geometry.location.lng();
                if (vm.map) {
                    vm.map.setZoom(16);
                }
            }, 1000);
        }

        function cancel() {
            if (vm.state === 'dsInsert') {
                _cancelInsert();
            } else {
                _cancelEdit();
            }
        }

        function remove(_item, _i) {
            _item.$remove(function () {
                toasterService.remove(_item.epicerie);
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
            vm.searchPlace = '';
            vm.zoom = 16;
            vm.latitude = _item.location.lat;
            vm.longitude = _item.location.lng;
        }

        function setInsert() {
            vm.item = {};
            focus(vm.focusItem);
            _resetForm('dsInsert');
            vm.searchPlace = '';
            vm.zoom = vm.zoomMtl;
            vm.latitude = vm.latitudeMtl;
            vm.longitude = vm.longitudeMtl;
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

        function _clearSearchItem () {
            vm.searchPlace = '';
            focus(vm.focusPlace);
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
                        focus(vm.focusItem);
                    }
                );
            }
        }

        function _init() {

            NgMap.getMap().then(function(map) {
                vm.map = map;
            });

            epicerieService.query('', function (result) {
                vm.items = result;
                focus(vm.focusPlace);
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
                    focus(vm.focusItem);
                }
            );
        }

        function _resetForm(state) {
            vm.state = state;
            if (vm.form && vm.form.$dirty && vm.form.$submitted) {
                vm.form.$setPristine();
                vm.form.$setUntouched();
            }
        }

        function _setBrowse() {
            focus(vm.focusSearch);
            vm.sorting.type = vm.sortingItem;
            _resetForm('dsBrowse');
            vm.place = {}; // CHANGER !!!
        }


    }

})();

