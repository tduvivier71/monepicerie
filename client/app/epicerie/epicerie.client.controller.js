// TODO : Corriger validate-input qui ne se fait pas sur epicerie_id
// TODO : Google Map est sur $scope et non VM.  À corriger

(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .controller('EpicerieController', EpicerieController);

    EpicerieController.$inject = ['$log', 'uiGmapGoogleMapApi', '$scope', 'NgMap',
                                'epicerieService', 'toasterService', 'focus'];

    function EpicerieController($log, GoogleMapApi, $scope, NgMap,
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

        vm.title = 'Another Title';


        vm.placeChanged = function() {
            vm.place = this.getPlace();
            console.log('location', vm.place.geometry.location);
            vm.map.setCenter(vm.place.geometry.location);
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
                focus('epicerie_focus');
                return;
            }

            if (vm.state === 'dsInsert') {
                _create(_item);
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
            focus('epicerie_focus');
        }

        function setInsert() {
            console.log('setInsert');
            _resetForm();
            vm.item = undefined;
            vm.state = 'dsInsert';
            focus('epicerie_focus');
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

        function _create(_item) {
            var item = new epicerieService();
            item.epicerie = vm.title;
         //   item.epicerie = document.getElementById('epicerie_input_id').value;  // _item.epicerie;
         //   item.favori = _item.favori;
            item.$save(
                function () {
                    vm.items.push(item);
                    toasterService.save(item.epicerie);
                    _setBrowse();
                }, function (e) {
                    toasterService.error(e.data);
                    focus('epicerie_focus');
                }
            );
        }

        function _init() {
            vm.item = {
                epicerie : '',
                favori : false
            };
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
            _resetForm();
            $log.info('_setBrowse');
            vm.sorting.type = 'epicerie';
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

