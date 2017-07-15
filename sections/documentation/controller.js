"use strict";
var docApp = app.components;

docApp.controller('docPageCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	var pageData = {
		title: "SOAJS Documentation Spaces",
		class: "platform",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.redirecting = false;
	$scope.confluencePage = function(link){
		$scope.redirecting = true;
		//todo: scroll to top
		$timeout(function(){
			window.location.href= link;
		}, 5000);
	};
	
	$scope.docs = [
		{
			"name": "SOAJS",
			"description": "Service Oriented Architecture built using JavaScript, SOAJS is a open source platform as a service (aPaaS) that offers a fully ready to use CORE framework and Platform to build, deploy, manage and troubleshoot clouds of microservices & daemons.",
			"link": "https://soajsorg.atlassian.net/wiki/spaces/SOAJ"
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
	
	$scope.sidebar = [
		{
			name: "Framework",
			entries: [
				{
					name: "Create a Service",
					link: ""
				},
				{
					name: "Create a Daemon",
					link: ""
				},
				{
					name: "Create a UI Module",
					link: ""
				},
				{
					name: "Request",
					link: ""
				},
				{
					name: "Response",
					link: ""
				},
				{
					name: "Environment Variables",
					link: ""
				},
				{
					name: "Profiles",
					link: ""
				},
				{
					name: "Registry",
					link: ""
				},
				{
					name: "IMFV",
					link: ""
				},
				{
					name: "Security",
					link: ""
				},
				{
					name: "Access Levels",
					link: ""
				},
				{
					name: "Services Config",
					link: ""
				},
				{
					name: "Service Operations & Maintenance",
					link: ""
				},
				{
					name: "Catalog Recipes",
					link: ""
				}
			]
		},
		{
			name: "Databases",
			entries: [
				{
					name: "Mongo Client Driver",
					link: ""
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
					link: ""
				},
				{
					name: "Multitenancy",
					link: ""
				},
				{
					name: "Multi Environment",
					link: ""
				}
			]
		},
		{
			name: "Components",
			entries: [
				{
					name: "Swagger",
					link: ""
				},
				{
					name: "Composer",
					link: ""
				},
				{
					name: "GCS",
					link: ""
				}
			]
		},
		{
			name: "Ready Made Services",
			entries: [
				{
					name: "Controller",
					link: ""
				},
				{
					name: "URAC",
					link: ""
				},
				{
					name: "oAuth",
					link: ""
				},
				{
					name: "Dashboard",
					link: ""
				}
			]
		},
		{
			name: "Deployment",
			entries: [
				{
					"name": "SOAJS Installer",
					"link": ""
				}
			]
		},
		{
			name: "UI SDK",
			entries: [
				{
					"name": "UI Listing Grid",
					"link": ""
				},
				{
					"name": "UI Form",
					"link": ""
				}
			]
		}
	];
}]);
