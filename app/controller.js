'use strict';
var app = angular.module('mainWebsite', ['ui.bootstrap', 'ngRoute']);

app.config([
	'$routeProvider',
	'$controllerProvider',
	'$compileProvider',
	'$locationProvider',
	'$filterProvider',
	'$provide',
	'$sceDelegateProvider',
	function ($routeProvider, $controllerProvider, $compileProvider,$locationProvider, $filterProvider, $provide, $sceDelegateProvider) {

		app.compileProvider = $compileProvider;
		navigation.forEach(function (navigationEntry) {
			if (navigationEntry.scripts && navigationEntry.scripts.length > 0) {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath,
					resolve: {
						load: ['$q', '$rootScope', function ($q, $rootScope) {
							var deferred = $q.defer();
							require(navigationEntry.scripts, function () {
								$rootScope.$apply(function () {
									deferred.resolve();
								});
							});
							return deferred.promise;
						}]
					}
				});
			}
			else {
				if (navigationEntry.tplPath && navigationEntry.tplPath !== '') {
					$routeProvider.when(navigationEntry.url.replace('#', ''), {
						templateUrl: navigationEntry.tplPath
					});
				}
			}
		});
		
		$routeProvider.otherwise({
			redirectTo: '/'
		});

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

		app.components = {
			controller: $controllerProvider.register,
			service: $provide.service
		};
	}
]);

app.controller('mainCtrl', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {
    $scope.pageTitle = "";
    $scope.titleLine2 = "";
	$scope.subTitle = "";

	$scope.$on('refreshPageTitle', function (event, args) {
        $scope.pageTitle = args.title;
        $scope.titleLine2 = args.titleLine2;
        $scope.subTitle = args.subTitle;
	});

	$scope.today = new Date().getTime();

	$scope.goToAnchor = function (section, anchor) {
		$location.path("/" + section + "/" + anchor);
	};

	$scope.$on('$routeChangeSuccess', function (event, current, previous) {
		$scope.currentLocation = $location.path();
		for (var entry = 0; entry < navigation.length; entry++) {
			var urlOnly = navigation[entry].url.replace('/:anchor?', '').replace("/:section?", '');
			if (urlOnly === $scope.currentLocation) {
				if (navigation[entry].title && navigation[entry].title !== '') {
					jQuery('head title').html(navigation[entry].title);
				}

				if (navigation[entry].keywords && navigation[entry].keywords !== '') {
					jQuery('head meta[name=keywords]').attr('content', navigation[entry].keywords);
				}

				if (navigation[entry].description && navigation[entry].description !== '') {
					jQuery('head meta[name=description]').attr('content', navigation[entry].description);
				}
			}
		}

		var subPagesDetection = $scope.currentLocation.match(/\//g);
		if (subPagesDetection.length > 1) {
			var p = $location.path().split(/\//);
			$scope.currentLocation = "/" + p[1];
		}

		if ($routeParams.anchor) {
			var sp = '/' + $routeParams.anchor;
			var p = $location.path().split(sp);
			$scope.currentLocation = p[0];
		}

	});

	$scope.copyrightYear = "2015";
	var thisYear = new Date().getFullYear();
	$scope.copyrightYear = 2015 + " - " + thisYear;

}]);

app.directive('topMenu', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/templates/topMenu.html'
	}
});


app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);

app.filter('toTrustedHtml', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);
