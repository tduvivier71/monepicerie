(function () {

    'use strict';

    angular
        .module('app')
        .directive('unique', unique);

        focus.$inject = ['$http','$q'];

    function unique ($http,$q) {

        return {
            restrict: 'A',
           /* scope: {
                unique: '='
            },*/
            require: 'ngModel',
            // $scope,element,attrs,ngModel sont obligatoires
            link: function (scope, element, attributes, ngModel) {

                ngModel.$asyncValidators.unique = function(modelValue , viewValue) {

                    var userInput= modelValue || viewValue;
                    return $http.get('/api/categorie/unique/'+ userInput)
                        .then(function() {
                            console.log('reject');
                            return $q.reject();
                        }, function() {
                            console.log('resolve');
                            return $q.resolve();
                        });
                };
            }
        };
    }

})();