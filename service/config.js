'use strict';

module.exports = {
	serviceName: "contactUs",
	"errors": {
		"100": "Failed to send email"
	},
	"mail": {
		"to": "mike@soajs.org",
		"subject": "Message from SOAJS Website Contact Us Section",
		headers: {
			type: 'object',
			required: false,
			additionalProperties: {
				'type': 'string'
			}
		},
		"transport": {
			//"type": "sendmail", // smtp , sendmail, direct
			"type": "smtp", // smtp , sendmail, direct
			"options": {
				'service': 'gmail',
				"auth": {
					'user': 'soajsnotifier@gmail.com',
					'pass': 'Supernova1985'
				}
				//"path": "/usr/sbin/sendmail"
			}
		}
		
	},
	"schema": {
		"/sendMessage": {
			"name": {
				"source": ['body.name'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			"purpose": {
				"source": ['body.purpose'],
				"required": true,
				"validation": {
					"type": "string"
				}
			},
			"email": {
				"source": ['body.email'],
				"required": true,
				"validation": {
					"type": "string",
					format: "email"
				}
			},
			"message": {
				"source": ['body.message'],
				"required": true,
				"validation": {
					"type": "string"
				}
			}
		}

	}
};