'use strict';

module.exports = {
	serviceName: "contactUs",
	"errors": {
		"100": "Failed to send email"
	},
	"mail": {
		"content": "<p>Dear Admin, <br /> Message from <b>{{ name }}</b> <br />Regards,<br/>SOAJS Team.</p>",
		"to":"admin@simplifycreation.com",
		"subject": "Contact SOAJS",
		"transport": {
			"type": "sendmail", // smtp , sendmail, direct
			"options": {
				'service': 'gmail',
				"auth": {
					'user': 'soajsnotifier@gmail.com',
					'pass': 'Supernova1985'
				}
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