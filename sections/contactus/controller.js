"use strict";
var contactUsApp = app.components;
contactUsApp.controller('contactCtrl', [ '$scope', '$http', '$timeout', '$window', function ($scope, $http, $timeout, $window) {
	$scope.alerts = [];
	$scope.contact = {
		name: '',
		email: '',
		message: '',
		purpose: '',
		captcha: ''
	};
	
	$scope.project = {
		company: '',
		address: '',
		name: '',
		email: '',
		phone: '',
		message: ''
	};
	
	$scope.join = {
		name: '',
		email: '',
		location: '',
		github: '',
		product: '',
		message: ''
	};
	
	
	let address = window.location.protocol + "//api.soajs.org:" + window.location.port ;
	
	$scope.closeAlert = function (index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.closeAllAlerts = function () {
		$timeout(function () {
			$scope.alerts = [];
		}, 10000);
	};

    $http.get("sections/home/repos.json").success(function(data) {
        $scope.repos = data;
    });
    
	$scope.sendContact = function () {
		$scope.alerts.push({ 'type': 'warning', 'msg': "Your message is being sent, please wait ..." });
		$scope.contact.captcha = iCaptcha1Value;
		$http({
			method: 'POST',
			url: address + '/soajsorg/sendMessage',
			data: $scope.contact,
			headers: { 'Content-Type': 'application/json' }
		}).success(function (data, status, headers, config) {
			grecaptcha.reset();
			if (data.result === true) {
				$scope.contact = {
					name: '',
					email: '',
					message: '',
					purpose: ''
				};

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
	};

	$scope.sendRequest = function () {
		$scope.alerts.push({ 'type': 'warning', 'msg': "Your message is being sent, please wait ..." });
		$scope.project.captcha = aValueCaptcha;
		$scope.project.isSubmitProject = true;
		
		$http({
			method: 'POST',
			url: address + '/soajsorg/sendProject',
			data: $scope.project,
			headers: { 'Content-Type': 'application/json' }
		}).success(function (data, status, headers, config) {
			grecaptcha.reset();
			if (data.result === true) {
				$scope.project = {
					company: '',
					address: '',
					name: '',
					email: '',
					phone: '',
					message: ''
				};
				
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
	};

	$scope.joinUs = function () {
		$scope.alerts.push({ 'type': 'warning', 'msg': "Your message is being sent, please wait ..." });
		$scope.join.captcha = ccaptcha;
		$scope.join.isContribute = true;
		$http({
			method: 'POST',
			url: address + '/soajsorg/sendContribute',
			data: $scope.join,
			headers: { 'Content-Type': 'application/json' }
		}).success(function (data, status, headers, config) {
			grecaptcha.reset();
			if (data.result === true) {
				$scope.join = {
					name: '',
					email: '',
					location: '',
					github: '',
					product: '',
					message: ''
				};
				
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
	};
	
	$scope.toggleSelection = function(badge){
		if(!$scope.join.product || !Array.isArray($scope.join.product)){
			$scope.join.product = [];
		}
		
		if($scope.join.product.indexOf(badge.id) === -1){
			$scope.join.product.push(badge.id);
		}
		else{
			for(var i = $scope.join.product.length -1; i >=0; i--){
				if($scope.join.product[i] === badge.id){
					$scope.join.product.splice(i, 1);
					break;
				}
			}
		}
	};
	
	var pageData = {
		title: "Contact Us",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

} ]);

