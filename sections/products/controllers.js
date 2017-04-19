"use strict";
var prodApp = app.components;

prodApp.controller('oauthPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "oAuth",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
}]);

prodApp.controller('uracPageCtrl', ['$scope', function ($scope) {
	var pageData = {
        title: "Urac",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
}]);

prodApp.controller('gcsPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "GCS",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
}]);

prodApp.controller('dashboardPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Dashboard",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
}]);

prodApp.controller('frameworkCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "The Framework",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
}]);
