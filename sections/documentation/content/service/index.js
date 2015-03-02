"use strict";
var soajs = require('soajs');
var config = require('./config.js');
var restApp = new soajs.restServer(config);
restApp.get("/testGet", function(req, res) {
	res.json(req.soajs.buildRestResponse(null, {
		"firstName": req.soajs.inputmaskData.firstName,
		"lastName": req.soajs.inputmaskData.lastName
	}));
});
restApp.start();