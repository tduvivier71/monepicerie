(function () {

    'use strict';

    angular
        .module('app')
        .directive('focusOn', focusOn);

    focusOn.$inject = ['$timeout', '$parse'];

    function focusOn($timeout, $parse) {

        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusOn);
                scope.$watch(model, function (value) {
                    console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                // to address @blesh's comment, set attribute value to 'false'
                // on blur event:
                element.bind('blur', function () {
                    console.log('blur');
                    scope.$apply(model.assign(scope, false));
                });
            }


            /*  return function(scope, elem, attr) {
             $timeout(function() {
             scope.$on('focusOn', function(e, name) {
             if(name === attr.focusOn) {
             elem[0].focus();
             }
             });
             },500);
             }; */
        };
    }

})();