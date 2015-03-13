"acl": {
	"serviceName1":{
		"apisPermission": "restricted",
		"apis": {
			"/account/myAccount" : { "access" : true }
		}
	},
	"serviceName2":{
		"apisPermission": "restricted",
		"apisRegExp": [
			{
				"regExp": /^\/account\/.+$/ , //All APIs starting with /account/...
				"access": true  
			}
		]
	}
}