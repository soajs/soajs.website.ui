"use strict";
var newsApp = app.components;

newsApp.controller('newsPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Releases",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
