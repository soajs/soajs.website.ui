var userRecord = {
	"_id": ObjectId('22d2cb5fc04ce51e06000001'),
	"username": "userOne",
	"password": "$2a$04$EfG6mMcD/o5UCU9qnkSIAOMx20msSKgNhCWrqfAd7SHtan5ae2NWO",
	"firstName": "User",
	"lastName": "One",
	"email": "user.one@domain.com",
	"ts": 1424435058130,
	"status": "active",
	"profile": {
		"img": "http://somedomain.com/somepath/someimage.png",
		"gender": "male"
	},
	"groups": ['members'],
	"config": {
		"packages": {
			"USERS_URAC1": {
				"acl": {
					"urac": {},
					"example03": {}
				}
			}
		},
		"keys": {
			"d1eaaf5fdc35c11119330a8a0273fee9": {
				"config": {
					"urac": {}
				},
				"acl": {
					"urac": {},
					"example01": {}
				}
			}
		}
	},
	"tenant":{
		"id": '54ee28cc203674ba271d57a4',
		"code": 'TNT2'
	}
};