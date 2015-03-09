"use strict";
var navigation = [
    {
        'id': 'home',
        'label': 'home',
        'url': '#/',
        'tplPath': 'sections/home/page.html',
        'scripts': ['sections/home/controller.js']
    },
    {
        'id': 'home',
        'label': 'home',
        'url': '#/home',
        'tplPath': 'sections/home/page.html',
        'scripts': ['sections/home/controller.js']
    },
    {
        'id': 'contactUs',
        'label': 'contactUs',
        'url': '#/contactUs',
        'tplPath': 'sections/contactus/page.html',
        'scripts': ['sections/contactus/controller.js']
    },
    {
        'id': 'getStarted',
        'label': 'getStarted',
        'url': '#/getStarted',
        'tplPath': 'sections/getstarted/page.html',
        'scripts': ['sections/getstarted/controller.js']
    },
    {
        'id': 'example01',
        'label': 'example01',
        'url': '#/getStarted/example01',
        'tplPath': 'sections/getstarted/example01.html',
        'scripts': ['sections/getstarted/controller.js']
    },
    {
        'id': 'example02',
        'label': 'example02',
        'url': '#/getStarted/example02',
        'tplPath': 'sections/getstarted/example02.html',
        'scripts': ['sections/getstarted/controller.js']
    },
    {
        'id': 'example03',
        'label': 'example03',
        'url': '#/getStarted/example03/:anchor?',
        'tplPath': 'sections/getstarted/example03.html',
        'scripts': ['sections/getstarted/controller.js']
    },
		{
			'id': 'example04',
			'label': 'example04',
			'url': '#/getStarted/example04',
			'tplPath': 'sections/getstarted/example04.html',
			'scripts': ['sections/getstarted/controller.js']
		},
    {
        'id': 'features',
        'label': 'features',
        'url': '#/features/:anchor?',
        'tplPath': 'sections/features/page.html',
        'scripts': ['sections/features/controller.js']
    },
    {
        'id': 'documentation',
        'label': 'documentation',
        'url': '#/documentation/:section?/:anchor?',
        'tplPath': 'sections/documentation/page.html',
        'scripts': ['sections/documentation/controller.js']
    }
];

var whitelistedDomain = ['localhost'];