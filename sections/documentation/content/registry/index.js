var dServers = require("../configurations/servers");
var dOptions = require("../configurations/options");

var registry = {
	"name": "dev",
	"version": "0.0",
	"environment": "develop", // develop || production

	"coreDB": {
		"dashboard": {
			"name": "core_dashboard",
			"prefix": dServers.prefix,
			"servers": dServers.servers,
			"credentials": dServers.credentials,
			"URLParam": dOptions.URLParam,
			"extraParam": dOptions.extraParam
		}
		//...
	},
	"services": {
		"controller": {
			"port": 4000,
			"host": "rest-proxy",
			"maxPoolSize": 100,
			"requestTimeout": 30,
			"requestTimeoutRenewal": 0,
			"authorization": true
		},
		"urac": {
			"extKeyRequired": true,
			"port": 4001,
			"host": "rest-proxy",
			"url": "http://rest-proxy:4000/urac",
			"mail": {
				"join": "mail/urac/join.tmpl",
				"forgotPassword": "mail/urac/forgotPassword.tmpl",
				"addUser": "mail/urac/addUser.tmpl",
				"changeUserStatus": "mail/urac/changeUserStatus.tmpl",
				"changeEmail": "mail/urac/changeEmail.tmpl"
			}
		},
		"oauth": {
			"extKeyRequired": true,
			"port": 4002,
			"host": "rest-proxy",
			"url": "http://rest-proxy:4000/oauth"
		},
		//...
		"example01": {
			"extKeyRequired": false,
			"port": 4010,
			"host": "rest-proxy",
			"url": "http://rest-proxy:4000/example01"
		}
		//...
	}
};

module.exports = registry;