(function () {

    'use strict';

    angular
        .module('app.format')
        .factory('formatService', formatService);

    formatService.$inject = ['$resource'];

    function formatService($resource) {

        return $resource('api/format/:id', {id: '@_id'}, {update: {method: 'PUT'}});

       // return $resource('api/format', {id: '@_id'}, {update: {method: 'PUT'}});

    }

})();