"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.fList = [];
	
	$http.get("sections/home/repos.json").success(function (data) {
		$scope.repos = data;
	});
}]);