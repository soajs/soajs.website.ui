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

	$http.get("https://api.github.com/repos/soajs/soajs/commits?client_id=c6ef8804597602e35576&client_secret=3cfd267e548c28e7bad8d581c6eb612af7df0719").success(function(data) {
		var lastCommit = data[0];
		var ago = new Date(lastCommit.commit.author.date);

		$scope.lastCommit = {
			author: lastCommit.commit.author.name,
			ago: moment([ago.getFullYear(), ago.getMonth(), ago.getDate()]).fromNow()
		};
	});
}]);