"acl": {
	"serviceName1":{
		"access": false,
		"apisRegExp": [
			{
				"regExp": /^\/admin\/.+$/ , //All APIs starting with /admin/...
				"access": ["admin"] 
			},
			{
				"regExp": /^\/account\/.+$/ , //All APIs starting with /account/...
				"access": true  
			}
		]
	}
}