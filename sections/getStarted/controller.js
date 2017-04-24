"use strict";
var getStartedApp = app.components;

getStartedApp.controller('getStartedCtrl', ['$scope', function ($scope) {
    var pageData = {
        title: "Get Started",
        subTitle: ""
    };
    $scope.$parent.$emit('refreshPageTitle', pageData);
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
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/registry-1.png?width=64&height=64",
					title: "Registry",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Registry",
					description: "What is the SOAJS registry and how do i use it"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/servicesConfig-1.png?width=64&height=64",
					title: "Services Config",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Services+Config",
					description: "Learn about Multitenancy and how to supply private inputs to APIs using tenant configuration"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/session-1.png?width=64&height=64",
					title: "Session",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Session",
					description: "Learn how to leverage the session inside your APIs and how to persist it between your microservices"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/installer-1.png?width=64&height=64",
					title: "Install SOAJS Dashboard",
					link: "https://soajsorg.atlassian.net/wiki/spaces/IN",
					description: "Use the Installer to deploy a local/remote cloud of SOAJS microservices and go Live!"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/deployService-daemon-1.png?width=64&height=64",
					title: "Deploy a Service/Daemon",
					link: "https://soajsorg.atlassian.net/wiki/pages/viewpage.action?pageId=61711973",
					description: "You've built your service/daemon, now let's Deploy it"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/profile-1.png?width=64&height=64",
					title: "Profiles",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Profiles",
					description: "What is a profile, how and why do you need it ?"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/envVariables-1.png?width=64&height=64",
					title: "Environment Variables",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Environment+Variables",
					description: "Get acquainted with the lit of environment variables that are used in SOAJS and their purpose"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/secure-1.png?width=64&height=64",
					title: "Secure your Service",
					link: "https://soajsorg.atlassian.net/wiki/display/EX/Secure+your+Service",
					description: "Turn on multitenancy on your service and check out how to secure it with SOAJS"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/mongoClientDriver.png?width=64&height=64",
					title: "Mongo client Driver",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Mongo+Client+Driver",
					description: "Forget about handling database connectivity, race conditions, or topologies and use the SOAJS Mongo Client Driver. Connect to standalone and multitenant databases transparently and run all the query operations you need"
				}
			]
		},
		{
			label: "Intermediate Level",
			description: "Dive in deeper under the hood of SOAJS; see how to turn on multitenancy - key security and ACL recipes. Use swagger to build your microservice and how to use the dashboard to manage and operate your cloud.",
			sections: [
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/multitenancy-1.png?width=64&height=64",
					title: "Multitenancy",
					link: "https://soajsorg.atlassian.net/wiki/display/DSBRD/Multitenancy",
					description: "Turn on multitenancy on your service and leverage the ability to have it behave differently depending on the tenant invoking its APIs"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/swaggerEditor-1.png?width=64&height=64",
					title: "Swagger Editor",
					link: "https://soajsorg.atlassian.net/wiki/spaces/SWAG",
					description: "Generate and build SOAJS services by simply providing their API documentation using SOAJS swagger Editor and YAML annotation."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/serviceMaintenance-1.png?width=64&height=64",
					title: "Service Maintenance Ops",
					link: "https://soajsorg.atlassian.net/wiki/pages/viewpage.action?pageId=61862866",
					description: "Checkout how to reload the configuration, settings and security protocols of microservices and daemons without restarting them."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/demos-1.png?width=64&height=64",
					title: "Demos",
					link: "https://soajsorg.atlassian.net/wiki/display/EX/Demos",
					description: "Lean how all the pieces of the puzzle come together through real-life inspired demos"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/dashboard-1.png?width=64&height=64",
					title: "Dashboard",
					link: "https://soajsorg.atlassian.net/wiki/spaces/DSBRD",
					description: "Learn how to manage and control your entire cloud of microservices and daemons in all its environments using just the dashboard UI."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/develop-1.png?width=64&height=64",
					title: "Develop",
					link: "https://soajsorg.atlassian.net/wiki/display/DSBRD/Develop",
					description: "Generate and manage services, daemons and catalogs using advanced wizards in SOAJS dashboard."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/manage-1.png?width=64&height=64",
					title: "Manage",
					link: "https://soajsorg.atlassian.net/wiki/display/DSBRD/Manage",
					description: "Cook your ACL recipes, package them and define who has access to your services and in which environments."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/deploy-1.png?width=64&height=64",
					title: "Deploy",
					link: "https://soajsorg.atlassian.net/wiki/display/DSBRD/Deploy",
					description: "Customize & Deploy environments. Configure clusters & databases and orchestrate your cloud. Scale as much as you need, troubleshoot and run maintenance operations on your cloud."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/operate-1.png?width=64&height=64",
					title: "Operate",
					link: "https://soajsorg.atlassian.net/wiki/display/DSBRD/Operate",
					description: "Operate on the custom modules you have built for your product and in all the deployed environments."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/multiEnvironment.png?width=64&height=64",
					title: "Multi Environment",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Multi+Environment",
					description: "SOAJS allows to configure and deploy multiple environments each with a completely different strategy. Have a look at how it does it and become familiar with the DASHBOARD Environment."
				}
			]
		},
		{
			label: "Advanced Level",
			description: "Take your skills to maximum levels with advanced knowledge on how SOAJS allow you to transform services & daemons to behave differently based on arriving requests. Understand how the IMFV functions and to create advanced schemas to validate complex inputs. Speed up your develop by using the advanced wizards of GCS, composer and turn on automated updates using CI/CD.",
			sections: [
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/imfv-1.png?width=64&height=64",
					title: "IMFV",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/IMFV",
					description: "Advanced and in-depth knowledge on how to map, filter and validate arriving inputs from different sources with complex structures to REST APIs."
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/composer-1.png?width=64&height=64",
					title: "Composer",
					link: "https://soajsorg.atlassian.net/wiki/spaces/COMP",
					description: "Speed things up by using the SOAJS composer and organize your microservice layers: REST - Models - Business Logic"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/gcs-1.png?width=64&height=64",
					title: "GCS",
					link: "https://soajsorg.atlassian.net/wiki/spaces/GCS",
					description: "Generate and Operate on microservice and UI modules using the advanced generic content service wizard"
				},
				{
					icon: "https://soajsorg.atlassian.net/wiki/download/thumbnails/16121916/accessLevels.png?width=64&height=64",
					title: "Access Levels",
					link: "https://soajsorg.atlassian.net/wiki/display/SOAJ/Access+Levels",
					description: "Dive in deeper and learn about SOAJS layers, how the Access Levels are configured and applied on personas."
				}
			]
		}
	];
}]);
