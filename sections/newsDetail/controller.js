"use strict";
var newsApp = app.components;

newsApp.controller('newsDetailCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "News Room",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
