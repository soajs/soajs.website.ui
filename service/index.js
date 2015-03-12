'use strict';
var soajs = require('soajs');
var config = require('./config.js');

var service = new soajs.server.service({
	"config": config
});

function sendMail( req, data, cb) {
	var transportConfiguration = config.mail.transport || null;
	var mailer = new (soajs.mail)(transportConfiguration);
	console.log ( 'mailer: ' );
	console.log ( mailer );
	
	console.log ( 'transportConfiguration: ' );
	console.log ( transportConfiguration );
	console.log ( ' ******************* ' );
	
	var mailOptions = {
		'to': config.mail.to,
		'from': data.email,
		'subject': config.mail.subject,
		'data': data
	};
	if(config.mail.content) {
		mailOptions.content = config.mail.content;
	} else {
		mailOptions.path = '/opt/soajs/node_modules/soajs/modules/soajs.core/registry/profiles/default/templates/mail/contactUs/sendMessage.tmpl';
	}
	console.log ( 'mailOptions: ' );
	console.log(mailOptions);console.log ( ' ******************* ' );
	
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
			console.log( error );
			//req.soajs.log.error(error); 
			return res.jsonp(req.soajs.buildResponse({"code": 100, "msg": config.errors[100]}));
		}
		console.log ( ' ** success **  ' );
		return res.jsonp(req.soajs.buildResponse(null, 'mail sent'));
	});
});

service.start();