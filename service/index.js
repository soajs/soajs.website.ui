'use strict';
var soajs = require('soajs');
var config = require('./config.js');

var service = new soajs.server.service({
	"config": config
});

function sendMail( req, data, cb) {
	var transportConfiguration = config.mail.transport || null;
	var mailer = new (soajs.mail)(transportConfiguration);

	var mailOptions = {
		'to': config.mail.to,
		'from': data.email,
		'subject': config.mail.subject,
		'data': data,
		'path': req.soajs.registry.projectPath + 'templates/' + req.soajs.registry.services.contactUs.mail['sendMessage']
	};

	mailer.send(mailOptions, cb);
}

service.post("/sendMessage", function (req, res) {
	var data = {
		email: req.soajs.inputmaskData['email'],
		name: req.soajs.inputmaskData['name'],
		purpose: req.soajs.inputmaskData['purpose'],
		message: req.soajs.inputmaskData['message']
	};

	sendMail( req, data, function(error) {
		if(error) { 
			req.soajs.log.error(error);
			return res.jsonp(req.soajs.buildResponse({"code": 100, "msg": config.errors[100]}));
		}

		return res.jsonp(req.soajs.buildResponse(null, true));
	});
});

service.start();