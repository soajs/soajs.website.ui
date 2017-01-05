var myModuleNav = [
	{
		//main information
		'id': 'myModules',
		'label': 'My Module',
		'url': '#/mymodule',
		'scripts': ['modules/myModule/controller.js', 'modules/myModule/service.js'],
		'tplPath': 'modules/myModule/directives/list.tmpl',
		//permissions information
		'checkPermission': {
			'service': 'myService',
			'route': '/list'
		},
		'pillar': {
			'name': 'operate',
			'label': 'Operate',
			'position': 4
		},
		//menu & tracker information
		'icon': '',
		'mainMenu': true,
		'tracker': true,
		'ancestor': ['Home']
	}
];
navigation = navigation.concat(myModuleNav);