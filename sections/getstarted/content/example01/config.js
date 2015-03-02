'use strict';

module.exports = {
	"errors": {
		"900": "firstName not found"
	},
	"schema": {
		"/testGet": {
			"input": {
				"firstName": {
					"source": ['query.firstName'],
					"required": true,
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
				},
				"email": {
					"source": ['query.email'],
					"required": false,
					"validation": {
						"type": "string",
						format: "email"
					}
				}
			}
		},
		"/testDel": {
			"input": {
				"firstName": {
					"source": ['query.firstName'],
					"required": false,
					"validation": {
						"type": "string"
					}
				},
				"lastName": {
					"source": ['query.lastName'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			}
		},
		"/buildName": {
			"input": {
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
		},
		"/testPost": {
			"input": {
				"firstName": {
					"source": ['body.firstName'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"lastName": {
					"source": ['body.lastName'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"email": {
					"source": ['body.email'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			}
		},
		"/testPut": {
			"input": {
				"firstName": {
					"source": ['body.firstName'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"lastName": {
					"source": ['body.lastName'],
					"required": true,
					"validation": {
						"type": "string"
					}
				},
				"email": {
					"source": ['body.email'],
					"required": false,
					"validation": {
						"type": "string"
					}
				}
			}
		}
	}
};


