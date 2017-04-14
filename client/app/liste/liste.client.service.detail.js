(function () {

    'use strict';

    angular
        .module('app.liste')
        .factory('listeServiceDetail', listeServiceDetail);

    listeServiceDetail.$inject = ['$resource'];

    function listeServiceDetail($resource) {

        return $resource('api/liste/:id/detail/:id2', {
        id: '@_id',
        id2: '@_id2'
        }, {
            'update': { method: 'PUT', params:{id:'@id'} },
            'deleteAllDetail': { method: 'DELETE', params:{id:'@_id'}},
            'deleteOneDetail': { method: 'DELETE', params:{id:'@_id', id2: '@_id2' }
           }
        });
    }

})();