var config = {
	"serviceName": "example01",
	"schema": {
		//api route
		"/testGet": {
			"input": {
				'firstName': {
					'source': ['query.firstName'],
					'required': true,
					'validation': {
						'type': 'string',
						format: 'alphanumeric'
						//...
					}
				}
				//...
			}
		}
		//...
	}
};