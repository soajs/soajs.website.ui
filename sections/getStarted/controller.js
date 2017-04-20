"use strict";
var getStartedApp = app.components;

getStartedApp.controller('getStartedCtrl', ['$scope', function ($scope) {
	$scope.getstarted = [
		{
			label: "Beginner's Guide",
			description: "Get Started with SOAJS and see how to build a service, a daemon or a UI module. Learn the basic concepts and features that SOAJS offers via its framework and finally use the installer to install SOAJS Dashboard and deploy your services and daemons.",
			sections: [
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/serviceBuild-1.png?width=64&height=64",
					title: "How to build a Service",
					link: "https://soajsorg.atlassian.net/wiki/display/EX/How+to+build+a+service",
					description: "Beginner's guide to build a SOAJS service"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/daemon-1.png?width=64&height=64",
					title: "How to build a Daemon",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Daemon",
					description: "Beginner's guide to build a SOAJS daemon"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/UI-Module-1.png?width=64&height=64",
					title: "How to build a UI Module",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/UI+Module",
					description: "Beginner's guide to build a SOAJS UI Module"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/request-1.png?width=64&height=64",
					title: "Request",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Request",
					description: "Learn how SOAJS injects its framework and functionality to arriving requests at runtime"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/response-1.png?width=64&height=64",
					title: "Response",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Response",
					description: "Learn how SOAJS standardizes REST API responses"
				}
			]
		},
		{
			label: "Intermediate Level",
			description: "Dive in deeper under the hood of SOAJS; see how to turn on multitenancy - key security and ACL recipes. Use swagger to build your microservice and how to use the dashboard to manage and operate your cloud.",
			sections: [
			
			]
		},
		{
			label: "Advanced Level",
			description: "Take your skills to maximum levels with advanced knowledge on how SOAJS allow you to transform services & daemons to behave differently based on arriving requests. Understand how the IMFV functions and to create advanced schemas to validate complex inputs. Speed up your develop by using the advanced wizards of GCS, composer and turn on automated updates using CI/CD.",
			sections: [
			
			]
		}
	];
}]);
