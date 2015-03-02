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
	"rest": {
		"_conf": {
			"cors": {
				"enabled": true,
				"origin": '*'
				//...
			},
			"oauth": {
				"grants": ['password', 'refresh_token'],
				"debug": false
			},
			"cookie": {"secret": "this is a secret sentence"},
			"session": {
				"name": "soajsID"
				//...
			}
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