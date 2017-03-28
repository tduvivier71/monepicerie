(function () {

    'use strict';

    angular
        .module('app.unite')
        .factory('uniteService', uniteService);

    uniteService.$inject = ['$resource'];

    function uniteService($resource) {

        return $resource('api/unite/:id',
            {
                id: '@_id'
            },
            {
                update: {
                    method: 'PUT'
                }
            });


    }

})();