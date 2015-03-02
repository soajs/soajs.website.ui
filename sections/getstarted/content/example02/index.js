'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var serviceName = "example02";

var restApp = new soajs.restServer({
    "serviceName" : serviceName,
    "oauth" : true,
    "session": true,
    "config": config
});

restApp.get("/buildName", function (req, res) {
    var fullName = req.soajs.inputmaskData.firstName +' ' + req.soajs.inputmaskData.lastName ;
    res.json(req.soajs.buildRestResponse(null,{
        fullName:fullName
    }));
});


restApp.start();