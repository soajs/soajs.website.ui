"use strict";
var documentationApp = app.components;

documentationApp.controller('documentationtCtrl', ['$scope', '$http', '$routeParams', '$compile', 'loadFileContent', 'loadHTMLContent', 'loadJsonFileContent', function($scope, $http, $routeParams, $compile, loadFileContent, loadHTMLContent, loadJsonFileContent) {
	$scope.path = "sections/documentation/content/";
	$scope.loadCode = function(path, elId) {
		loadFileContent($scope, path, elId);
	};

	$scope.loadJson = function(path, elId) {
		loadJsonFileContent($scope, path, elId);
	};

	$scope.loadSection = function(sectionName, subSectionName) {
		var angularElement = angular.element(document.getElementById('documentationPreview'));
		$http.get('sections/documentation/content/' + sectionName + '/' + subSectionName + '/data.json').success(function(data) {
			$scope[subSectionName.replace("-", "_")] = data;
		}).error(function(error){
			console.log(error);
		});

		$http.get('sections/documentation/' + sectionName + '/' + subSectionName + ".html").success(function(data) {
			angularElement.html(data);
			$compile(angularElement.contents())($scope);
			renderCodeSnippets();
		}).error(function() {
			alert("Error fetching documentation page. Please try again.");
		});

		$scope.docuLink = "/documentation/" + sectionName + '/' + subSectionName;
	};

	if($routeParams && $routeParams.section) {
		$scope.loadSection($routeParams.section, $routeParams.subSection);
	}
	else {
		$scope.loadSection('core', 'service');
	}

	$scope.loadHTML = function(path, elId) {
		loadHTMLContent($scope, path, elId);
	};
}]);