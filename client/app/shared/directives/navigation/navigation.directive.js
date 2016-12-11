(function () {

  'use strict';

  angular
    .module('app')
    .directive('navigation', navigation);

     navigation.$inject = ['$auth'];

  function navigation ($auth) {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/navigation/navigation.template.html',
      controller: function($scope, $location) {

        $scope.isAuthentified = $auth.isAuthenticated();
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