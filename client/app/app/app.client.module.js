(function () {

    'use strict';

    angular
        .module('app.app', [])
        .controller('AppController', AppController);

    AppController.$inject = ['$auth'];

    function AppController($auth) {

        var vm = this;


        vm.test = 'x5454x'; //!$auth.isAuthenticated();
        console.log(' vm.isSign : ' + vm.isSign);

    };

})();