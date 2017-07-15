(function () {

    'use strict';

    angular
        .module('app.produit')
        .factory('produitService', produitService);

    produitService.$inject = ['$resource'];

    function produitService($resource) {

        return $resource('api/produit/:id',
            {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT',
                }
            });

    }

})();