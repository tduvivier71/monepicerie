(function () {

	'use strict';

	angular
		.module('app.marque')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/marque', {
				templateUrl: 'app/marque/marque.template.html',
				controller: 'MarqueController',
			    controllerAs: 'vm'
			});
	}

})();

