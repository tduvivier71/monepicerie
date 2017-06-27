(function () {

	'use strict';

	angular
		.module('app.home')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
        $routeProvider.
			when('/', {
				templateUrl: 'app/home/404.client.view.html',
				controller: 'AccueilController',
				controllerAs: 'vm'
			}).
			when('/accueil', {
				templateUrl: 'app/home/home.client.view.html',
            	controller: 'AccueilController',
            	controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/'
		});
	}

})();

