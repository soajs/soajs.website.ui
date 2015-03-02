'use strict';
var soajs = require('soajs');
var config = require('./config.js');
var serviceName = "example01";

var restApp = new soajs.restServer({
    "serviceName" : serviceName,
    "config": config
});

restApp.get("/testGet", function (req, res) {
    res.json(req.soajs.buildRestResponse(null,{
        firstName:req.soajs.inputmaskData.firstName,
        lastName:req.soajs.inputmaskData.lastName,
        email:req.soajs.inputmaskData.email
    }));
});

restApp.get("/buildName", function (req, res) {
    //write your business logic here
    var fullName = req.soajs.inputmaskData.firstName +' ' + req.soajs.inputmaskData.lastName ;
    res.json(req.soajs.buildRestResponse(null,{
        fullName:fullName
    }));
});

restApp.delete("/testDel", function (req, res) {
    // some business logic
    res.json(req.soajs.buildRestResponse(null, true));
});

restApp.post("/testPost", function (req, res) {
    if (req.soajs.inputmaskData.firstName!='John'){
        //EXAMPLE: to simulate error response return
        res.json(req.soajs.buildRestResponse({"code": 900, "msg": config.errors[900]}));
    }else{
        res.json(req.soajs.buildRestResponse(null,{
            firstName:req.soajs.inputmaskData.firstName,
            lastName:req.soajs.inputmaskData.lastName,
            email:req.soajs.inputmaskData.email
        }));
    }
});

restApp.put("/testPut", function (req, res) {
    res.json(req.soajs.buildRestResponse(null,{
        firstName:req.soajs.inputmaskData.firstName,
        lastName:req.soajs.inputmaskData.lastName
    }));
});

restApp.start();