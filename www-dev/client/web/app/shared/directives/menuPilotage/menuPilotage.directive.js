(function () {

  'use strict';

  angular
    .module('app')
    .directive('menuPilotage', menuPilotage);

  function menuPilotage () {
    return {
      restrict: 'E',
      templateUrl: 'app/shared/directives/menuPilotage/menuPilotage.template.html',
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