(function () {

    'use strict';

    angular
        .module('app.comparatif')
        .controller('ComparatifController', ComparatifController);

    ComparatifController.$inject = ['$log', '$auth', 'produitService', '$http', 'uiGridGroupingConstants',
                                   'comparatifService', 'toasterService','focus'];

    function ComparatifController($log, $auth, produitService, $http, uiGridGroupingConstants,
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
            enableColumnMenu: true,
            enableColumnResizing: true,
            paginationPageSizes: [25, 50, 75],
            paginationPageSize: 25,

            onRegisterApi: function(gridApi){
                vm.gridApi = gridApi;
            },
            columnDefs: [
                { name:'Produit', field: 'produit', grouping: { groupPriority: 0 }, headerCellClass: vm.highlightFilteredHeader },
                { name:'Marque', field: 'marque'},
                { name:'Catégorie', field: 'categorie'},
                { name:'Conditionnement', field: 'conditionnement'},
                { name:'Épicerie', field: 'epicerie'},
                { name:'Prix', field: 'prix'},
                { name:'Coût par', field: 'coutPar'}
            ],

            data : vm.items
        };

        // vm.myData = [{
        //     "prenom": "Cox",
        //     "nom": "Carney"
        // },
        //     {
        //         "prenom": "larry",
        //         "nom": "Carney"
        //     }];
        //
        // vm.gridOptions = {
        //     treeRowHeaderAlwaysVisible: false,
        //     columnDefs: [
        //       { name:'nom', field: 'nom',  grouping: { groupPriority: 0 }},
        //         { name:'prenom', field: 'prenom'}
        //     ],
        //     data : vm.myData
        // };


        vm.loadGrid = loadGrid;



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

                    vm.temp = {};

                     vm.temp.produit = result[i].produit;
                     vm.temp.marque =  typeof  result[i].marqueId === 'undefined' ?  '' : result[i].marqueId.marque
                     vm.temp.categorie = result[i].categorieId.categorie;
                     vm.temp.conditionnement = result[i].fullConditionnement;

                    // vm.items.push(vm.temp);

                     if (result[i].historiques.length > 0) {

                         var j = 0;
                         while (j < result[i].historiques.length) {

                             vm.temp2 = {};

                             vm.temp2.produit = vm.temp.produit;
                             vm.temp2.marque =  vm.temp.marque;
                             vm.temp2.categorie = vm.temp.categorie;
                             vm.temp2.conditionnement = vm.temp.conditionnement;
                             vm.temp2.epicerie = result[i].historiques[j].epicerieId.epicerie;
                             vm.temp2.prix = kendo.toString(result[i].historiques[j].prix, "c2");
                             vm.temp2.coutPar = coupPar(result[i].historiques[j].prix,
                                                        result[i].conditionnement.quantite,
                                                        result[i].conditionnement.nombre,
                                                        result[i].uniteId.operation,
                                                        result[i].uniteId.nombre,
                                                        result[i].uniteId.coutParId.abreviation);

                             vm.items.push(vm.temp2);

                             j++;
                         }

                     } else {
                         vm.items.push(vm.temp);
                     }


                 /*   vm.items.push({
                        produit : result[i].produit,
                        categorie : result[i].categorieId.categorie,
                        conditionnement : result[i].fullConditionnement
                        // ,  //marque : result[i].marqueId === '' ?  '' : result[i].marqueId.marque
                    }); */


                    i++;


                }


            });

        }

        function coupPar(price, qtt, nb, operation, nombre, abr) {

            var x = '';

            if (isNaN(price) || isNaN(qtt) || isNaN(nb) || operation==='' || qtt <= 0 || nb <= 0) {
                return x;
            }

            if (operation==='aucune') {
                x = price / (nb * qtt);
                return x.toFixed(7)  + '/' + abr;
            }

            if (isNaN(nombre) || nombre <= 0) {
                return x;
            }

            if (operation==='division') {
                x = price / (nb * qtt);
                x = x / nombre;
            }

            if (operation==='multiplication') {
                x = price / (nb * qtt);
                x = x * nombre;
            }

            return x.toFixed(7) + '/' + abr;
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
                    enableColumnMenu: true,
                    enableColumnResizing: true,
                    paginationPageSizes: [25, 50, 75],
                    paginationPageSize: 25,

                    onRegisterApi: function(gridApi){
                        vm.gridApi = gridApi;
                    },
                    columnDefs: [
                        { name:'Produit', field: 'produit', grouping: { groupPriority: 0 }, headerCellClass: vm.highlightFilteredHeader },
                        { name:'Marque', field: 'marque'},
                        { name:'Catégorie', field: 'categorie'},
                        { name:'Conditionnement', field: 'conditionnement'},
                        { name:'Épicerie', field: 'epicerie'},
                        { name:'Prix', field: 'prix'}
                    ],

                    data : vm.items
                };

            }

        }

    }

})();

