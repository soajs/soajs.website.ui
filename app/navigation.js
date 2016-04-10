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
		'url': '#/getStarted/:section?/:anchor?',
		'tplPath': 'sections/getstarted/page.html',
		'scripts': ['sections/getstarted/controller.js']
	},
	{
		'id': 'example01',
		'label': 'example01',
		'title': 'SOAJS | Get Sarted | Example 01',
		'url': '#/getStarted/example01/:anchor?'
	},
	{
		'id': 'example02',
		'label': 'example02',
		'title': 'SOAJS | Get Sarted | Example 02',
		'url': '#/getStarted/example02/:anchor?'
	},
	{
		'id': 'ctrl',
		'label': 'controller',
		'title': 'SOAJS | Get Sarted | Controller',
		'url': '#/getStarted/controller/:anchor?'
	},
	{
		'id': 'example03',
		'label': 'example03',
		'title': 'SOAJS | Get Sarted | Example 03',
		'url': '#/getStarted/example03/:anchor?'
	},
	{
		'id': 'example04',
		'label': 'example04',
		'title': 'SOAJS | Get Sarted | Example 04',
		'url': '#/getStarted/example04/:anchor?'
	},
	{
		'id': 'advanced',
		'label': 'TechOps/DevOps',
		'title': 'SOAJS | Get Sarted | DevOps & TechOps',
		'url': '#/getStarted/advanced/:anchor?'
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
		'id': 'key-security',
		'label': 'soajs key-security',
		'title': 'SOAJS | Documentation | Key Security',

		'url': '#/documentation/core/key-security'
	},
	{
		'id': 'acl',
		'label': 'soajs acl',
		'title': 'SOAJS | Documentation | Access Levels',

		'url': '#/documentation/core/acl'
	},
	{
		'id': 'packages',
		'label': 'soajs packages',
		'title': 'SOAJS | Documentation | Architecture at a Glance',

		'url': '#/documentation/core/packages'
	},
    {
        'id': 'mongo',
        'label': 'soajs mongo',
        'title': 'SOAJS | Documentation | Mongo Adapter',

        'url': '#/documentation/db/mongo'
    },
	{
		'id': 'overview',
		'label': 'soajs features overview',
		'title': 'SOAJS | Documentation | Features Overview',
		'url': '#/documentation/advanced/overview'
	},
	{
		'id': 'environment',
		'label': 'soajs environment',
		'title': 'SOAJS | Documentation | Multi Environment',
		'url': '#/documentation/advanced/environment'
	},
	{
		'id': 'multitenancy',
		'label': 'soajs multitenancy',
		'title': 'SOAJS | Documentation | Multitenancy',
		'url': '#/documentation/advanced/multitenancy'
	},
	{
		'id': 'productization',
		'label': 'soajs productization',
		'title': 'SOAJS | Documentation | Productization',
		'url': '#/documentation/advanced/productization'
	},
	{
		'id': 'controller',
		'label': 'soajs controller',
		'title': 'SOAJS | Documentation | Controller',
		'url': '#/documentation/services/controller'
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
        'id': 'gcs',
        'label': 'soajs gcs',
        'title': 'SOAJS | Documentation | GCS',
        'url': '#/documentation/services/gcs'
    },
	{
		'id': 'dashboard',
		'label': 'soajs dashboard',
		'title': 'SOAJS | Documentation | Dashboard',
		'url': '#/documentation/ui/dashboard'
	},
	{
		'id': 'module',
		'label': 'soajs dashboard module',
		'title': 'SOAJS | Documentation | Dashboard Module',
		'url': '#/documentation/ui/module'
	},
	{
		'id': 'services',
		'label': 'soajs dashboard services',
		'title': 'SOAJS | Documentation | Dashboard UI Common Functions',
		'url': '#/documentation/ui/services'
	},
	{
		'id': 'grid',
		'label': 'soajs dashboard grid',
		'title': 'SOAJS | Documentation | Dashboard Grid',
		'url': '#/documentation/ui/grid'
	},
	{
		'id': 'form',
		'label': 'soajs dashboard form',
		'title': 'SOAJS | Documentation | Dashboard Form',
		'url': '#/documentation/ui/form'
	},
	{
		'id': 'manual',
		'label': 'soajs Manual Deployment',
		'title': 'SOAJS | Deployment | Manual Deployment',
		'url': '#/documentation/deployment/manual'
	},
	{
		'id': 'manual-mac',
		'label': 'soajs Manual Deployment on Mac',
		'title': 'SOAJS | Deployment | Manual Deployment on MAC',
		'url': '#/documentation/deployment/manual-mac'
	},
	{
		'id': 'manual-linux',
		'label': 'soajs Manual Deployment on Linux',
		'title': 'SOAJS | Deployment | Manual Deployment on Linux',
		'url': '#/documentation/deployment/manual-linux'
	},
	{
		'id': 'docker',
		'label': 'soajs Docker Deployment',
		'title': 'SOAJS | Deployment | Docker Deployment',
		'url': '#/documentation/deployment/docker'
	},
	{
		'id': 'docker-m-mac',
		'label': 'soajs Docker Machine Deployment on Mac',
		'title': 'SOAJS | Deployment | Docker Machine Deployment on MAC',
		'url': '#/documentation/deployment/docker-m-mac'
	},
	{
		'id': 'docker-m-linux',
		'label': 'soajs Docker Machine Deployment on Linux',
		'title': 'SOAJS | Deployment | Docker Machine Deployment on Linux',
		'url': '#/documentation/deployment/docker-m-linux'
	},
	{
		'id': 'docker-linux',
		'label': 'soajs Docker Deployment on Linux',
		'title': 'SOAJS | Deployment | Docker Deployment on Linux',
		'url': '#/documentation/deployment/docker-linux'
	},
	{
		'id': 'docker-files',
		'label': 'soajs docker-files',
		'title': 'SOAJS | Deployment | Docker Images',
		'url': '#/documentation/deployment/docker-files'
	}
];

var whitelistedDomain = ['localhost'];