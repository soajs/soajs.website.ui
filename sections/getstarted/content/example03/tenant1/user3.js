'use strict';
//password = 654321
var user3 = {
	"_id": ObjectId("54ee1bf91856706c2363930a"),
	"username": "user3",
	"password": '$2a$04$IYQThNn52hRm/DfZdanbkO/iTL5ytuoGBy6hQJX03ZcqDSA0KFFNq',
	"firstName": "user",
	"lastName": "three",
	"email": "user3@domain.com",
	"ts": new Date().getTime(),
	"status": "active",
	"profile": {},
	"groups": [],
	"config": {
		"packages": {
			"PROD1_PCK1": {
				"acl": {
					"urac": {},
					"example03": {
					}
				}
			}
		},
		"keys": {
			"41eb3256ce660a891205d0a0eca19421":{
				"config": { //KEY CONFIG
					"example03": {
						"tenantName": "set the tenant name specific to user three"
					}
				}
			},
			"19c03e42c750467c3f8481fbe26f2fef": { //URACKEY
				"config": { //URACKEYCONFIG
					"urac": {},
					"example03": {
						"tenantName": "this is specific to user 3"
					}
				},
				"acl": { //URACKEYACL
					"urac": {},
					"example03": {
						"apis":{}
					}
				}
			}
		}
	}
};