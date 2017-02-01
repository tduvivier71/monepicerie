(function () {

  'use strict';

  angular
    .module('app')
    .directive('navigation', navigation);

  navigation.$inject = ['$auth'];

  function navigation ($auth) {
    return {
      restrict: 'EA',
      templateUrl: 'app/shared/directives/navigation/navigation.template.html',
      link: function($scope) {
          $scope.$watch( function () { return $auth.isAuthenticated();}, function(newVal){

              $scope.isAuthentified = newVal;
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