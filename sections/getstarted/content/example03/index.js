'use strict';
var soajs = require('soajs');

var config = require('./config.js');
var serviceName = "example03";

var service = new soajs.server.service({
	"serviceName" : serviceName,
	"config": config,
	"session": true,
	"security": true,
	"multitenant": true,
	"acl": true
});

service.get("/buildName", function (req, res) {
	var tenant = req.soajs.servicesConfig.example03.tenantName|| null ;
	var name = req.soajs.inputmaskData.firstName +' ' + req.soajs.inputmaskData.lastName ;
	res.json(req.soajs.buildRestResponse(null,{
		tenantName:tenant,
		fullName:name
	}));
});

service.get("/testGet", function (req, res) {
	res.json(req.soajs.buildRestResponse(null,{
		firstName:req.soajs.inputmaskData.firstName,
		lastName:req.soajs.inputmaskData.lastName
	}));
});

service.start();