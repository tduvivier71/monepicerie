(function () {

    'use strict';

    angular
        .module('app')
        .factory('bearerAuthInterceptor', bearerAuthInterceptor);

    focus.$inject = ['$q', '$window'];

    function bearerAuthInterceptor($q, $window) {

        return {
          /*  request: function(config) {
                config.headers = config.headers || {};
                if ($window.localStorage.getItem('monepicerie-token')) {
                    // may also use sessionStorage
                    config.headers.Authorization = 'Bearer ' + $window.localStorage.getItem('monepicerie-token');
                }
                return config || $q.when(config);
            },
            response: function(response) {
                if (response.status === 401) {
                    //  Redirect user to login page / signup Page.
                }
                return response || $q.when(response);
            } */
        };
    }

})();