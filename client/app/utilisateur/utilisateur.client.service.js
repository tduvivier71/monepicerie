(function () {

    'use strict';

    angular
        .module('app.utilisateur')
        .factory('utilisateurService', utilisateurService);

    utilisateurService.$inject = ['$resource'];

    function utilisateurService($resource) {

        return $resource('api/utilisateur/:id', {id: '@_id'}, {update: {method: 'PUT'}});

    }

})();