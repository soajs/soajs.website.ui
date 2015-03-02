var registry = {
	"name": "dev",
	"version": "0.0",
	"environment": "develop",
	//...
	"rest": {
		//...
		"example01": {
			"extKeyRequired": false,
			"port": 4010,
			"host": "rest-proxy",
			"url": "http://rest-proxy:4000/example01"
		}
		//...
	}
};
module.exports = registry;