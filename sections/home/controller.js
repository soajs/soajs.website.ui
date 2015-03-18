"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.fList = [];
	$http({
		method: 'GET',
		url: 'sections/features/data/features.json',
		cache: true
	}).success(function(data) {
		$scope.fList = data;
	});

	$http.get("sections/home/repos.json").success(function(data) {
		$scope.repos = data;
	});
}]);