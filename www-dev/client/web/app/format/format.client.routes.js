(function () {

	'use strict';

	angular
		.module('app.format')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/format', {
				templateUrl: 'app/format/template.format.view.html',
				controller: 'FormatController',
			    controllerAs: 'vm'
			});
	}

})();

