(function () {

  'use strict';

  angular
    .module('app')
    .directive('validateInput', validateInput);

  function validateInput () {
    return {
      restrict: 'EA',
      scope: {
        form: '=',
        field: '='
      },
      templateUrl: 'app/shared/directives/validateInput/validateInput.template.html'
    };
  }

})();