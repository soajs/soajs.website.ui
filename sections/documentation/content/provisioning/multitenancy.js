var test = {
	"_id": ObjectId("10d2cb5fc04ce51e06000001"),
	"oauth": {
		"secret": "shhh this is a secret",
		"redirectUri": "",
		"grants": ["password", "refresh_token"]
	},
	"code": "test",
	"name": "Test Tenant",
	"description": "this is a description for test tenant",
	"applications": [
		{
			"product": "TPROD",
			"package": "TPROD_BASIC",
			"appId": ObjectId("30d2cb5fc04ce51e06000001"),
			"description": "this is a description ...",
			"acl": {
				"urac": {},
				"dashboard": {}
			},
			"_TTL": 604800000, // 7 days in milliseconds
			"keys": [
				{
					"key": "d1eaaf5fdc35c11119330a8a0273fee9",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 604800000,
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f77",
							"device": {},
							"geo": {}
						}
						//more external keys....
					],
					"config": {
						"urac": {
							"hashIterations": 1024, //used by hasher
							"seedLength": 32, //used by hasher
							"link": {
								"addUser": "http://.../#/setNewPassword",
								"changeEmail": "http://.../#/changeEmail/validate",
								"forgotPassword": "http://.../#/resetPassword",
								"join": "http://.../#/join/validate"
							},
							// token expiry limit in seconds
							"tokenExpiryTTL": 2 * 24 * 3600 * 1000,
							//true if registration needs validation
							"validateJoin": true,
							"mail": { //urac mail options
								"join": {
									"subject": 'Welcome to SOAJS'
								},
								"forgotPassword": {
									"subject": 'Reset Your Password at SOAJS'
								},
								"addUser": {
									"subject": 'Account Created at SOAJS'
								},
								"changeUserStatus": {
									"subject": "Account Status changed at SOAJS"
								},
								"changeEmail": {
									"subject": "Change Account Email at SOAJS"
								}
							}
						}
						//more services ....
					}
				}
				//more keys....
			]
		}
		//more applications...
	]
};