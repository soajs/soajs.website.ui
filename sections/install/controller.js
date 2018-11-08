"use strict";
var installApp = app.components;

installApp.controller('installPageCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	var pageData = {
		title: "Install",
		class: "platform",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);
	
	$scope.installerZipLink = "https://sourceforge.net/projects/soajs/files/soajs.installer.zip/download";
}]);
