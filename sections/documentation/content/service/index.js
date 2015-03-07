"use strict";
var soajs = require('soajs');
var config = require('./config.js');
var service = new soajs.server.service({
	"config": config
});
service.get("/testGet", function(req, res) {
	res.json(req.soajs.buildResponse(null, {
		"firstName": req.soajs.inputmaskData.firstName,
		"lastName": req.soajs.inputmaskData.lastName
	}));
});
service.start();