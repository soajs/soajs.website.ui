"use strict";
var myApp = app.components;
myApp.controller('getStartedCtrl', [function($scope) {
    $scope.path = "sections/documentation/content/";
    $scope.loadCode = function(path, elId) {
        loadFileContent($scope, path, elId);
    };
}]);

myApp.controller('example01Ctrl', [ '$scope', 'loadFileContent', 'loadJsonFileContent', function($scope, loadFileContent, loadJsonFileContent) {
    $scope.path = "sections/getstarted/content/";
    $scope.loadCode = function(path, elId) {
        loadFileContent($scope, path, elId);
    };
    $scope.loadJSON = function(path, elId) {
        loadJsonFileContent($scope, path, elId);
    };

		if($routeParams && $routeParams.anchor && $routeParams.anchor !== '' && jQuery) {
			setTimeout(function() {

				var elId = jQuery('#'+ $routeParams.anchor);
				jQuery("html body").animate({
					scrollTop: elId.offset().top - 50
				}, 500);

			}, 500);
		}

}]);
myApp.controller('example02Ctrl', [ '$scope', 'loadFileContent','loadJsonFileContent', function($scope, loadFileContent,loadJsonFileContent) {
    $scope.path = "sections/getstarted/content/";
    $scope.loadCode = function(path, elId) {
        loadFileContent($scope, path, elId);
    };
    $scope.loadJSON = function(path, elId) {
        loadJsonFileContent($scope, path, elId);
    };
}]);
myApp.controller('example03Ctrl', [ '$scope', 'loadFileContent','loadJsonFileContent' ,function($scope, loadFileContent,loadJsonFileContent) {
    $scope.path = "sections/getstarted/content/";
    $scope.loadCode = function(path, elId) {
        loadFileContent($scope, path, elId);
    };
    $scope.loadJSON = function(path, elId) {
        loadJsonFileContent($scope, path, elId);
    };
}]);
