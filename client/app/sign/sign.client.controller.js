/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.sign')
        .controller('SignController', SignController);

    SignController.$inject = ['$q',
        'toasterService', 'focus', 'authenticationService', '$location', '$auth', '$route'];

    function SignController($q,
         toasterService, focus, authenticationService, $location, $auth, $route) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.items = [];
        vm.state = '';          // string
        vm.error = '';          // string

        vm.authenticate = authenticate;
        vm.signIn = signIn;
        vm.signInFb = signInFb;
        vm.signOut = signOut;
        vm.signUp = signUp;

        vm.test = 'x5454x';

        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        // ************************************************************************************************************/
        // Object configuration
        // ************************************************************************************************************/

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        function authenticate(provider) {
            $auth.authenticate(provider).then(function(response) {
                  //  $auth.setToken(response.access_token);
                    toasterService.success('Connection réussie');
                    $location.path('/accueil');
                    $route.reload();

                })
                .catch(function(error) {
                    if (error.message) {
                        // Satellizer promise reject error.
                        toasterService.error(error.message);
                    } else if (error.data) {
                        // HTTP response error from server
                        toasterService.error(error.data.message, error.status);
                    } else {
                        toasterService.error(error);
                    }
                });
        };

        function signIn() {

            var credentials = {
                courriel: vm.courriel,
                motDePasse: vm.motDePasse
            };

            $auth.login(credentials)
                .then(function() {
                    toasterService.success('You have successfully signed in!');
                    $location.path('/accueil');
                    $route.reload();
                })
                .catch(function(error) {
                    toasterService.error(error.data.message, error.status);
                });
        }

        function signOut() {
            if (!$auth.isAuthenticated()) { return; }
            $auth.logout()
                .then(function() {
                    toasterService.info('You have been logged out');
                    $location.path('/signout');
                    $route.reload();
                });
        }


        /*function signIn() {

            var credentials = {
                courriel: vm.courriel,
                motDePasse: vm.motDePasse
            };

            authenticationService
                .login(credentials)
                .error(function(error){
                    toasterService.error(error.message);
                })
                .then(function(result){
                    toasterService.info(result.data.prenom + ' '  + result.data.nom + ' est connecté avec succès');
                    $location.path("/accueil");
                });

        } */

        function signInFb() {

            var credentials = {
                courriel: vm.courriel,
                motDePasse: vm.motDePasse
            };

            authenticationService
                .loginFb(credentials)
                .error(function(error){
                    toasterService.error(error);
                })
                .then(function(result){
                    toasterService.info(result.data.prenom + ' '  + result.data.nom + ' est connecté avec succès');
                    $location.path("/accueil");
                });

        }

        function signUp(_item) {

            var credentials = {
                nom : _item.nom,
                prenom : _item.prenom,
                courriel: _item.courriel,
                motDePasse: _item.motDePasse
            };

            authenticationService
                .register(credentials)
                .error(function(error){
                    toasterService.error(error);
                    focus('nom_focus');
                })
                .then(function(result){
                    toasterService.info(result.data.prenom + ' '  + result.data.nom + ' est enregistré avec succès');
                    $location.path("/accueil");
                });

        }

  /*      function signOut() {
            authenticationService.logout();
        } */

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _init() {



            if ($location.path() === '/signin') {
                var token = authenticationService.getToken();
                if (token) {
                    $location.path("/accueil");
                }  else {
                    $location.path("/signin");
                }
            }

        }
    }

})();

