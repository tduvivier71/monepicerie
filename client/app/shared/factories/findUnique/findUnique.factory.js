(function () {

    'use strict';

    angular
        .module('app')
        .factory('findUnique', findUnique);

    focus.$inject = ['$q', '$http'];

    function findUnique($q, $http) {

        return function(route, item) {

            var deferred = $q.defer();

            $http.get('/api/' + route + '/unique/' + item).then(function() {
                deferred.reject();
            }, function() {
                deferred.resolve();
            });
            return deferred.promise;
        };
    }

})();