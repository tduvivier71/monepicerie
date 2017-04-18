(function () {

	'use strict';

	angular
		.module('app.comparatif')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/comparatif', {
				templateUrl: 'app/comparatif/comparatif.template.html',
				controller: 'ComparatifController',
			    controllerAs: 'vm'
			});
	}

})();

