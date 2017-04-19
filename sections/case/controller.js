"use strict";
var caseApp = app.components;
caseApp.controller('casePageCtrl', [ '$scope', function ($scope) {
	var pageData = {
		title: "Case Studies",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
} ]);


caseApp.controller('caseDetailCtrl', [ '$scope', function ($scope) {
	var pageData = {
		title: "Case Studies",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
} ]);
