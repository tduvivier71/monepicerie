(function () {

	'use strict';

	angular
		.module('app.epicerie')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/epicerie', {
				templateUrl: 'app/epicerie/template.epicerie.view.html',
				controller: 'EpicerieController',
			    controllerAs: 'vm'
			});
	}

})();

