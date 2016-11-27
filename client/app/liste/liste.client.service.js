(function () {

    'use strict';

    angular
        .module('app.liste')
        .factory('listeService', listeService);

    listeService.$inject = ['$resource'];

    function listeService($resource) {

        return $resource('api/liste/:id',
            {
                id: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            });

    }

})();