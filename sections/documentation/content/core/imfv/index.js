'use strict';
var soajs = require('soajs');
var config = require('./config.js');

var service = new soajs.server.service({
	"config": config
});

service.init(function(){
	service.get("/testGet", function(req, res) {
		//do some business logic here ...
		res.json(req.soajs.buildResponse(null, {
			id: req.soajs.inputmaskData.id,
			firstName: req.soajs.inputmaskData.firstName
		}));
	});

	service.post("/testPost", function(req, res) {
		//do some business logic here ...
		res.json(req.soajs.buildResponse(null, {
			id: req.soajs.inputmaskData.id,
			email: req.soajs.inputmaskData.email,
			_TTL: req.soajs.inputmaskData._TTL,
			acl: req.soajs.inputmaskData.acl
		}));
	});

	service.start();
});