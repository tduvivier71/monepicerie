(function () {

	'use strict';

	angular
		.module('app.accueil')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.

			when('/accueil', {
				templateUrl: 'app/accueil/accueil.client.view.html'
			}).
			otherwise({
				redirectTo: '/'
		});
	}

})();

