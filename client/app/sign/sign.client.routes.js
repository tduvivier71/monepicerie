(function () {

	'use strict';

	angular
		.module('app.sign')
		.config(config);

	config.$inject = ['$routeProvider'];

	function config ($routeProvider) {
		$routeProvider
			.when('/signin', {
				templateUrl: 'app/sign/signIn.edit.html',
				controller: 'SignController',
				controllerAs: 'vm'
			}).
			when('/signup', {
				templateUrl: 'app/sign/signUp.edit.html',
				controller: 'SignController',
				controllerAs: 'vm'
			}).
			when('/signout', {
				templateUrl: 'app/sign/signOut.view.html',
				controller: 'SignController',
			    controllerAs: 'vm'
			});
	}

})();

