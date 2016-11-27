(function () {

    'use strict';

    angular
        .module('app.epicerie')
        .factory('epicerieService', epicerieService);

    epicerieService.$inject = ['$resource'];

    function epicerieService($resource) {

        return $resource('api/epicerie/:id', {id: '@_id'}, {update: {method: 'PUT'}});

      //  return $resource('api/epicerie', {id: '@_id'}, {update: {method: 'PUT'}});

    }

})();