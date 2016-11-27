(function () {

    'use strict';

    angular
        .module('app.marque')
        .factory('marqueService', marqueService);

    marqueService.$inject = ['$resource'];

    function marqueService($resource) {

        return $resource('api/marque/:id',
            {
                id: '@_id'
            }, {
                update: {method: 'PUT'
            }
        });

    }

})();