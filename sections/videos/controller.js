"use strict";
var videosApp = app.components;

videosApp.controller('videosPageCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Videos",
		class: "platform",
		subTitle: ""
	};
	
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.videos = [
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		},
		{
			"name": "SOAJS JSConf",
			"description": "Learn how to Use SOAJS by watching the JSConf Demo",
			"link": "X-NOhQp3wL0"
		}
	];
}]);
