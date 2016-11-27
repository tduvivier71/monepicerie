(function () {

    'use strict';

    angular
        .module('app')
        .service('authenticationService', authenticationService);

    authenticationService.$inject = ['$window', '$http'];

    function authenticationService($window, $http) {

        var saveToken = function (token) {
            $window.localStorage['monepicerie-token'] = token;
        };

        var getToken = function () {
            return $window.localStorage['monepicerie-token'];
        };

        var signup = function(user) {

            // /auth/signup
            // /api/signup

            return $http.post('/auth/signup', user).success(function(data){
                saveToken(data.token);
            });
        };

        var signin = function(user) {
            //auth
            return $http.post('/auth/login', user).success(function(data) {
              //  saveToken(data.token);
            });
        };

     /*   var signinFb = function(user) {
            $window.location = $window.location.protocol + "//" + $window.location.host + $window.location.pathname + "api/oauth/facebook";

           return $http.get('/api/oauth/facebook', user).success(function(data) {
                saveToken(data.token);
            });

        }; */

        var signinFb = function() {
            var url = '/#auth/facebook',
                width = 1000,
                height = 650,
                top = (window.outerHeight - height) / 2,
                left = (window.outerWidth - width) / 2;
            $window.open(url, 'facebook login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);

          //  saveToken(data.token);

        };

        var signout = function() {
            $window.localStorage.removeItem('monepicerie-token');
        };

        var isLoggedIn = function() {
            var token = getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        return {
            saveToken : saveToken,
            getToken : getToken,
            register: signup,
            loginFb: signinFb,
            login : signin,
            logout : signout,
            isLoggedIn : isLoggedIn
        };

    }

})();