"use strict";
var featuresApp = app.components;

featuresApp.controller('FeaturesPageCtrl', ['$scope', '$http', '$location', '$routeParams', '$anchorScroll', '$timeout', '$compile', '$route', function($scope, $http, $location, $routeParams, $anchorScroll, $timeout, $compile, $route) {
	$scope.featureList = [];
	$http.get('sections/features/data/features.json').success(function(data) {
		$scope.featureList = data;
	});

	$scope.scrollToAnchor = function() {
		if($routeParams && $routeParams.anchor) {
			$timeout(function() {
				var old = $location.hash();
				$location.hash($routeParams.anchor);
				var padEl = angular.element(document.getElementById($routeParams.anchor));
				padEl.html("<br/> <br/> <br/>");
				$compile(padEl.contents())($scope);
				$anchorScroll();
				//reset to old to keep any additional routing logic from kicking in
				$location.hash(old);
			}, 100, false);
		}
	};

	$scope.scrollToAnchor();
}]);