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
			"name": "Install SOAJS Dashboard",
			"description": "Learn how to install the Dashboard which gives you API management, lifecycle, gateway and API catalog",
			"link": "UjgfoRzE0ag"
		},
		{
			"name": "Configure GIT and Build Your API Catalog with SOAJS",
			"description": "Learn how to configure GIT and build an API Catalog in our SOAJS Dashboard",
			"link": "BNTUChhmZJk"
		},
		{
			"name": "API Management, Lifecycle and Packaging with SOAJS",
			"description": "Learn how SOAJS platform delivers a comprehensive API management, lifecycle, gateway and packaging strategy. From a developer standpoint, this is a smart solution because you do not need to start building from scratch",
			"link": "OrdKOy6vNtY"
		},
		{
			"name": "Create & Deploy Environment with SOAJS",
			"description": "Learn how a multi-environment can be used. This feature is frequently used within in enterprise development scenarios where developers create and modify code in a development or testing environment.",
			"link": "icUQ40o1zqk"
		},
		{
			"name": "Catalog Deployment with SOAJS",
			"description": "Learn how to configure Catalogue Deployment for new and existing systems as well as any repositories written in php, java, nodejs, ruby, and other technologies.\n" +
			"\n" +
			"Catalog Deployment quickly delivers the ability to install a recipe for all the systems and also links to existing deployment tools like Chef, Team City and others",
			"link": "kHUCXRwKoQQ"
		},
		{
			"name": "Test your API with SOAJS",
			"description": "Learn the quick and easy way to test your API’s with SOAJS Swagger Simulator",
			"link": "uxON9H7RWog"
		},
		{
			"name": "Configure Continuous Integration with SOAJS",
			"description": "Learn how to configure Continuous Integration. Continuous Integration is an amazing feature that allows you to automatically update services or release a new version of your service",
			"link": "b87ebiu11Cg"
		},
		{
			"name": "Continuous Integartion & Delivery with SOAJS",
			"description": "Learn how to test the Continuous Integration & Delivery component and release updates with one click!",
			"link": "0DxR8iXhe4M"
		},
		{
			"name": "Analytics, Metrics and TechOps wtih SOAJS",
			"description": "Get familiar with the power of our tools used for Analytics, Metrics and DevOps/TechOps",
			"link": "rgyK9AnB4io"
		}
	];
}]);
