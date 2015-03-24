var config = {
	"serviceName": "example01",
	"schema": {
		//api route
		"/testGet": {
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
		//...
	}
};