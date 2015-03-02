"use strict";
var documentationApp = app.components;

documentationApp.controller('documentationtCtrl', ['$scope', '$http', '$routeParams', '$compile', 'loadFileContent', 'loadHTMLContent', function($scope, $http, $routeParams, $compile, loadFileContent, loadHTMLContent) {
	$scope.path = "sections/documentation/content/";
	$scope.loadCode = function(path, elId) {
		loadFileContent($scope, path, elId);
	};

	$scope.loadSection = function(sectionName) {
		var angularElement = angular.element(document.getElementById('documentationPreview'));

		$http.get('sections/documentation/content/' + sectionName + '/data.json').success(function(data) {
			$scope[sectionName.replace("-","_")] = data;
		});

		$http.get('sections/documentation/' + sectionName + ".html").success(function(data) {
			angularElement.html(data);
			$compile(angularElement.contents())($scope);
			renderCodeSnippets();
		}).error(function() {
			alert("Error fetching documentation page. Please try again.");
		});
	};

	if($routeParams && $routeParams.section) {
		$scope.loadSection($routeParams.section);
	}
	else {
		$scope.loadSection('service');
	}

	$scope.loadHTML = function(path, elId) {
		loadHTMLContent($scope, path, elId);
	};
}]);