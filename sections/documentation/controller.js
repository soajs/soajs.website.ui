"use strict";
var docApp = app.components;

docApp.controller('docPageCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	var pageData = {
		title: "Documentation",
		class: "platform",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.redirecting = false;
	$scope.confluencePage = function(link){
		$scope.redirecting = true;
		//todo: scroll to top
		$timeout(function(){
			window.open(link);
		}, 5000);
	};
	
	$scope.docs = [
		{
			"name": "Framework",
			"description": "Service Oriented Architecture built using JavaScript, SOAJS is a open source platform as a service (aPaaS) that offers a fully ready to use CORE framework and Platform to build, deploy, manage and troubleshoot clouds of microservices & daemons.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/SOAJ"
		},
		{
			"name": "API Gateway",
			"description": "SOAJS API Gateway is the main entry point to the cloud of microservices. The API Gateway balances the load arriving to services, provides supports for CORS and keeps an eye on services' status inside the cloud.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/CON"
		},
		{
			"name": "Microservices",
			"description": "SOAJS is built out of many microservices combined together to create the products available as: SOAJS Marketplace, Multi Environment Orchestration and Deployment, SOAJS Multi Tenant Authentication and Authorization Gateway, etc ...",
			"link": "https://soajsorg.atlassian.net/wiki/x/KYApVQ"
		},
		{
			"name": "Middleware",
			"description": "The SOAJS Middleware allows you to modernize existing API and benefit from the features that SOAJS offers without changing your code.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/MW"
		},
		{
			"name": "Console",
			"description": "The SOAJS Console is a ready made product designed to assist you in managing your cloud of microservices. The Console acts like a Control Panel allowing you to control, develop, manage, deploy, monitor and operate your products through simple clicks.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/DSBRD"
		},
		{
			"name": "Composer",
			"description": "Speed things up by using the SOAJS composer and organize your daemon's Jobs and microservice's layers (REST - Models - Business Logic).",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/COMP"
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
	
	$scope.sidebar = [
		{
			name: "Framework",
			entries: [
				{
					name: "Create a Service",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61347270/Service"
				},
				{
					name: "Create a Daemon",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61347851/Daemon"
				},
				{
					name: "Create a UI Module",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61708923/UI+Module"
				},
				{
					name: "Request",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61353462/Request"
				},
				{
					name: "Response",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61353659/Response"
				},
				{
					name: "Environment Variables",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61975478/Environment+Variables"
				},
				{
					name: "Profiles",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61975404/Profiles"
				},
				{
					name: "Registry",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61354289/Registry"
				},
				{
					name: "IMFV",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61353979/IMFV"
				},
				{
					name: "Security",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61355074/Security"
				},
				{
					name: "Access Levels",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61978469/Access+Levels"
				},
				{
					name: "Services Config",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61817554/Services+Config"
				},
				{
					name: "Service Operations & Maintenance",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61862866/"
				},
				{
					name: "Catalog Recipes",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/62493834/Catalog+Recipes"
				}
			]
		},
		{
			name: "Databases",
			entries: [
				{
					name: "Mongo Client Driver",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61991783/Mongo+Client+Driver"
				}
			]
		},
		{
			name: "Features",
			entries: [
				{
					name: "Architecture",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61992077/Architecture"
				},
				{
					name: "Productization",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61517242/Productization"
				},
				{
					name: "Multitenancy",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61509025/Multitenancy"
				},
				{
					name: "Multi Environment",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/61991576/Multi+Environment"
				}
			]
		},
		{
			name: "Ready Made Services",
			entries: [
				{
					name: "API Gateway",
					link: "https://soajsorg.atlassian.net/wiki/spaces/CON"
				},
				{
					name: "Microservices",
					link: "https://soajsorg.atlassian.net/wiki/x/KYApVQ"
				},
				{
					name: "Middleware",
					link: "https://soajsorg.atlassian.net/wiki/spaces/MW"
				},
				{
					name: "Console",
					link: "https://soajsorg.atlassian.net/wiki/spaces/DSBRD"
				}
			]
		},
		{
			name: "Components",
			entries: [
				{
					name: "Swagger",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SWAG"
				},
				{
					name: "Composer",
					link: "https://soajsorg.atlassian.net/wiki/spaces/COMP"
				},
				// {
				// 	name: "GCS",
				// 	link: "https://soajsorg.atlassian.net/wiki/spaces/GCS"
				// }
			]
		},
		{
			name: "UI SDK",
			entries: [
				{
					"name": "UI Listing Grid",
					"link": "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/63861622/UI+Listing+Grid"
				},
				{
					"name": "UI Form",
					"link": "https://soajsorg.atlassian.net/wiki/spaces/SOAJ/pages/63862512/UI+Form"
				}
			]
		}
	];
}]);
