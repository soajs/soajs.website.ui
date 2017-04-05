"use strict";
var newsApp = app.components;

newsApp.controller('casePageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Case Studies",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
}]);
