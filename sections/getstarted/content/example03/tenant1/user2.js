var user2 = {
	"_id": ObjectId("54ee46e7a8643c4d10a61ba3"),
	"username": "user2",
	"password": '$2a$04$yn9yaxQysIeH2VCixdovJ.TLuOEjFjS5D2Otd7sO7uMkzi9bXX1tq', //hash value of = 123456
	"firstName": "user",
	"lastName": "two",
	"email": "user2@domain.com",
	"ts":  1425383129777,
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
			"41eb3256ce660a891205d0a0eca19421":{
				"config": { //KEY CONFIG
					"example03": {
						"tenantName": "Tenant name specific to user two"
					}
				}
			}
		}
	}
};