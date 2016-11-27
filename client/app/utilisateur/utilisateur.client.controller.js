/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.utilisateur')
        .controller('UtilisateurController', UtilisateurController);

    UtilisateurController.$inject = ['$q',
        'toasterService', 'focus', 'utilisateurService'];

    function UtilisateurController($q,
         toasterService, focus, utilisateurService) {

        var vm = this;

        /* Variables */
        vm.form = {};           // Object
        vm.items = [];           // Object
        vm.item = {};           // Object
        vm.state = '';          // string

        vm.update = update;
        vm.cancel = cancel;


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

        function cancel() {

        }

        function update() {
            vm.item.$update(
                function (result) {
                    toasterService.update(result.nom);
                  //  _setBrowse();
                },
                function (e) {
                    toasterService.error(e.data);
                }
            );
        }


        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _init() {
            var queryParam = {courriel: "titi@titi.com"};

            vm.items = utilisateurService.query(queryParam, function () {
               // console.log('test ' + vm.items[0].prenom);
                vm.item = vm.items[0];
            });




            focus('prenom_focus');
        }

    }

})();

