'use strict';
var soajs = require('soajs');
var config = require('./config.js');

var service = new soajs.server.service({
	"config": config,
	"session": true,
	"security": true,
	"multitenant": true,
	"acl": true
});

service.get("/buildName", function (req, res) {
	var tenant = req.soajs.servicesConfig.example03.tenantName|| null ;
	var name = req.soajs.inputmaskData.firstName +' ' + req.soajs.inputmaskData.lastName ;
	res.json(req.soajs.buildResponse(null,{
		tenantName:tenant,
		fullName:name
	}));
});

service.get("/testGet", function (req, res) {
	res.json(req.soajs.buildResponse(null,{
		firstName:req.soajs.inputmaskData.firstName,
		lastName:req.soajs.inputmaskData.lastName
	}));
});

service.start();