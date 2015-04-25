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

	"tenantMetaDB": {
		"urac": {
			"name": "#TENANT_NAME#_%service name%",
			"prefix": dServers.prefix,
			"servers": dServers.servers,
			"credentials": dServers.credentials,
			"URLParam": dOptions.URLParam,
			"extraParam": dOptions.extraParam
		}
	},

	"serviceConfig": {
		"awareness": {
			"healthCheckInterval": 5000,
			"autoRelaodRegistry": 300000
		},
		"agent": {
			"topologyDir": "/opt/soajs/"
		},
		"key": {
			"algorithm": "aes256",
			"password": "my secret key"
		},
		"logger": {
			"src": true,
			"level": "debug"
		},
		"cors": {
			"enabled": true,
			"origin": "*",
			"credentials": "true",
			"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
			"headers": "key,soajsauth,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type",
			"maxage": 1728000
		},
		"oauth": {
			"grants": ["password", "refresh_token"],
			"debug": false
		},
		"ports": {
			"controller": 4000,
			"maintenanceInc": 1000,
			"randomInc": 100
		},
		"cookie": {
			"secret": "this is a secret sentence"
		},
		"session": {
			"name": "soajsID",
			"secret": "this is my app server",
			"cookie": {
				"path": "/",
				"httpOnly": true,
				"secure": false,
				"domain": "soajs.com",
				"maxAge": null
			},
			"resave": false,
			"saveUninitialized": false
		}
	},

	"services": {
		"controller": {
			"maxPoolSize": 100,
			"authorization": true,
			"port": 4000,
			"requestTimeout": 30,
			"requestTimeoutRenewal": 0
		},
		"helloworld": {
			"extKeyRequired": false,
			"port": 4020,
			"requestTimeoutRenewal": null,
			"requestTimeout": null
		}
		//...
	}
};

module.exports = registry;