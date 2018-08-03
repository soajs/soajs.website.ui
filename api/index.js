'use strict';
process.env.SOAJS_SOLO=true;

const soajs = require('soajs');
const config = require('./config.js');
const request = require("request");

let service = new soajs.server.service(config);

function checkCaptcha(req, res, cb){
	let captcha = req.soajs.inputmaskData.captcha;
	if (captcha && captcha !== '') {
		
		let secret_key = process.env.GOOGLE_CAPTCHA_KEY;
		let verificationUrl = process.env.GOOGLE_CAPTCHA_URL + "?secret=" + secret_key + "&response=" + captcha;
		
		request(verificationUrl, (error, response, body) => {
			if (error) {
				req.soajs.log.error(error);
				return res.jsonp(req.soajs.buildResponse({ code: 400, msg: "Unable to send email, please try again later." }));
			}
			
			body = JSON.parse(body);
			// Success will be true or false depending upon captcha validation.
			if (body.success) {
				return cb();
			} else {
				return res.jsonp(req.soajs.buildResponse({ code: 400, msg: "Invalid Captcha Message Provided, please try again later." }));
			}
		});
	} else {
		return res.jsonp(req.soajs.buildResponse({ code: 400, msg: "Missing Captcha Message, please try again later." }));
	}
}

function checkIfError(req, res, data, cb) {
	return data.check ? res.jsonp(req.soajs.buildResponse({code: data.code, msg: data.error})) : cb();
}

function sendMail(req, res, data, subject, type, cb) {
	checkCaptcha(req, res, () => {
		
		let transportConfiguration = config.mail.transport || null;
		let mailer = new (soajs.mail)(transportConfiguration);
		
		let mailOptions = {
			'to': config.mail.to,
			'from': data.email,
			'subject': subject,
			'data': data,
			'path': ''
		};
		
		switch(type){
			case 'contribute':
				mailOptions.path = __dirname + "/templates/contribute.tmpl";
				break;
			case 'project':
				mailOptions.path = __dirname + "/templates/project.tmpl";
				break;
			case 'message':
			default:
				mailOptions.path = __dirname + "/templates/message.tmpl";
				break;
		}
		
		mailer.send(mailOptions, cb);
	});
}

let corsMW = function() {
	return function(req, res, next) {
		var method = req.method && req.method.toUpperCase && req.method.toUpperCase();
		var origin = '*';
		var credentials = 'true';
		var methods = 'GET,HEAD,PUT,PATCH,POST,DELETE';
		var headers = 'Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
		var maxage = 1728000;
		if(method === 'OPTIONS') {
			res.setHeader('Access-Control-Allow-Origin', origin);
			res.setHeader('Access-Control-Allow-Credentials', credentials);
			res.setHeader('Access-Control-Allow-Methods', methods);
			res.setHeader('Access-Control-Allow-Headers', headers);
			res.setHeader('Access-Control-Max-Age', maxage);
			
			res.statusCode = 204;
			res.end();
		}
		else {
			res.setHeader('Access-Control-Allow-Origin', origin);
			res.setHeader('Access-Control-Allow-Credentials', credentials);
			res.setHeader('Access-Control-Expose-Headers', headers);
			next();
		}
	}
};

service.init(() => {
	service.app.use(corsMW());
	
	service.post("/sendMessage", (req, res) => {
		let data = req.soajs.inputmaskData;
		sendMail(req, res, data, 'New Email from SOAJS Website', 'message', (error) => {
			let data = {
				"check": error,
				"code": 401,
				"error": config.errors[401]
			};
			checkIfError(req, res, data, () => {
				return res.jsonp(req.soajs.buildResponse(null, true));
			});
		});
	});
	
	service.post("/sendProject", (req, res) => {
		let data = req.soajs.inputmaskData;
		sendMail(req, res, data, 'New Project from SOAJS Website', 'project', (error) => {
			let data = {
				"check": error,
				"code": 401,
				"error": config.errors[401]
			};
			checkIfError(req, res, data, () => {
				return res.jsonp(req.soajs.buildResponse(null, true));
			});
		});
	});
	
	service.post("/sendContribute", (req, res) => {
		let data = req.soajs.inputmaskData;
		data.product = data.product.join(" - ");
		sendMail(req, res, data, 'New Contributor from SOAJS Website', 'contribute', (error) => {
			let data = {
				"check": error,
				"code": 401,
				"error": config.errors[401]
			};
			checkIfError(req, res, data, () => {
				return res.jsonp(req.soajs.buildResponse(null, true));
			});
		});
	});
	
	service.start();
});