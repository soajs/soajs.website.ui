"use strict";
var navigation = [
	{
		'id': 'home',
		'label': 'home',
		'title': 'SOAJS Dream Framework',
		'description': 'SOAJS is an open source dream framework that empowers building crazy fast the API-nization layer between the product frontend (UI/UX) and backend (business logic). soajs is an api management with service oriented architecture.',
		'keywords': '#soajs@soajsorg, soa, soajs, service oriented architecture, multitenant, multi-tenant, productization, software, linux, platform, node, mongo, framework, npm, javascript, angularjs, angular, js, nodejs, mongodb, haproxy, cloud architecture, software as a service, saas, user registration and access control urac, security, cloud awareness, cloud-awareness, self awareness, self-awareness, multi service, multiservice, multi-service, enterprise solution, API, API management, enterprise APIs, elastic search, elastic-search, elasticsearch',
		'url': '/',
		'tplPath': 'sections/home/page.html',
		'scripts': ['sections/home/controller.js']
	},
    {
        'id': 'news',
        'label': 'Releases',
        'title': 'SOAJS | Releases',
        'url': '/news',
        'tplPath': 'sections/news/page.html',
        'scripts': ['sections/news/controller.js']
    },
    {
        'id': 'contactUs',
        'label': 'contactUs',
        'title': 'SOAJS | Contact Us',
        'url': '/contactUs',
        'tplPath': 'sections/contactus/page.html',
        'scripts': ['sections/contactus/controller.js']
    },
	{
		'id': 'framework',
		'label': 'framework',
		'title': 'SOAJS | Platform',
		'url': '/products/framework',
		'tplPath': 'sections/products/framework/page.html',
		'scripts': ['sections/products/controllers.js']
	},
	{
		'id': 'urac',
		'label': 'urac',
		'title': 'SOAJS | URAC',
		'url': '/products/urac',
		'tplPath': 'sections/products/urac/page.html',
		'scripts': ['sections/products/controllers.js']
	},
	{
		'id': 'oauth',
		'label': 'oauth',
		'title': 'SOAJS | OAUTH',
		'url': '/products/oauth',
		'tplPath': 'sections/products/oauth/page.html',
		'scripts': ['sections/products/controllers.js']
	},
	{
		'id': 'dashboard',
		'label': 'Dashboard',
		'title': 'SOAJS | Dashboard',
		'url': '/products/dashboard',
		'tplPath': 'sections/products/dashboard/page.html',
		'scripts': ['sections/products/controllers.js']
	},
	{
		'id': 'gcs',
		'label': 'gcs',
		'title': 'SOAJS | GCS',
		'url': '/products/gcs',
		'tplPath': 'sections/products/gcs/page.html',
		'scripts': ['sections/products/controllers.js']
	},
    {
        'id': 'case',
        'label': 'Case Study',
        'title': 'SOAJS | Case Study',
        'url': '/case',
        'tplPath': 'sections/case/page.html',
        'scripts': ['sections/case/controller.js']
    },
    {
        'id': 'digital',
        'label': 'Digital Transformation',
        'title': 'SOAJS | Digital Transformation',
        'url': '/case/digital',
        'tplPath': 'sections/case/digital.html',
        'scripts': ['sections/case/controller.js']
    },
	{
		'id': 'getStarted',
		'label': 'getStarted',
		'title': 'SOAJS | Get Sarted',
		'url': 'https://soajsorg.atlassian.net/wiki/spaces/EX'
	},
	{
		'id': 'getStartedLocal',
		'label': 'Get Started',
		'title': 'SOAJS | Get Started',
		'url': '/getstarted',
		'tplPath': 'sections/getStarted/page.html',
		'scripts': ['sections/getStarted/controller.js']
	},
	{
		'id': 'products',
		'label': 'Products',
		'title': 'SOAJS | Products',
		'url': '/products',
		'tplPath': 'sections/products/page.html',
		'scripts': ['sections/products/controllers.js']
	}
];

var whitelistedDomain = ['localhost'];