(function () {

    'use strict';

    angular
        .module('app.accueil')
        .controller('AccueilController', AccueilController);

    AccueilController.$inject = ['$auth'];

    function AccueilController($auth) {

        var vm = this;

        vm.isAuthentified = $auth.isAuthenticated();

        console.log('AccueilController');

    }

})();