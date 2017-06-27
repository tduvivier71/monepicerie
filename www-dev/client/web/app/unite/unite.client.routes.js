(function () {

	angular
		.module('app.unite')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider.
			when('/unite', {
				templateUrl: 'app/unite/unite.template.html',
				controller: 'UniteController',
			    controllerAs: 'vm'
			});
	}

})();

