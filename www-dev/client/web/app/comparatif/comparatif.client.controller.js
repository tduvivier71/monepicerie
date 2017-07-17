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
        vm.start = false;


        vm.gridOptions = {
            enableSorting: true,
            enableFiltering: true,
            enableColumnMenu: false,
            enableColumnResizing: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,
        };


        vm.loadGrid = loadGrid;

        vm.myData = [{
            "prenom": "Cox",
            "nom": "Carney"
        }];




        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        function _init() {

            vm.produits = produitService.query();

            produitService.query('', function (result) {
                vm.items = result;
            });

        }


        vm.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
            if( col.filters[0].term ){
                return 'header-filtered';
            } else {
                return '';
            }
        };


        function loadGrid() {

            if (vm.start) {

                vm.gridOptions = {
                    enableSorting: true,
                    enableFiltering: true,
                    enableColumnResizing: true,
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25,
                    onRegisterApi: function(gridApi){
                        vm.gridApi = gridApi;
                    },
                    columnDefs: [
                        { name:'Produit', field: 'produit',   enableColumnMenu: false, headerCellClass: vm.highlightFilteredHeader },
                        { name:'Marque', field: 'marqueId.marque'},
                        { name:'Catégorie', field: 'categorieId.categorie'},
                        { name:'Conditionnement', field: 'fullConditionnement'},
                    ],

                    data : vm.items
                };

            }

        }

    }

})();

