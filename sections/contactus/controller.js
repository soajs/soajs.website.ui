"use strict";
var contactUsApp = app.components;
contactUsApp.controller('contactCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
	// $scope.contact.email = "enassif@kyube.com";
	$scope.alerts = [];

	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.closeAllAlerts = function() {
		$timeout(function() { $scope.alerts = []; }, 10000);
	};

	$scope.sendContact = function() {
		if($scope.contactForm.$valid) {
			console.log($scope.contact);

			// TODO : send mail
			/*
			 $http({
			 method :'POST',
			 url:'http://www.google.com',
			 data: $scope.contact ,
			 headers: {'Content-Type': 'application/json'}
			 }).success(function (data, status, headers, config) {
			 console.log('status',status);
			 console.log('data',status);
			 console.log('headers',status);

			 $scope.contact = {};
			 });
			 */

			$scope.contact = {
				name: '',
				email: '',
				message: '',
				purpose: ''
			};

			$scope.contactForm.$setPristine();
			$scope.alerts.push({'type': 'success', 'msg': "Thank you for contacting us. We will get back to you shortly."});
			$scope.closeAllAlerts();
		}
	};
}]);

