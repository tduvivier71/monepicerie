(function () {

    'use strict';

    angular
        .module('app.accueil')
        .factory('listeRapideService', listeRapideService);

    listeRapideService.$inject = ['$resource'];

    function listeRapideService($resource) {

        return $resource('api/listerapide/:id',
            {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });

    }

})();