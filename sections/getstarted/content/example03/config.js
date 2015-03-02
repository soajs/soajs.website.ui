'use strict';

module.exports = {
	"errors": {
	},
	"schema": {
		"/testGet" : {
			"input" : {
				"firstName" : {
					"source" : [ 'query.firstName' ],
					"required" : true,
					"validation" : {
						"type" : "string"
					}
				},
				"lastName" : {
					"source" : [ 'query.lastName' ],
					"required" : true,
					"validation" : {
						"type" : "string"
					}
				}
			}
		},
		"/buildName" : {
			"input" : {
				"firstName" : {
					"source" : [ 'query.firstName' ],
					"required" : true,
					"default": "John",
					"validation" : {
						"type" : "string"
					}
				},
				"lastName" : {
					"source" : [ 'query.lastName' ],
					"required" : true,
					"validation" : {
						"type" : "string"
					}
				}
			}
		}

	}
};