(function () {

    'use strict';

    angular
        .module('app')
        .directive('modal', modal);

    function modal () {
        return {
            restrict: 'EA',
            scope: {
                title: '=modalTitle',
                header: '=modalHeader',
                body: '=modalBody',
                footer: '=modalFooter',
                callbackbuttonleft: '&ngClickLeftButton',
                callbackbuttonright: '&ngClickRightButton',
                handler: '=lolo'
            },
            templateUrl: 'app/shared/directives/selectItem/selectItem.template.html',
            transclude: true,
            controller: function ($scope) {
                $scope.handler = 'pop';
            },
        };
    }

})();
