(function () {

  'use strict';

  angular
    .module('app')
    .directive('pageFooter', pageFooter);

  function pageFooter () {
    return {
      restrict: 'EA',
      scope: {
        content: '@'
      },
      templateUrl: 'app/shared/directives/pageFooter/pageFooter.template.html'
    };
  }

})();