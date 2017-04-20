"use strict";
var prodApp = app.components;

prodApp.controller('productsPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Products",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.products = [
		{
			"color": "",
			title: "Framework",
			link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ",
			"text": ""
		},
		{
			"color": "red white-txt",
			title: "Dashboard",
			link: "https://soajsorg.atlassian.net/wiki/spaces/DSBRD",
			"text": ""
		},
		{
			"color": "green white-txt",
			title: "URAC",
			link: "https://soajsorg.atlassian.net/wiki/spaces/URAC",
			"text": ""
		},
		{
			"color": "blue white-txt",
			title: "oAuth",
			link: "https://soajsorg.atlassian.net/wiki/spaces/OAUT",
			"text": ""
		},
		{
			"color": "yellow-dark white-txt",
			title: "GCS",
			link: "https://soajsorg.atlassian.net/wiki/spaces/GCS",
			"text": ""
		}
	];
	
}]);

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
