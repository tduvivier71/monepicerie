(function () {

    'use strict';

    angular
        .module('app.listeBase')
        .factory('listeBaseService', listeBaseService);

    listeBaseService.$inject = ['$resource'];

    function listeBaseService($resource) {

        return $resource('api/listebase/:id',
            {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });

    }

})();