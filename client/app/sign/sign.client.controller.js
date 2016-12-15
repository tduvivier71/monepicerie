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
        vm.form = {}; // Object

        /* Functions */
        vm.signIn = signIn;
        vm.signOut = signOut;
        vm.signUp = signUp;

        // ************************************************************************************************************/
        // Public function
        // ************************************************************************************************************/

        /**
         * Connection
         * @param {string} [provider] - vide, facebook ou google
         */
        function signIn(provider) {

            if (provider === 'local') {
                _localsignIn();
            } else {
                _socialSignIn(provider);
            }
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
         * @param {object} item
         * @param {string} item.nom
         * @param {string} item.prenom
         * @param {string} item.courriel
         * @param {string} item.motDePasse
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
                    toasterService.info('Bienvenue, votre compte a été créé avec succès');
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

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        /**
         * local connection
         */
        function _localsignIn() {

            var credentials = {
                courriel: vm.courriel,
                motDePasse: vm.motDePasse
            };

            $auth.login(credentials)
                .then(function() {
                    $location.path('/accueil');
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
        }


        /**
         * Connection
         * @param {string} provider - facebook ou google
         */
        function _socialSignIn(provider) {
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

    }

})();

