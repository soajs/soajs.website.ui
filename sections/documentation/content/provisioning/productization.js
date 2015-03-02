var uracProduct = {
	"_id": ObjectId("50d2cb5fc04ce51e06000001"),
	"code": "USERS",
	"name": "Users Product",
	"description": "Manage Users Accounts and Permissions",
	"packages": [
		{
			"_TTL": 86400000, // 24 hours
			"code": "USERS_URAC1",
			"name": "URAC package",
			"description": "User Registration & ACL",
			"acl": {
				//service name and acl options
				"urac": {
					"access": false,
					"apis": {
						"^/admin/.+$": {
							"access": ["adminGroup"]
						},
						"^/account/.+$": {
							"access": true
						}
					},
					"apisRegExp": [
						{
							"regExp": /^\/admin\/.+$/,
							"access": ["adminGroup"]
						}
					]
				}
			}
		}
		//more packages...
	]
};