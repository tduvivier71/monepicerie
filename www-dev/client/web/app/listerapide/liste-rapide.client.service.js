(function () {

    'use strict';

    angular
        .module('app')
        .factory('listeRapideService', listeRapideService);

    listeRapideService.$inject = ['$resource'];

    function listeRapideService($resource) {

        return $resource('api/listerapide/:id', {
            id: '@_id'

        }, {
            'update': { method: 'PUT', params:{id:'@id'} },
            'deleteListeRapide': { method: 'DELETE'}


        });



}

})();