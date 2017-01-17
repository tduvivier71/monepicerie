(function () {

	'use strict';

	angular
		.module('app', ['ngRoute', 'ngResource', 'ngMessages',  'ngSanitize', 'ngAnimate', 'ngToast', 'ui.sortable',
			'ui.bootstrap', 'pascalprecht.translate', 'angularMoment', 'kendo.directives',
			'app.accueil', 'app.categorie','app.epicerie','app.unite','app.format','app.produit', 'app.marque','app.liste',
			'app.utilisateur','app.sign','satellizer', 'ui.toggle','uiGmapgoogle-maps']); //ngmap

	angular
		.module('app')
		.config(config)
        .controller('indexCtrl', indexCtrl)
	    .value('language', 'fr-CA')
		.run(runApp)

		/**
		 * Config
		 */

		config.$inject = ['$locationProvider','$translateProvider','$translatePartialLoaderProvider','ngToastProvider',
			'$authProvider','uiGmapGoogleMapApiProvider'];

		function config($locationProvider,$translateProvider,$translatePartialLoaderProvider, ngToastProvider,
			$authProvider, uiGmapGoogleMapApiProvider) {

			moment().locale('fr_ca');

			$authProvider.httpInterceptor = function() { return true; };
			$authProvider.withCredentials = false;
			$authProvider.tokenRoot = null;
			$authProvider.baseUrl = '/';
			$authProvider.loginUrl = '/auth/signin';
			$authProvider.signupUrl = '/auth/signup';
			$authProvider.unlinkUrl = '/auth/unlink/';
			$authProvider.tokenName = 'token';
			$authProvider.tokenPrefix = 'satellizer';
			$authProvider.tokenHeader = 'Authorization';
			$authProvider.tokenType = 'Bearer';
			$authProvider.storageType = 'localStorage';

			$authProvider.facebook({
				clientId: '1844385705796965'
			});

			// Google
			$authProvider.google({
				clientId: '274681176171-vvdvrji6m83iputtln5k0ehksbfodjst.apps.googleusercontent.com'
			});

			// Windows Live
			$authProvider.live({
				clientId: '2ae83841-4aa0-43f3-98c9-3d1959864dd7'
			});

			ngToastProvider.configure({
				animation: 'fade',
				combineDuplications: true,
				dismissButton: true,
				newestOnTop: false
				// or 'fade'
			});

			$locationProvider.html5Mode({
				enabled: false
				//	,	requireBase: false
			});

			$translatePartialLoaderProvider.addPart('accueil');
			$translatePartialLoaderProvider.addPart('categorie');
			$translatePartialLoaderProvider.addPart('produit');
			$translatePartialLoaderProvider.addPart('unite');
			$translatePartialLoaderProvider.addPart('liste');
			$translatePartialLoaderProvider.addPart('utilisateur');
			$translatePartialLoaderProvider.addPart('sign');

			$translateProvider.useLoader('$translatePartialLoader', {
				urlTemplate: '/assets/i18n/{part}/{lang}.json'
			});
			$translateProvider.preferredLanguage('fr-CA');

            uiGmapGoogleMapApiProvider.configure({
                key: "AIzaSyABE67zQOFZrbXJIow-5-kLVD4FpWf52KQ", //Clé pour utiliser l'API
                v: '3.21', //Par défaut la version la plus récente disponible
                libraries: 'places, geometry,visualization' //Librairies supplémentaires
            });

		}

		/**
		 * indexCtrl
		 */

		indexCtrl.$inject = ['$scope', '$auth', '$location'];

		function indexCtrl ($scope, $auth, $location) {

			$scope.isAuthentified = $auth.isAuthenticated();
			$scope.currentPath = $location.path();
		}

		/**
		 * runApp
		 */

        runApp.$inject = ['$rootScope', '$translate', '$location', '$auth','$route'];

		function runApp($rootScope, $translate, $location, $auth, $route) {

		    $rootScope.$on('$translatePartialLoaderStructureChanged', function ()
				{
					$translate.refresh();
				}
			);

          // $location.path('/accueil');

            if ($auth.isAuthenticated()) {
                console.log('Autorisé');
                $location.path('/produit'); // todo accueil



            } /*else {
                console.log('Non autorisé');
                event.preventDefault();
                $location.path('/signin');
            }*/

            $rootScope.$on('$locationChangeStart', function (event, newUrl, oldUrl) {
                    console.log('$locationChangeStart : ' + newUrl );
                    if (!$auth.isAuthenticated()) {
                        console.log('$locationChangeStart : Non autorisé');
                        //event.preventDefault();
						var x = newUrl;
						var n = x.search('signup');
						if (n === -1) {
                            $location.path('/signin');
                        } else {
                            $location.path('/signup');
						}
                    } else {
                        console.log('$locationChangeStart : autorisé');
                    }
                }
            );

//            $location.path('/accueil');


		}


})();
