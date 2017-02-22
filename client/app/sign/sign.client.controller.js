/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.sign')
        .controller('SignController', SignController);

    SignController.$inject = ['toasterService', '$location', '$auth', 'focus'];

    function SignController(toasterService, $location, $auth, focus) {

        // todo changer data-ng-minlength ="1" pour motdepasse_input
        // todo changer type=email pour une meilleure vérification car a@a est valide
        // todo faire une contre vérifation de mot de à mot de passe


        var vm = this;

        /* Variables */
        vm.form = {}; // Object
        vm.item = {}; // Object requis pour vm.item.nom, vm.item.prenom etc

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
                prenom : item.prenom,
                nom : item.nom,
                courriel: item.courriel,
                motDePasse: item.motDePasse
            };

            if (credentials.nom && credentials.prenom && credentials.courriel && credentials.motDePasse) {

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

            if (!vm.form.$valid) {
                focus('courriel_input_focus');
                return;
            }

            if (vm.courriel && vm.motDePasse) {

                $auth.login(credentials)
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

