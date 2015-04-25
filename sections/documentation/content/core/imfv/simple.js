var config = {
	"serviceName": "helloworld",
	"servicePort": 4020,
	"extKeyRequired": false,
	"schema": {
		//api route
		"/hello": {
			"_apiInfo":{
				"l": "Hello Api"
			},
			'firstName': {
				'source': ['query.firstName'],
				'required': true,
				'validation': {
					'type': 'string',
					'format': 'alphanumeric'
					//...
				}
			}
			//...
		}
		//...
	}
};