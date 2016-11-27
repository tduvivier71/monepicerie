(function () {

  'use strict';

  angular
    .module('app')
    .directive('pageHeader', pageHeader);

  function pageHeader () {
    return {
      restrict: 'EA',
      scope: {
        content: '@'
      },
      templateUrl: 'app/shared/directives/pageHeader/pageHeader.template.html'
    };
  }

})();