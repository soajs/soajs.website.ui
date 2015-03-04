'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var serviceName = "example02";

var service = new soajs.server.service({
	"oauth": true,
	"session": true,
	"config": config
});

service.get("/buildName", function(req, res) {
	var fullName = req.soajs.inputmaskData.firstName + ' ' + req.soajs.inputmaskData.lastName;
	res.json(req.soajs.buildRestResponse(null, {
		fullName: fullName
	}));
});
service.start();