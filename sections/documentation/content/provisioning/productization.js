var product1 = {
	"_id": ObjectId('54ee234db7a669fc22b7f6ba'),
	"code": "PROD1",
	"name": "Product one",
	"description": "this is a test Product for examples",
	"packages": [
		{
			"code": "PROD1_PCK1",
			"name": "Package 1",
			"description": "This package has access to urac service",
			"acl": {
				"urac": {}
			},
			"_TTL": 172800
		},
		{
			"code": "PROD1_PCK2",
			"name": "Package 2",
			"description": "This package has access to urac and example03",
			"acl": {
				"urac": {},
				"example03": {}
			},
			"_TTL": 172800
		},
		{
			"code": "PROD1_PCK3",
			"name": "Package 3",
			"description": "This package has access to urac, and only one api from example03",
			"acl": {
				"urac": {},
				"example03": {
					"apisPermission": "restricted",
					"apis": {
						"/buildName": {}
					}
				}
			},
			"_TTL": 172800
		}
	]
};