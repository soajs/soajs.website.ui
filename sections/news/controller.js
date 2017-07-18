"use strict";
var newsApp = app.components;

newsApp.controller('newsPageCtrl', ['$scope', '$http', function ($scope, $http) {
	var pageData = {
		title: "Releases",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.newsList = [];
    $http.get("sections/news/releases.json").success(function(data) {
	    $scope.newsList = data;
    });

	
}]);
