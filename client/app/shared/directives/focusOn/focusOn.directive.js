(function () {

    'use strict';

    angular
        .module('app')
        .directive('focusOn', focusOn);

    focusOn.$inject = ['$timeout'];

    function focusOn($timeout) {
        return function(scope, elem, attr) {
            $timeout(function() {
                scope.$on('focusOn', function(e, name) {
                    if(name === attr.focusOn) {
                        elem[0].focus();
                    }
                });
            },100);
        };
    }

})();