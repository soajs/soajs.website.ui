//SOAJS adds to the req the following
req.soajs = {
	// object containing all the input specified in the schema of inputmask mw
	"inputmaskData": {},

	// the registry
	"registry" : {},

	// the logger object
	"log" : {"error" : function(){}},

	// build a response and returns it
	"buildResponse": function (error, data) {},

	// the validator object
	"validator" : {},

	// the meta object
	"meta" : {},

	// the services config from key or URAC
	"servicesConfig": {},

	//tenant info
	"tenant": {
		//tenant id
		"id": '',

		//tenant code
		"code": '',

		//tenant internal and external keys
		"key": {},

		//application info
		"application": {

			//application id
			"appId": '',

			//product code
			"product": '',

			//package code
			"package": '',

			//application acl
			"acl": '',

			//package acl
			"package_acl": ''

		}
	},

	// Access to the session data
	"session": {
		// to set service data into the session
		"setSERVICE": function (obj, cb) {},

		// to get the service data from the session
		"getSERVICE": function (obj, cb) {},

		// to get the URAC info from the session
		"getURAC": function () {},

		// to get the URAC groups info from the session
		"getGroups": function () {}
	}
};