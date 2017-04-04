"use strict";
var contactUsApp = app.components;
contactUsApp.controller('contactCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
	$scope.alerts = [];

	$scope.closeAlert = function (index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.closeAllAlerts = function () {
		$timeout(function () {
			$scope.alerts = [];
		}, 10000);
	};

	$scope.sendContact = function () {
		$scope.alerts.push({'type': 'warning', 'msg': "Your message is being sent, please wait ..."});
		if ($scope.contactForm.$valid) {
			$scope.contact.captcha = document.getElementById('g-recaptcha-response').value;
			$http({
				method: 'POST',
				url: '/sections/contactus/sendMail.php',
				data: $scope.contact,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).success(function (data, status, headers, config) {
				grecaptcha.reset();
				if (data.result === true) {
					$scope.contact = {
						name: '',
						email: '',
						message: '',
						purpose: ''
					};

					$scope.contactForm.$setPristine();
					$scope.alerts.push({
						'type': 'success',
						'msg': "Thank you for contacting us. We will get back to you shortly."
					});
					$scope.closeAllAlerts();
				}
				else {
					$scope.alerts.push({
						'type': 'danger',
						'msg': "Sorry, wasn't able to send your message to the team. Try again later."
					});
					$scope.closeAllAlerts();
				}
			}).error(function (errData, status, headers, config) {
				$scope.alerts.push({
					'type': 'danger',
					'msg': "Sorry, wasn't able to send your message to the team. Try again later."
				});
				$scope.closeAllAlerts();
			});
		}
	};

	var pageData = {
		title: "Contact Us",
		subTitle: "Contact"
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

}]);

