"use strict";
var navigation = [
	{
		'id': 'home',
		'label': 'home',
		'title': 'SOAJS - microservice management platform',
		'description': 'The only complete, end-to-end microservices management platform, SOAJS specifically addresses\n' +
            'these IT plumbing challenges, so you can deploy microservices significantly earlier and faster.\n' +
            'IT initiatives such as digital transformation are simplified, accelerated, cost reduced, and risk mitigated.\n' +
            'Our fully integrated, world-class API lifecycle management, multi-cloud orchestration, release management,\n' +
            'and IT Ops automation capabilities eliminate your IT organization’s modernization pain.',
		'keywords': '#soajs @soajsorg, soa, soajs, service oriented architecture, multitenant, multi-tenant, productization, software, linux, platform, node, mongo, framework, npm, javascript, angularjs, angular, js, nodejs, mongodb, haproxy, cloud architecture, software as a service, saas, user registration and access control urac, security, cloud awareness, cloud-awareness, self awareness, self-awareness, multi service, multiservice, multi-service, enterprise solution, API, API management, enterprise APIs, elastic search, elastic-search, elasticsearch',
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
		'id': 'getStarted',
		'label': 'Get Started',
		'title': 'SOAJS | Get Started',
		'url': '/getstarted',
		'tplPath': 'sections/getStarted/page.html',
		'scripts': ['sections/getStarted/controller.js']
	},
	{
		'id': 'demos',
		'label': 'Demos',
		'title': 'SOAJS | Demos',
		'url': '/demos',
		'tplPath': 'sections/demos/page.html',
		'scripts': ['sections/demos/controller.js']
	},
	{
		'id': 'documentation',
		'label': 'Documentation',
		'title': 'SOAJS | Documentation',
		'url': '/documentation',
		'tplPath': 'sections/documentation/page.html',
		'scripts': ['sections/documentation/controller.js']
	},
	{
		'id': 'platform',
		'label': 'Platform',
		'title': 'SOAJS | Platform',
		'url': '/platform',
		'tplPath': 'sections/platform/page.html',
		'scripts': ['sections/platform/controller.js']
	},
	{
		'id': 'videos',
		'label': 'Videos',
		'title': 'SOAJS | Videos',
		'url': '/videos',
		'tplPath': 'sections/videos/page.html',
		'scripts': ['sections/videos/controller.js']
	},
	{
		'id': 'install',
		'label': 'Install',
		'title': 'SOAJS | Install',
		'url': '/install',
		'tplPath': 'sections/install/page.html',
		'scripts': ['sections/install/controller.js']
	}
];

var whitelistedDomain = ['localhost'];