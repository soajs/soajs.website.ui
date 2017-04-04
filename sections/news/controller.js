"use strict";
var newsApp = app.components;

newsApp.controller('newsPageCtrl', ['$scope', function ($scope) {
	$scope.name = "";
	$scope.page = {
		"name": "Home"
	};

	var pageData = {
		title: "News",
		subTitle: "News"
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
