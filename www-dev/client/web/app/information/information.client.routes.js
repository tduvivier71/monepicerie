(function () {

	'use strict';

	angular
		.module('app.information')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
        $routeProvider.
			when('/information', {
				templateUrl: 'app/information/information.client.view.html',
            	controller: 'InformationController',
            	controllerAs: 'vm'
			}).
			otherwise({
				redirectTo: '/'
		});
	}

})();

