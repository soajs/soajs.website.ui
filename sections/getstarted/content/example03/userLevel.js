var test = {
	"_id": ObjectId("22d2cb5fc04ce51e06000001"),
	"username": "john",
	"password": '$2a$04$EfG6mMcD/o5UCU9qnkSIAOMx20msSKgNhCWrqfAd7SHtan5ae2NWO',
	"firstName": "John",
	"lastName": "Doe",
	"email": "john.doe@domain.com",
	"ts": new Date().getTime(),
	"status": "approved",
	"profile": {},
	"groups": [],
	"config": {
		"packages": {
			"TPROD_BASIC": { //URACPACKAGE
				"acl": { //URACPACKAGEACL
					"urac": {}
				}
			}
		},
		"keys": {
			"d1eaaf5fdc35c11119330a8a0273fee9": { //URACKEY
				"config": { //URACKEYCONFIG
					"urac": {}
				},
				"acl": { //URACKEYACL
					"urac": {},
					"example03": {}
				}
			}
		}
	}
}