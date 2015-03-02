"use strict";
var featuresApp = app.components;

featuresApp.controller('FeaturesPageCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.featureList = [];
	$http.get('sections/features/data/features.json').success(function(data) {
		$scope.featureList = data;
	});
}]);