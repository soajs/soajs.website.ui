"use strict";
var accessSchema = {
	"oneOf": [
		{"type": "boolean", "required": false},
		{"type": "array", "minItems": 1, "items": {"type": "string", "required": true}, "required": false}
	]
};

module.exports = {
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
};