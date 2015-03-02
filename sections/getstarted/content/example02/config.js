'use strict';

module.exports = {
    "errors": {
    },
    "schema": {
        "/buildName" : {
            "input" : {
                "firstName" : {
                    "source" : [ 'query.firstName' ],
                    "required" : true,
                    "validation" : {
                        "type" : "string"
                    }
                },
                "lastName" : {
                    "source" : [ 'query.lastName' ],
                    "required" : true,
                    "validation" : {
                        "type" : "string"
                    }
                }
            }
        }
    }
};