"use strict";
var newsApp = app.components;

newsApp.controller('platformPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "The platform",
		subTitle: "Built by engineers, for engineers"
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
