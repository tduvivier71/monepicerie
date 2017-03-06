(function () {

    'use strict';

    angular
        .module('app.listeBase')
        .factory('listeBaseServiceDetail', listeBaseServiceDetail);

    listeBaseServiceDetail.$inject = ['$resource'];

    function listeBaseServiceDetail($resource) {

        return $resource('api/listebase/:id/detail/:id2', {
        id: '@_id',
        id2: '@_id2'
        }, {
            'update': { method: 'PUT', params:{id:'@id'} },
            'deleteOneDetail': { method: 'DELETE', params:{id:'@_id', id2: '@_id2' }
           }
        });
    }

})();