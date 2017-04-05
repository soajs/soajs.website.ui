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
        'id': 'newsDetail',
        'label': 'NewsDetail',
        'title': 'SOAJS | News Detail',
        'url': '#/newsDetail',
        'tplPath': 'sections/newsDetail/page.html',
        'scripts': ['sections/newsDetail/controller.js']
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
		'url': 'https://soajsorg.atlassian.net/wiki/spaces/EX'
	}
];

var whitelistedDomain = ['localhost'];