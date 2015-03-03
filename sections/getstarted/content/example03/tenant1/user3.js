var user3 = {
	"_id": ObjectId("54ee1bf91856706c2363930a"),
	"username": "user3",
	"password": '$2a$04$IYQThNn52hRm/DfZdanbkO/iTL5ytuoGBy6hQJX03ZcqDSA0KFFNq', //hash value of = 654321
	"firstName": "user",
	"lastName": "three",
	"email": "user3@domain.com",
	"ts": 1425383129777,
	"status": "active",
	"profile": {},
	"groups": [],
	"config": {
		"packages": {
			"PROD1_PCK1": {
				"acl": {
					"urac": {},
					"example03": {}
				}
			}
		},
		"keys": {

			"19c03e42c750467c3f8481fbe26f2fef": { //URACKEY
				"config": { //URACKEYCONFIG
					"example03": {
						"tenantName": "Tenant name specific to user three"
					}
				},
				"acl": { //URACKEYACL
					"urac": {},
					"example03": {
						"apisPermission": "restricted",
						"apis": {
							"/buildName": {}
						}
					}
				}
			}
		}
	}
};