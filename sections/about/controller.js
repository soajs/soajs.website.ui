"use strict";
var newsApp = app.components;

newsApp.controller('aboutPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "About us",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
