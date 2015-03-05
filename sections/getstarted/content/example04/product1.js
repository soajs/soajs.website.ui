var product1 = {
	"_id": ObjectId('54ee234db7a669fc22b7f6ba'),
	"code": "PROD1",
	"name": "Product one",
	"description": "this is a test Product for examples",
	"packages": [
		{
			"code": "PROD1_PCK1",
			"name": "Package 1",
			"description": "This is a test package. It offers the urac, oauth and example04",
			"acl": {
				"urac": {},
				"example04":{}
			},
			"_TTL": 172800
		},
		{
			"code": "PROD1_PCK2",
			"name": "Package 2",
			"description": "Test package, it offers urac and example03",
			"acl": {
				"urac": {},
				"example03": {}
			},
			"_TTL": 172800
		},
		{
			"code": "PROD1_PCK3",
			"name": "Package 3",
			"description": "This test package offers urac, and only the buildName api from example03",
			"acl": {
				"urac": {},
				"example03": {
						"apisPermission": "restricted",
						"apis":{
							"/buildName": {}
						}
				}
			},
			"_TTL": 172800
		}
	]
};