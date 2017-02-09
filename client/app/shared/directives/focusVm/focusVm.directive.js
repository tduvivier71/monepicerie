(function () {

    'use strict';

    angular
        .module('app')
        .directive('focusVm', focusVm);

    focusVm.$inject = ['$timeout', '$parse'];


    function focusVm($timeout, $parse) {
        return {
            restrict: 'AC',
            link: function(_scope, _element) {
                $timeout(function(){
                    _element[0].focus();
                }, 0);
            }
        };
    }

    /*  function focusVm($timeout, $parse) {

        return {
            //scope: true,   // optionally create a child scope
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusOnVm);
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
        };
    } */

})();