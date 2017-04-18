(function () {

    'use strict';

    angular
        .module('app.comparatif')
        .controller('ComparatifController', ComparatifController);

    ComparatifController.$inject = ['$log', '$auth',
                                   'comparatifService', 'toasterService','focus'];

    function ComparatifController($log, $auth,
                                 comparatifService, toasterService, focus) {

        var vm = this;

        /**
         * typedef {Object}
         * @property  {string} categorie
         * @property  {boolean} favori
         * @function reset
         */

        /* Variables */
        vm.item = {};           // Object
        vm.items = [];          // List of object
        vm.form = {};           // Object

    }

})();

