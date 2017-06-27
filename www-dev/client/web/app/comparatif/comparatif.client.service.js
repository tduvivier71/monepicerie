(function () {

    'use strict';

    angular
        .module('app.comparatif')
        .factory('comparatifService', comparatifService);

    comparatifService.$inject = ['$resource'];

    function comparatifService($resource) {

        return $resource('api/comparatif/:id',
            {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }
        );

    }

})();