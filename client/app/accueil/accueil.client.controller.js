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

            vm.item = {};
            vm.form = {};           // Object
            vm.items = [];          // List of object

            vm.deleteListeRapide = deleteListeRapide;
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
                template:

            '<span>#: data.produit #</span><span data-ng-show="data.marque">#: data.marque #</span><span style="float:right; font-size: 0.7em; padding: 1px;"> #: data.categorieId.categorie #</span><br>' +
                '<span style=" font-size: 0.7em;">#: data.fullConditionnement #</span>',
                dataSource: {
                    transport: {
                        read: function (e) {
                            $http.get('/api/produit')
                                .then(function success(response) {
                                    e.success(response.data);
                                    console.log(response.data);
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
                            function (result) {
                                vm.items.push(result);
                                vm.produitWidget.close();
                                vm.produitWidget.value('');
                                toasterService.save(value);
                            },
                            function (error) {
                                toasterService.error(error.data.message);
                            }
                        );
                    }
                } finally {
                    vm.produitWidget.close();
                }
            }

            function deleteListeRapide() {
             //   var i = vm.items.length; //or 10
             //   while(i--) {
             //       vm.items.splice(i, 1);
             //   }
                vm.items.length = 0;
                var item = new listeRapideService();
                item.$deleteListeRapide();
                toasterService.error('La liste a été vidée.');

            }

            function removeItem(_item, _i) {
                _item.$remove(function (result) {
                    toasterService.remove(result.produit);
                    vm.items.splice(_i, 1);
                }, function (error) {
                    toasterService.error(error.data);
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