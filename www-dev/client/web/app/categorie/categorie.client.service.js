(function () {

    'use strict';

    angular
        .module('app.categorie')
        .factory('categorieService', categorieService);

    categorieService.$inject = ['$resource'];

    function categorieService($resource) {

        return $resource('api/categorie/:id',
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