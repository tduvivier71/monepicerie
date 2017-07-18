(function () {

    'use strict';

    angular
        .module('app.comparatif')
        .controller('ComparatifController', ComparatifController);

    ComparatifController.$inject = ['$log', '$auth', 'produitService', '$http',
                                   'comparatifService', 'toasterService','focus'];

    function ComparatifController($log, $auth, produitService, $http,
                                 comparatifService, toasterService, focus) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} categorie
         * @property  {boolean} favori
         * @function reset
         */

        /* Variables */
        vm.temp = {
            produit : String,
            marque : String,
            categorie : String,
            conditionnement : String
        };

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


        /** MULTI CATÉGORIE !!!! **/
        vm.selectOptionsMultiCategories = {
            placeholder: "Sélection de catégorie(s)...",
            dataTextField: "categorie",
            dataValueField: "_id",
            valuePrimitive: true, // TRUE EST OBLIGATOIRE
            autoBind: false,
            delay: 50,
            clearButton: true,
            noDataTemplate: 'Aucune correspondance...',
            suggest: true,
            dataSource: {
                transport: {
                    read: function (e) {
                        $http.get('/api/categorie')
                            .then(function success(response) {
                                e.success(response.data);
                            }, function error(response) {
                                alert('something went wrong');
                                console.log(response);
                            });
                    }
                }
            },
            change: function () {
                vm.filterCategorie();
            }
        };




        // ************************************************************************************************************/
        // Entry point function
        // ************************************************************************************************************/

        _init();

        function _init() {

            vm.produits = produitService.query();

            produitService.query('', function (result) {

                var i = 0;
                while (i < result.length) {

                 //    vm.temp.produit = result[i].produit;
                 // //   vm.temp.marque = result[i].marqueId.marque;
                 //    vm.temp.categorie = result[i].categorieId.categorie;
                 //    vm.temp.conditionnement = result[i].fullConditionnement;

                    vm.items.push({
                        produit : result[i].produit,
                        categorie : result[i].categorieId.categorie,
                        conditionnement : result[i].fullConditionnement
                        // ,  //marque : result[i].marqueId === '' ?  '' : result[i].marqueId.marque
                    });
                    i++;


                }


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
                        { name:'Marque', field: 'marque'},
                        { name:'Catégorie', field: 'categorie'},
                        { name:'Conditionnement', field: 'conditionnement'},
                    ],

                    data : vm.items
                };

            }

        }

    }

})();

