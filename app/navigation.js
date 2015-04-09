"use strict";
var navigation = [
	{
		'id': 'home',
		'label': 'home',
		'title': 'SOAJS Dream Framework',
		'description': 'SOAJS is an open source dream framework that empowers building crazy fast the API-nization layer between the product frontend (UI/UX) and backend (business logic). soajs is an api management with service oriented architecture.',
		'keywords': '#soajs@soajsorg, soa, soajs, service oriented architecture, multitenant, multi-tenant, productization, software, linux, platform, node, mongo, framework, npm, javascript, angularjs, angular, js, nodejs, mongodb, haproxy, cloud architecture, software as a service, saas, user registration and access control urac, security, cloud awareness, cloud-awareness, self awareness, self-awareness, multi service, multiservice, multi-service, enterprise solution, API, API management, enterprise APIs, elastic search, elastic-search, elasticsearch',
		'url': '#/',
		'tplPath': 'sections/home/page.html',
		'scripts': ['sections/home/controller.js']
	},
	{
		'id': 'news',
		'label': 'News',
		'title': 'SOAJS | News',
		'url': '#/news',
		'tplPath': 'sections/news/page.html',
		'scripts': ['sections/news/controller.js']
	},
	{
		'id': 'contactUs',
		'label': 'contactUs',
		'title': 'SOAJS | Contact Us',
		'url': '#/contactUs',
		'tplPath': 'sections/contactus/page.html',
		'scripts': ['sections/contactus/controller.js']
	},
	{
		'id': 'getStarted',
		'label': 'getStarted',
		'title': 'SOAJS | Get Sarted',
		'url': '#/getStarted',
		'tplPath': 'sections/getstarted/page.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'example01',
		'label': 'example01',
		'title': 'SOAJS | Get Sarted | Example 01',
		'url': '#/getStarted/example01/:anchor?',
		'tplPath': 'sections/getstarted/example01.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'example02',
		'label': 'example02',
		'title': 'SOAJS | Get Sarted | Example 02',
		'url': '#/getStarted/example02/:anchor?',
		'tplPath': 'sections/getstarted/example02.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'example03',
		'label': 'example03',
		'title': 'SOAJS | Get Sarted | Example 03',
		'url': '#/getStarted/example03/:anchor?',
		'tplPath': 'sections/getstarted/example03.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'example04',
		'label': 'example04',
		'title': 'SOAJS | Get Sarted | Example 04',
		'url': '#/getStarted/example04/:anchor?',
		'tplPath': 'sections/getstarted/example04.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'features',
		'label': 'features',
		'title': 'SOAJS | Features',
		'url': '#/features/:anchor?',
		'tplPath': 'sections/features/page.html',
		'scripts': ['sections/features/controller.js']
	},
	{
		'id': 'documentation',
		'label': 'documentation',
		'title': 'SOAJS | Documentation',
		'url': '#/documentation/:section?/:subSection?/:anchor?',
		'tplPath': 'sections/documentation/page.html',
		'scripts': ['sections/documentation/controller.js']
	},
	{
		'id': 'service',
		'label': 'soajs service',
		'title': 'SOAJS | Documentation | Service',
		'url': '#/documentation/core/service'
	},
	{
		'id': 'request',
		'label': 'soajs request',
		'title': 'SOAJS | Documentation | Request',
		'url': '#/documentation/core/request'
	},
	{
		'id': 'imfv',
		'label': 'soajs imfv',
		'title': 'SOAJS | Documentation | IMFV',
		'url': '#/documentation/core/imfv'
	},
	{
		'id': 'registry',
		'label': 'soajs registry',
		'title': 'SOAJS | Documentation | Registry',

		'url': '#/documentation/core/registry'
	},
	{
		'id': 'provisioning',
		'label': 'soajs provisioning',
		'title': 'SOAJS | Documentation | Provisioning',
		'url': '#/documentation/provisioning'
	},
	{
		'id': 'controller',
		'label': 'soajs controller',
		'title': 'SOAJS | Documentation | Controller',
		'url': '#/documentation/core/controller'
	},
	{
		'id': 'service',
		'label': 'soajs service',
		'title': 'SOAJS | Documentation | Service',
		'url': '#/documentation/service'
	},
	{
		'id': 'urac',
		'label': 'soajs urac',
		'title': 'SOAJS | Documentation | Urac',
		'url': '#/documentation/services/urac'
	},
	{
		'id': 'oauth',
		'label': 'soajs oauth',
		'title': 'SOAJS | Documentation | oAuth',
		'url': '#/documentation/services/oauth'
	},
	{
		'id': 'agent',
		'label': 'soajs agent',
		'title': 'SOAJS | Documentation | Agent',
		'url': '#/documentation/services/agent'
	},
	{
		'id': 'dashboard-services',
		'label': 'soajs dashboard-services',
		'title': 'SOAJS | Documentation | Dashboard Services',
		'url': '#/documentation/services/dashboard-services'
	},
	{
		'id': 'dashboard-setup',
		'label': 'soajs dashboard-setup',
		'title': 'SOAJS | Documentation | Dashboard Setup',
		'url': '#/documentation/ui/dashboard-setup'
	},
	{
		'id': 'overview',
		'label': 'soajs deployment overview',
		'title': 'SOAJS | Deployment | Architecture Overview',
		'url': '#/documentation/deployment/overview'
	},
	{
		'id': 'all-in-one',
		'label': 'soajs all-in-one',
		'title': 'SOAJS | Deployment | All In One',
		'url': '#/documentation/deployment/all-in-one'
	},
	{
		'id': 'cloud-awareness',
		'label': 'soajs cloud-awareness',
		'title': 'SOAJS | Deployment | Cloud Awareness',
		'url': '#/documentation/deployment/cloud-awareness'
	}
];

var whitelistedDomain = ['localhost'];