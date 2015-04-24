"use strict";
var myApp = app.components;
myApp.controller('getStartedCtrl', ['$scope', '$http', '$routeParams', '$compile', 'loadFileContent', 'loadJsonFileContent', function($scope, $http, $routeParams, $compile, loadFileContent, loadJsonFileContent) {
	$scope.path = "sections/getstarted/content/";

	$scope.loadCode = function(path, elId) {
		loadFileContent($scope, path, elId);
	};
	$scope.loadJSON = function(path, elId) {
		loadJsonFileContent($scope, path, elId);
	};

	$scope.loadSection = function(sectionName) {
		$scope.getStartedLink = "/getSarted/" + sectionName;
		console.log($scope.getStartedLink);

		var angularElement = angular.element(document.getElementById('getStartedPreview'));
		$http.get('sections/getStarted/' + sectionName + ".html").success(function(data) {
			angularElement.html(data);
			$compile(angularElement.contents())($scope);
			renderCodeSnippets();
		}).error(function() {
			alert("Error fetching documentation page. Please try again.");
		});
	};

	if($routeParams && $routeParams.section) {
		$scope.loadSection($routeParams.section, $routeParams.subSection);
	}
	else {
		$scope.loadSection('getStarted');
	}
}]);