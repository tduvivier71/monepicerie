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


            vm.addListeRapide = addListerapide;;
            vm.removeItem = removeItem;

            // ************************************************************************************************************/
            // Object configuration
            // ************************************************************************************************************/


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
                noDataTemplate: 'Aucune correspondance...',
                suggest: true,
                highlightFirst: true,
                change: function (e) {
                        console.log(this.value());
                },
                select: function(e) {
                    var item = e.item;
                   // var text = item.text();
                    console.log(item);
                    // Use the selected item or its text
                }
            }


            // ************************************************************************************************************/
            // Entry point function
            // ************************************************************************************************************/

            _init();

            // ************************************************************************************************************/
            // Public function
            // ************************************************************************************************************/

            function addListerapide() {

                var value = vm.produitWidget.value();
                try {
                    if (value) {
                        var item = new listeRapideService();
                        item.produit = value;
                        item.$save(
                            function (item) {
                                vm.items.push(item);
                                vm.produitWidget.close();
                                vm.produitWidget.value('');
                                toasterService.save(value);
                            },
                            function (e) {
                                toasterService.error(e.data.message);
                            }
                        );
                    }
                } finally {
                    vm.produitWidget.close();
                }
            }

            function removeItem(_item) {
                _item.$remove(function () {
                    toasterService.remove(_item.produit);
                    for (var i in vm.items) {
                        if (vm.items[i] === _item) {
                            vm.items.splice(i, 1);
                        }
                    }
                }, function (e) {
                    toasterService.error(e.data);
                });
            }





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