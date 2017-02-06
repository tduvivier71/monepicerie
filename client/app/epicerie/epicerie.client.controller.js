// TODO : Corriger validate-input qui ne se fait pas sur epicerie_id
// TODO : Google Map est sur $scope et non VM.  À corriger

(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['$log', 'uiGmapGoogleMapApi', '$scope', 'NgMap', '$timeout',
                                'epicerieService', 'toasterService', 'focus'];

    function EpicerieController($log, GoogleMapApi, $scope, NgMap, $timeout,
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


        vm.placeChanged = function() {
            vm.place = this.getPlace();
            if (!vm.place.geometry) {
                window.alert("Autocomplete's returned place contains no geometry");
                return;
            }

            console.log('location', vm.place.geometry.location);
            $timeout(function() {
                vm.map.setCenter(vm.place.geometry.location);
                vm.map.setZoom(17);
            }, 500);
        };

        NgMap.getMap().then(function(map) {
            vm.map = map;
        });


      /*  $scope.$watch('searchModel.searchTerm', function(current, original) {
            $log.info('searchModel.searchTerm' + original);
            $log.info('searchModel.searchTerm ' + current);
        }); */

     /*   vm.map = {
            center: {  // Montréal
                latitude: 45.5699091,
                longitude: -73.5721709
            },
            zoom: 10,
            options: {
                scrollwheel: false
            }
        };

        vm.searchbox = {
            template : 'searchbox.tpl.html',
            parentdiv : 'searchBoxParent',
            events : {
                places_changed: function (searchBox) {

                    var place = searchBox.getPlaces();
                    if (!place || place === 'undefined' || place.length === 0) {
                        return;
                    }

                    // refresh the map
                    vm.map = {
                        center:{
                            latitude:place[0].geometry.location.lat(),
                            longitude:place[0].geometry.location.lng()
                        },
                        zoom:16
                    };
                }
            }
        };

        GoogleMapApi.then(function(maps) {
            maps.visualRefresh = true;
        }); */

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
            vm.selectedItem = angular.copy(_item);
            _resetForm('dsEdit');
            vm.epicerie_input_focus = true;
        }

        function setInsert() {
            _resetForm('dsInsert');
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
            vm.sorting.type = 'epicerie';
            focus('searchItem_focus');
        }

        function _resetForm(state) {
            vm.place = undefined;
            vm.item.epicerie = '';
            vm.item.favori = false;

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

