(function () {

  'use strict';

  angular
    .module('app')
    .directive('navBarPilotage', navBarPilotage);

  function navBarPilotage () {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/navBarPilotage/navBarPilotage.template.html',
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