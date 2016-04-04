'use strict';
module.exports = {
	"serviceName": "example04",
	serviceGroup: "SOAJS Example Services",
	serviceVersion: 1,
	servicePort: 4013,
	extKeyRequired: true,
	session: true,
	oauth: true,
	"errors": {},
	"schema": {
		"commonFields": {	        
            "firstName": {
                "source": ['query.firstName'],
                "required": true,
                "default": "John",
                "validation": {
                    "type": "string"
                }
            },
	        "lastName": {
				"source": ['query.lastName'],
				"required": true,
				"validation": {
					"type": "string"
				}
			}
	    },
	    "/buildName": {
	    	"commonFields": ["firstName", "lastName"]
	    },
		"/buildNameGold": {
			"commonFields": ["firstName", "lastName"]
		},
		"/testGet": {
			"commonFields": ["firstName", "lastName"]
		}
	}	
};