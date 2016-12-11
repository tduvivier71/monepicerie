(function () {

	'use strict';

	angular
		.module('app.accueil')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'app/accueil/404.client.view.html',
				controller: 'AccueilController',
				controllerAs: 'vm'
			}).
			when('/accueil', {
				templateUrl: 'app/accueil/accueil.client.view.html',
            	controller: 'AccueilController',
            	controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/'
		});
	}

})();

