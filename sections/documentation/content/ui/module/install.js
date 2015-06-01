var myModuleNav =[
	{
		//main information
		'id': 'myModules',
		'label': 'My Module',
		'url': '#/mymodule',
		'scripts': ['modules/myModule/controller.js'],
		'tplPath': 'modules/myModule/directives/list.tmpl',
		//permissions information
		'checkPermission':{
			'service':'mymodule',
			'route':'/list'
		},
		//menu & tracker information
		'icon': '',
		'mainMenu': true,
		'tracker': true,
		'ancestor': ['Home']
	}
];
navigation = navigation.concat(myModuleNav);