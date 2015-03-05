//SOAJS adds to the req the following
req.soajs = {
	// object containing all the input specified in the schema of inputmask mw
	"inputmaskData": {},

	// the registry
	"registry" : {},

	// the logger object
	"log" : {"error" : function(){}},

	// rest response object
	"restResponse": {},

	// build a restResponse and returns it
	"buildRestResponse": function (error, data) {},

	// the validator object
	"validator" : {},

	// the meta object
	"meta" : {},

	// the services config from key or URAC
	"servicesConfig": {},

	//tenant info
	"tenant": { id: '', code: '' },

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