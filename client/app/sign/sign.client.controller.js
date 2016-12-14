/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.sign')
        .controller('SignController', SignController);

    SignController.$inject = ['toasterService', '$location', '$auth'];

    function SignController(toasterService, $location, $auth) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.items = [];
        vm.state = '';          // string
        vm.error = '';          // string

        vm.authenticate = authenticate;
        vm.signOut = signOut;
        vm.signUp = signUp;

        vm.isAuthentified = $auth.isAuthenticated();

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        /**
         * Connection
         * @param {string} provider - facebook, google
         */
        function authenticate(provider) {
            $auth.authenticate(provider)
                .then(function () {
                    $location.path('/accueil');
                })
                .catch(function (error) {
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
        }

        /**
         * Déconnexion
         */
        function signOut() {
            if (!$auth.isAuthenticated()) {
                return;
            }
            $auth.logout().then(function () {
                $location.path('/signout');
            });
        }


        /**
         * Inscription
         * @param item
         */
        function signUp(item) {

            var credentials = {
                nom : item.nom,
                prenom : item.prenom,
                courriel: item.courriel,
                motDePasse: item.motDePasse
            };

            $auth.signup(credentials)
                .then(function (response) {
                    $auth.setToken(response);
                    $location.path('/accueil');
                    toasterService.info('You have successfully created a new account and have been signed-in');
                })
                .catch(function (error) {
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

        }

    }

})();

