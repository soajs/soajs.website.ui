"use strict";
var myApp = app.components;
myApp.controller('getStartedCtrl', ['$scope','loadFileContent','loadJsonFileContent', function($scope, loadFileContent, loadJsonFileContent) {
    $scope.path = "sections/getstarted/content/";

    $scope.loadCode = function(path, elId) {
        loadFileContent($scope, path, elId);
    };
    $scope.loadJSON = function(path, elId) {
        loadJsonFileContent($scope, path, elId);
    };
}]);