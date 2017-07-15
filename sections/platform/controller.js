"use strict";
var platformApp = app.components;

platformApp.controller('platformPageCtrl', ['$scope', function ($scope) {
	var pageData = {
        title: "The platform",
        class: "platform"
		// subTitle: "Built by engineers, for engineers"
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);
