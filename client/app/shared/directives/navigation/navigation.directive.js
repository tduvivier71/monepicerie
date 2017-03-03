(function () {

  'use strict';

  angular
    .module('app')
    .directive('navigation', navigation);

  navigation.$inject = ['$auth', 'utilisateurService'];

  function navigation ($auth, utilisateurService) {
    return {
      restrict: 'EA',
      templateUrl: 'app/shared/directives/navigation/navigation.template.html',
      link: function($scope) {

        $scope.$watch( function () { return $auth.isAuthenticated();}, function(newVal){
              $scope.isAuthentified = newVal;
              if ($scope.isAuthentified) {

                  var queryParam = { id: $auth.getPayload().sub};
                  // vm.item = utilisateurService.get(queryParam);
                  utilisateurService.get(queryParam, function (result) {
                      $scope.fullNom = result.prenom + ' ' + result.nom;
                  });
              }
           });
      },
      controller: function($scope, $location) {
        $scope.isActive = function (path) {
          var currentPath = $location.path().split('/')[1];
          if (currentPath.indexOf('?') !== -1) {
            currentPath = currentPath.split('?')[0];
          }
          return currentPath === path.split('/')[1];
        };
      }
    };
  }

})();