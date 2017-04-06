(function () {

    'use strict';

    angular
        .module('app.accueil')
        .controller('AccueilController', AccueilController);

    AccueilController.$inject = ['$auth','$scope','$log', '$filter', '$location', '$http', '$q', '$sce',
        'toasterService', 'produitService', 'listeRapideService', 'focus', 'uniteService', 'formatService', 'epicerieService','marqueService'];

        function AccueilController($auth, $scope, $log, $filter, $location, $http, $q, $sce,
                                   toasterService, produitService, listeRapideService, focus, uniteService, formatService, epicerieService, marqueService) {

            var vm = this;

            vm.isAuthentified = $auth.isAuthenticated();

            vm.item = {};
            vm.form = {};           // Object
            vm.items = [];          // List of object

            //    vm.addListeRapide = addListerapide;

            vm.inputOptionsProduit = {
                placeholder: "Sélectionnez un produit...",
                dataTextField: "produit",
                dataValueField: "produit",
                filter: "contains",
                valuePrimitive: false, // false obligatoire car c est un objet
                autoBind: false, // obligatoire
                dataSource: {
                    transport: {
                        read: function (e) {
                            $http.get('/api/produit')
                                .then(function success(response) {
                                    e.success(response.data);
                                }, function error(response) {
                                    alert('something went wrong')
                                    console.log(response);
                                });
                        }
                    }
                },
                clearButton: true,
                delay: 50,
                //    noDataTemplate: vm.no_templateCat2,
                suggest: true,
                highlightFirst: true,
                change: function (e) {
                    if (this.select() < 0) {
                        this.value("");
                    }
                    else {
                        console.log('XX');
                        // vm.item.categorieId.categorie = this.text();
                    }
                }
            }


            // ************************************************************************************************************/
            // Entry point function
            // ************************************************************************************************************/

            _init();

            // ************************************************************************************************************/
            // Public function
            // ************************************************************************************************************/


            // ************************************************************************************************************/
            // Private function
            // ************************************************************************************************************/

            function _init() {

                listeRapideService.query('', function (result) {
                    vm.items = result;

                });

            }

        }


})();