(function () {

	'use strict';

	angular
		.module('app.produit')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/produit', {
				templateUrl: 'app/produit/produit.template.html',
				controller: 'ProduitController',
			    controllerAs: 'vm'
			});
	}

})();

