(function () {

	'use strict';

	angular
		.module('app.categorie')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/categorie', {
				templateUrl: 'app/categorie/categorie.template.html',
				controller: 'CategorieController',
			    controllerAs: 'vm'
			});
	}

})();

