(function () {

    'use strict';

    angular
        .module('app')
        .service('helperService', helperService);

    helperService.$inject = [''];

    function helperService() {

        var service = {
            revertSelectedItem: _revertSelectedItem,
        };
        return service;

        ////////////

        function _revertSelectedItem(_items, _selectedItem) {
            angular.forEach(_items, function (item, key) {
                if (item && item._id && _selectedItem && _selectedItem._id && item._id === _selectedItem._id) {
                    _items[key] = _selectedItem;
                }
            });
            _selectedItem = null;
        }


    }

})();