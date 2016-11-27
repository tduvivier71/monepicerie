(function () {

	'use strict';

	angular
		.module('app.liste')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/liste', {
				templateUrl: 'app/liste/liste.template.html',
				controller: 'ListeController',
			    controllerAs: 'vm'
			});
	}

})();

