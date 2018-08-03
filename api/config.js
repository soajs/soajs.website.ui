'use strict';

module.exports = {
	
	serviceName: "contactUs",
	servicePort: 4995,
	"errors": {
		"401": "Failed to send email"
	},
	"mail": {
		"to": process.env.SOAJS_MAIL_TO,
		"subject": "Message from SOAJS Website Contact Us Section",
		"transport": {
			"type": "smtp",
			"options": {
				"service": "gmail",
				"auth": {
					"user": process.env.SOAJS_MAIL_USER,
					"pass": process.env.SOAJS_MAIL_PASS
				}
			}
		}
	},
	"schema": {
		"post": {
			"/sendMessage": {
				"_apiInfo": {
					"l": "Send message",
					"group": "Contact Us"
				},
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
				},
				"captcha": {
					"source": ['body.captcha'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/sendProject": {
				"_apiInfo": {
					"l": "Send Project",
					"group": "Contact Us"
				},
				"name": {
					"source": ['body.name'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"phone": {
					"source": ['body.phone'],
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
				"address": {
					"source": ['body.address'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"company": {
					"source": ['body.company'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"message": {
					"source": ['body.message'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"captcha": {
					"source": ['body.captcha'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			},
			"/sendContribute": {
				"_apiInfo": {
					"l": "Send Contribute",
					"group": "Contact Us"
				},
				"name": {
					"source": ['body.name'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"location": {
					"source": ['body.location'],
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
				"github": {
					"source": ['body.github'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"product": {
					"source": ['body.product'],
					"required": true,
					"validation": {
						"type": "array",
						"items": {
							"type": "string",
							"enum": ["SOAJS", "Dashboard", "Controller"]
						}
					}
				},
				"message": {
					"source": ['body.message'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"captcha": {
					"source": ['body.captcha'],
					"required": true,
					"validation": {
						"type": "string"
					}
				}
			}
		}
	}
};