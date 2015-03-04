'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var service = new soajs.server.service({
	"config": config,
	"oauth": true,
	"session": true,
	"security": true,
	"multitenant": true,
	"acl": true
});

service.get("/buildName", function(req, res) {
	var tenant = '';
	if(req.soajs.servicesConfig) {
		if(req.soajs.servicesConfig.example04) {
			tenant = req.soajs.servicesConfig.example04.tenantName || null;
		}
	}
	
	var name = req.soajs.inputmaskData.firstName + ' ' + req.soajs.inputmaskData.lastName;
	res.json(req.soajs.buildRestResponse(null, {
		tenantName: tenant,
		fullName: name
	}));
});

service.start();