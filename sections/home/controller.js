"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.pageTitle = "Home";
    $scope.subTitle ="";
    var pageData = {
        title: "Complete enterprise open source",
        titleLine2: "microservice management platform ",
        subTitle: "Achieve with certainty: Durable Digital Agility"
    };
    $scope.$parent.$emit('refreshPageTitle', pageData);


    // $http.get("sections/home/repos.json").success(function(data) {
    //     $scope.repos = data;
    // });
	
	
	$http.get("sections/home/api.json").success(function(data) {
		$scope._api = data;
	});
	$http.get("sections/home/cloud.json").success(function(data) {
		$scope._cloud = data;
	});
	$http.get("sections/home/gateway.json").success(function(data) {
		$scope._gateway = data;
	});
	$http.get("sections/home/console.json").success(function(data) {
		$scope._console = data;
	});
	
	// $http.get("sections/home/our-product.json").success(function(data) {
	// 	$scope.ourProductList = data;
	// });
	
	$http.get("sections/home/advantages.json").success(function(data) {
		$scope.ourAdvantagesList = data;
	});
	
}]);