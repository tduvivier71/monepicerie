(function () {

	'use strict';

	angular
		.module('app.utilisateur')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/utilisateur', {
				templateUrl: 'app/utilisateur/utilisateur.template.html',
				controller: 'UtilisateurController',
			    controllerAs: 'vm'
			});
	}

})();

