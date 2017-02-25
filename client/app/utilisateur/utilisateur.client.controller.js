/**
 * signin : Se Connecter
 */

(function () {

    'use strict';

    angular
        .module('app.utilisateur')
        .controller('UtilisateurController', UtilisateurController);

    UtilisateurController.$inject = ['$q',
                                     'toasterService', 'focus', 'utilisateurService', '$auth'];

    function UtilisateurController($q,
         toasterService, focus, utilisateurService, $auth) {

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
            courriel:'',
            courrielAlt:'',
            partagerProduits: false,
            reset: function () {
                this.prenom = '';
                this.nom = '';
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
           // _cancelEdit();
        }


        function save(_form, _item) {
            if (!_form.$valid) {
                focus('prenom_input_focus');
                return;
            }
            _update(_item);
        }

        function getPayLoad() {
            alert(JSON.stringify($auth.getPayload().sub));
        }

        // ************************************************************************************************************/
        // Private function
        // ************************************************************************************************************/

        function _init() {
            var queryParam = { id: $auth.getPayload().sub};
            vm.items = utilisateurService.query(queryParam);
            vm.item = vm.items[0];

            focus('prenom_focus');
        }

        function _update(_item) {
            _item.$update(
                function (result) {
                    toasterService.update(_item.nom);
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

        function _revertSelectedItem() {
            angular.forEach(vm.items, function (item, key) {
                if (item._id === vm.selectedItem._id) {
                    vm.items[key] = vm.selectedItem;
                }
            });
            vm.selectedItem = null;
        }


        function _setBrowse() {
            _resetForm('dsBrowse');
        }




    }

})();

