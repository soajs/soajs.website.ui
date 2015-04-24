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
			"product": "PROD1",
			"package": "PROD1_PCK1",
			"appId": ObjectId("30d2cb5fc04ce51e06000001"),
			"description": "this is a description ...",
			"_TTL": 604800000, // 7 days in milliseconds
			"keys": [
				{
					"key": "d1eaaf5fdc35c11119330a8a0273fee9",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 604800000,
							"extKey": "aa39b5490c4a4ed0e56d7ec1232a428f77...",
							"device": {
								"browser": "ff"
							},
							"geo": {
								"ip": "127.0.0.1"
							}
						}
					],
					"config": {
						"dev": {
							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32 //used by hasher
							}
						}
					}
				}
			]
		},
		{
			"product": "PROD1",
			"package": "PROD1_PCK2",
			"appId": ObjectId("54d2cb5be64ce51e06000005"),
			"description": "this is a description ...",
			"acl": {
				"urac": {},
				"example02": {},
				"example03": {}
			},
			"_TTL": 604800000, // 7 days in milliseconds
			"keys": [
				{
					"key": "e5eaaf5fdc35c164319330a8a0273feb6",
					"extKeys": [
						{
							"expDate": new Date().getTime() + 604800000,
							"extKey": "7bc1e66d003a3b2acfce1557cbda7320...",
							"device": {},
							"geo": {}
						}
					],
					"config": {
						"dev":{
							"urac": {
								"hashIterations": 1024, //used by hasher
								"seedLength": 32 //used by hasher
								// more configuartion
							},
							"example03": {
								"tenantName": "My Test Tenant" //specific tenant info for service
								// more configuartion
							}
						}
					}
				}
			]
		}
	]
};