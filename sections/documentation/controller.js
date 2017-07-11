"use strict";
var documentationApp = app.components;

documentationApp.controller('documentationtCtrl', ['$scope', '$http', '$routeParams', '$compile', 'loadFileContent', 'loadHTMLContent', 'loadBASHContent', 'loadJsonFileContent', function($scope, $http, $routeParams, $compile, loadFileContent, loadHTMLContent, loadBASHContent, loadJsonFileContent) {
	$scope.isArray = angular.isArray;
	$scope.path = "sections/documentation/content/";

	$scope.loadCode = function(path, elId) {
		loadFileContent($scope, path, elId);
	};

	$scope.loadJson = function(path, elId) {
		loadJsonFileContent($scope, path, elId);
	};

	$scope.loadSection = function(sectionName, subSectionName) {
		var angularElement = angular.element(document.getElementById('documentationPreview'));
		$http.get('sections/documentation/content/' + sectionName + '/' + subSectionName + '/data.json').success(function(data) {
			$scope[subSectionName.replace("-", "_")] = data;
		}).error(function(error) {
			console.log(error);
		});

		$http.get('sections/documentation/' + sectionName + '/' + subSectionName + ".html").success(function(data) {
			angularElement.html(data);
			$compile(angularElement.contents())($scope);
			renderCodeSnippets();
		}).error(function() {
			console.log("Error fetching documentation page. Please try again.");
		});

		$scope.docuLink = "/documentation/" + sectionName + '/' + subSectionName;
	};

	if($routeParams && $routeParams.section && $routeParams.subSection) {
		$scope.loadSection($routeParams.section, $routeParams.subSection);
	}
	else if($routeParams && $routeParams.section) {
		var angularElement = angular.element(document.getElementById('documentationPreview'));
		$http.get('sections/documentation/services/' + $routeParams.section + ".html").success(function(data) {
			angularElement.html(data);
			$compile(angularElement.contents())($scope);
			renderCodeSnippets();
		}).error(function() {
			console.log("Error fetching documentation page. Please try again.");
		});
	}

	$scope.loadHTML = function(path, elId) {
		loadHTMLContent($scope, path, elId);
	};

	$scope.loadBASH = function(path, elId) {
		loadBASHContent($scope, path, elId);
	};

	$scope.scrollToDiv = function(divId, prefix) {
		jQuery("html, body").delay(500).animate({scrollTop: jQuery('#' + divId).offset().top - prefix}, 1000);
	};
	
	$scope.spaces = [
		{
			"name": "SOAJS",
			"description": "Service Oriented Architecture built using JavaScript, SOAJS is a open source platform as a service (aPaaS) that offers a fully ready to use CORE framework and Platform to build, deploy, manage and troubleshoot clouds of microservices & daemons.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/SOAJ",
		},
		{
			"name": "Dashboard",
			"description": "The SOAJS Dashboard is a ready made product designed to assist you in managing your cloud of microservices. The Dashboard acts like a Control Panel allowing you to control, develop, manage, deploy, monitor and operate your products through simple clicks.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/DSBRD"
		},
		{
			"name": "Composer",
			"description": "Speed things up by using the SOAJS composer and organize your daemon's Jobs and microservice's layers (REST - Models - Business Logic).",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/COMP"
		},
		{
			"name": "Generic Content Service",
			"description": "Generic Content Service is a ready made product that offers a fully mature and ready to use UI wizard that helps you build any informative content microservice along with it's management UI module at the same time.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/GCS"
		},
		{
			"name": "Installer",
			"description": "Deploy Local and Remote clouds using the SOAJS installer. Go live by using the Dashboard and the ready made services.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/IN"
		},
		{
			"name": "Controller",
			"description": "SOAJS Controller is the main gateway to the cloud of microservices. The Controller balances the load arriving to services, provides supports for CORS and keeps an eye on services' status inside the cloud.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/CON"
		},
		{
			"name": "URAC",
			"description": "User Registration and Access Control ( URAC ), is a multitenant service that provides REST APIs to work and manage users accounts, groups and access levels for all tenants.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/URAC"
		},
		{
			"name": "oAuth",
			"description": "SOAJS oAuth is a multitenant microservice that provides out of the box implementation of oAuth 2.0 that you can use to secure your cloud.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/OAUT"
		},
		{
			"name": "Proxy",
			"description": "SOAJS Proxy is a microservice that redirects requests between deployed and running environments.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/PROX"
		},
		{
			"name": "Swagger",
			"description": "SOAJS Swagger Editor allows you to create a microservice by simply writing the documentation of its APIs.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/SWAG"
		},
		{
			"name": "Updates & Upgrades",
			"description": "Get Familiar with how to update and upgrade deployed Services/Daemons and UI Sections. Learn how the SOAJS Dashboard provides tons of functionality and features that help you apply these updates with just clicks of a button.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/UU"
		}
	];
}]);