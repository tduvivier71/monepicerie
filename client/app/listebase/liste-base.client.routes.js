(function () {

	'use strict';

	angular
		.module('app.listeBase')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/listebase/', {
				templateUrl: 'app/listebase/liste-base.template.html',
				controller: 'ListeBaseController',
			    controllerAs: 'vm'
			});
	}

})();

