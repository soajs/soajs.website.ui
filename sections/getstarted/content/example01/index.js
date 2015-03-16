'use strict';
var soajs = require('soajs');
var config = require('./config.js');

var service = new soajs.server.service({
	"config": config
});

service.get("/testGet", function (req, res) {
	// example to show how you can build an api thats uses the GET protocol
	res.json(req.soajs.buildResponse(null,{
		firstName:req.soajs.inputmaskData.firstName,
		lastName:req.soajs.inputmaskData.lastName,
		email:req.soajs.inputmaskData.email
	}));
});

service.get("/buildName", function (req, res) {
	//write your business logic here
	var fullName = req.soajs.inputmaskData.firstName +' ' + req.soajs.inputmaskData.lastName ;
	res.json(req.soajs.buildResponse(null,{
		fullName:fullName
	}));
});

service.post("/testPost", function (req, res) {
	// example to show that you can use the POST protocol
	if (req.soajs.inputmaskData.firstName!='John'){
		//EXAMPLE: to simulate error response return
		res.json(req.soajs.buildResponse({"code": 900, "msg": config.errors[900]}));
	}else{
		res.json(req.soajs.buildResponse(null,{
			firstName:req.soajs.inputmaskData.firstName,
			lastName:req.soajs.inputmaskData.lastName,
			email:req.soajs.inputmaskData.email
		}));
	}
});

service.delete("/testDel", function (req, res) {
	// example to show how you can build an api thats uses the DELETE protocol
	// some business logic
	res.json(req.soajs.buildResponse(null, true));
});

service.put("/testPut", function (req, res) {
	// example to show that you can use the PUT protocol
	res.json(req.soajs.buildResponse(null,{
		firstName:req.soajs.inputmaskData.firstName,
		lastName:req.soajs.inputmaskData.lastName
	}));
});

service.start();