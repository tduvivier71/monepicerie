/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.utilisateur')
        .controller('UtilisateurController', UtilisateurController);

    UtilisateurController.$inject = ['$q',
                                     'toasterService', 'focus', 'utilisateurService', '$auth', '$location', 'helperService'];

    function UtilisateurController($q,
         toasterService, focus, utilisateurService, $auth, $location, helperService) {

        var vm = this;


        /**
         * typedef {Object}
         * @property  {string} prenom
         * @property  {string} nom
         * @property  {string} courriel
         * @property  {string} courriel altternatif
         * @property  {boolean} partagerProduits
         * @function reset
         */
        vm.item = {
            prenom: '',
            nom: '',
            provider: '',
            courriel:'',
            courrielAlt:'',
            partagerProduits: false,
            reset: function () {
                this.prenom = '';
                this.nom = '';
                this.provider= '';
                this.courriel = '';
                this.courrielAlt = '';
                this.partagerProduits = false;
            }
        };

        /* Variables */
        vm.form = {};           // Object
        vm.item = {};           // Object
        vm.state = '';          // string

        vm.cancel = cancel;
        vm.save = save;
        vm.getPayLoad = getPayLoad;
        vm.togglePartagerProduits = togglePartagerProduits;


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
            _cancelEdit();
        }

        function save(_form, _item) {
            if (!_form.$valid) {

                if (!vm.form.prenom_input.$valid) {
                    focus('prenom_input__focus');
                    return;
                } else if (!vm.form.nom_input.$valid) {
                    focus('nom_input_focus');
                    return;
                } else if (!vm.form.courriel_input.$valid) {
                    focus('courriel_input_focus');
                    return;
                } else if (!vm.form.courriel_alt_input_focus.$valid) {
                    focus('courriel_alt_input');
                    return;
                }
            }

            _update(_item);
        }

        function getPayLoad() {
            alert(JSON.stringify($auth.getPayload().sub));
        }

        function togglePartagerProduits() {
            vm.partagerProduits =  !vm.partagerProduits;
        }

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _init() {
            var queryParam = { id: $auth.getPayload().sub};
            // vm.item = utilisateurService.get(queryParam);
            utilisateurService.get(queryParam, function (result) {
                vm.item = result;
                focus('prenom_focus');
            });
        }

        function _cancelEdit() {
            helperService.revertSelectedItem(vm.items, vm.selectedItem);
            _setBrowse();
        }

        function _update(_item) {

            _item.$update(
                function (result) {
                    toasterService.update(result.nom);
                    _setBrowse();
                },
                function (e) {
                    toasterService.error(e.data);
                    focus('prenom_input_focus');
                }
            );
        }

        function _resetForm(state) {
            vm.state = state;
            if (vm.form.$dirty || vm.form.$submitted) {
                vm.form.$setPristine();
                vm.form.$setUntouched();
            }
        }

        function _setBrowse() {
            _resetForm('dsBrowse');
            $location.path('/accueil');
        }

    }

})();

