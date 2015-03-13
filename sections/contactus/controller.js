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
		$scope.alerts.push({'type': 'warning', 'msg': "Your message is being sent, please wait ..."});
		if($scope.contactForm.$valid) {
			$http({
				method: 'POST',
				url: 'http://api.soajs.org/contactUs/sendMessage',
				data: $scope.contact,
				headers: {'Content-Type': 'application/json'}
			}).success(function(data, status, headers, config) {
				if(data.result === true){
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
				else{
					$scope.alerts.push({'type': 'danger', 'msg': "Sorry, wasn't able to send your message to the team. Try again later."});
					$scope.closeAllAlerts();
				}
			}).error(function(errData, status, headers, config) {
				$scope.alerts.push({'type': 'danger', 'msg': "Sorry, wasn't able to send your message to the team. Try again later."});
				$scope.closeAllAlerts();
			});
		}
	};
}]);

