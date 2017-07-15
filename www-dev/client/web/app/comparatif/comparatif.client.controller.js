(function () {

    'use strict';

    angular
        .module('app.comparatif')
        .controller('ComparatifController', ComparatifController);

    ComparatifController.$inject = ['$log', '$auth', 'produitService',
                                   'comparatifService', 'toasterService','focus'];

    function ComparatifController($log, $auth, produitService,
                                 comparatifService, toasterService, focus) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} categorie
         * @property  {boolean} favori
         * @function reset
         */

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object

        vm.myData = [{
            "firstName": "Cox",
            "lastName": "Carney"
        }];




        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        function _init() {

            produitService.query('', function (result) {
              //  vm.items = result;

                vm.gridOptions = {
                    enableSorting: true,
                    columnDefs: [
                        { name:'produit', field: 'produit' }
                    ],
                    data :  result
                };


            });

        }

    }

})();

