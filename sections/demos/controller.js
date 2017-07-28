"use strict";
var demosdApp = app.components;

demosdApp.controller('demosCtrl', ['$scope', function ($scope) {
	var pageData = {
		title: "Demos",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	$scope.demos = [
		{
			icon: "images/quickdemo.png",
			title: "Quick Demo - a taste of SOAJS platform",
			link: "https://soajsorg.atlassian.net/wiki/spaces/EX/pages/61867290/Quick+Demo",
			description: "Building a SOAJS Microservice with minimal effort using <a href='https://soajsorg.atlassian.net/wiki/display/SWAG' target='_blank'>Swagger</a>" +
			"<ol>" +
				"<li>Build a microservice using SOAJS <a href='https://soajsorg.atlassian.net/wiki/display/SWAG' target='_blank'>Swagger Editor</a></li>" +
				"<li>Deploy micorservice and test it using <a href='https://soajsorg.atlassian.net/wiki/display/SWAG/03+-+Test+service' target='_blank'>Swagger Simulator </a> and <a href='https://www.getpostman.com/' target='_blank'>Postman</a></li>" +
				"<li>Quick look at Multitenancy and its impact on microservices' behavior</li>" +
			"</ol>"
		},
        {
            icon: "images/tidbit.png",
            title: "TIDBIT - multi technology framework",
            link: "https://soajsorg.atlassian.net/wiki/spaces/EX/pages/62982572/TIDBIT#TIDBIT-menu-link-content",
            description: "Demonstrate how SOAJS:<br />" +
            "<ol>" +
            "<li>Integrate, Activate & Deploy a distributed service oriented architecture SOA cooked up from different technologies ( <a href='https://hapijs.com/' target='_blank'>Hapi</a> - <a href='https://expressjs.com/' target='_blank'>Express</a> - <a href='https://www.java.com/en/' target='_blank'>Java</a> )" +
            "<ul>" +
            "<li>Integrate & Activate ( with <a href='https://github.com/' target='_blank'>Github</a> )</li>" +
            "<li>Container Technology ( via <a href='https://docs.docker.com/' target='_blank'>Docker Swarm</a> )</li>" +
            "<li>Cloud Orchestration ( via SOAJS <a href='https://soajsorg.atlassian.net/wiki/display/DSBRD/Dashboard?src=spacemenu' target='_blank'>Dashboard</a> )</li>" +
            "</ul>" +
            "</li>" +
            "<li>Apply API Management & Lifecycle on SOA" +
            "<ul>" +
            "<li>Turning on <a href='https://soajsorg.atlassian.net/wiki/spaces/DSBRD/pages/61979922/Multitenancy' target='_blank'>Multi-Tenancy</a></li>" +
            "<li>Configuring and apply Multi-Security</li>" +
            "<li>Configuring and using Multi-Tenancy (at code level)</li>" +
            "</ul>" +
            "</li>" +
            "<li>Manage your SOA using the API Catalog Module ( via <a href='https://soajsorg.atlassian.net/wiki/spaces/SWAG' target='_blank'>Swagger</a> )</li>" +
            "<li>Turn on Continuous Integration & Delivery ( with <a href='https://travis-ci.org/' target='_blank'>Travis</a> )</li>" +
            "</ol>"
        },
        {
            icon: "images/fulldemo.png",
            title: "Full App Demo - Pet store",
            link: "https://soajsorg.atlassian.net/wiki/spaces/EX/pages/62550838/Full+Demo",
            description: "<ol>" +
            "<li>Learn how to deploy a full working APP on top of SOAJS (Pet Store)</li>" +
            "<li>Learn how to build UI Modules and deploy them in the <a href='https://soajsorg.atlassian.net/wiki/spaces/DSBRD/pages/61906563/Operate' target='_blank'>Operate</a> pillar of SOAJS <a href='https://soajsorg.atlassian.net/wiki/spaces/DSBRD' target='_blank'>Dashboard</a></li>" +
            "<li>Learn how to deploy a custom UI Frontend Interface for your APP with SOAJS" +
            "<ul>" +
            "<li> Deploy and use <a href='https://soajsorg.atlassian.net/wiki/spaces/OAUT/overview' target='_blank'>oAuth</a> to login</li>" +
            "<li> Deploy and use <a href='https://soajsorg.atlassian.net/wiki/spaces/URAC/overview' target='_blank'>URAC</a> for member management and 3rd party integration (Facebook, Google+, Twitter)</li>" +
            "</ul>" +
            "</li>" +
            "</ol>"
        },
		{
			icon: "images/jsconf.png",
			title: "JSCONF - Javascript conference demo",
			link: "https://soajsorg.atlassian.net/wiki/spaces/EX/pages/61864316/JSCONF",
			description: "<a href='http://jsconf.com/' target='_blank'>JSCONF</a> is a JavaScript organization that arranges conference events throughout the year related to technologies developed on top of JavaScript. " +
			"Speakers from all over the world are invited to talk about their innovative creations and show how they managed to empower JavaScript  in their solutions.<br /><br />" +
			"Antoine Hage, one of our co-founders introduced SOAJS during one of these conferences.<br />" +
			"He showed SOAJS in action and for that particular event, he used examples found in one of the public repos <a href='http://github.com/soajs/soajs.jsconf' target='_blank'>soajs.jsconf</a>."
		}
	
	];
}]);
