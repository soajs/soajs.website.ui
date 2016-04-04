'use strict';

module.exports = {
	"serviceName": "example02",
	"serviceGroup": "SOAJS Example Services",
	"serviceVersion": 1,
	"servicePort": 4011,
	"extKeyRequired": false,
	"oauth": true,
	"errors": {},
	"schema": {
		"/buildName": {
			"_apiInfo":{
				"l": "Build Name"
			},
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
		}
	}
};