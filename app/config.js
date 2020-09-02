'use strict';
var sitekey = "6LfrQsYZAAAAALSeInG4jeGTDQ-hVlQ6lRI7M7bv";
var captcha1, captcha2, captcha3;
var iCaptcha1Value, aValueCaptcha, ccaptcha;

var myCallBack = function () {
	//Render the recaptcha1 on the element with ID "recaptcha1"
	captcha1 = grecaptcha.render('captcha1', {
		'sitekey': sitekey,
		"callback": function (value) {
			iCaptcha1Value = value;
		}
	});
	
	//Render the recaptcha2 on the element with ID "recaptcha2"
	captcha2 = grecaptcha.render('captcha2', {
		'sitekey': sitekey,
		"callback": function (value) {
			aValueCaptcha = value;
		}
	});
	
	captcha3 = grecaptcha.render('captcha3', {
		'sitekey': sitekey,
		"callback": function (value) {
			ccaptcha = value;
		}
	});
};