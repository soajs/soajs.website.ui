'use strict';
var accessSchema = {
	"oneOf": [
		{"type": "boolean", "required": false},
		{"type": "array", "minItems": 1, "items": {"type": "string", "required": true}, "required": false}
	]
};

module.exports = {
	"serviceName": "example01",
	"someVariable": "somveValue",
	"errors": {
		"101": "some error message...",
		"102": "some error message..."
	},
	"schema": {
		"commonFields": {
			"input": {
				//common field id
				'id': {
					'source': ['query.id', 'body.id', 'session.userId'],
					'required': true,
					'validation': {
						'type': 'string',
						"minLength": 24,
						format: 'alphanumeric'
					}
				},
				//common field acl
				'acl': {
					'source': ['body.acl'],
					'required': false,
					'validation': {
						"type": "object",
						"additionalProperties": {
							"type": "object",
							"required": false,
							"properties": {
								"access": accessSchema,
								"apisPermission": {
									"type": "string",
									"enum": ["restricted"],
									"required": false
								},
								"apis": {
									"type": "object",
									"required": false,
									"patternProperties": {
										//pattern to match an api route
										"^[_a-z\/][_a-zA-Z0-9\/:]*$": {
											"type": "object",
											"required": true,
											"properties": {
												"access": accessSchema
											},
											"additionalProperties": false
										}
									}
								}
							},
							"additionalProperties": false
						}
					}
				}
			}
		},
		//api route testGet
		"/testGet": {
			"input": {
				'commonFields': ['id'],
				'firstName': {
					'source': ['query.firstName'],
					'required': true,
					'validation': {'type': 'string', format: 'alphanumeric'}
				}
			}
		},
		//api route testPost
		"/testPost": {
			"input": {
				"commonFields": ['id', 'acl'],
				"firstName": {
					"source": ["body.fName"],
					"required": true,
					'validation': {'type': 'string', format: 'alphanumeric'}
				},
				"email": {
					"source": ["body.email"],
					"required": true,
					'validation': {'type': 'string', format: 'email'}
				},
				"_TTL": {
					"source": ["session.user._TTL", "tenantConfig._TTL"],
					"required": true,
					'validation': {'type': 'number', "enum": [6, 12, 24, 48]}
				}
			}
		}
		//...
	}
};