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


    $http.get("sections/home/repos.json").success(function(data) {
        $scope.repos = data;
    });
    
	$http.get("sections/home/our-product.json").success(function(data) {
		$scope.ourProductList = data;
	});
	
	$http.get("sections/home/advantages.json").success(function(data) {
		$scope.ourAdvantagesList = data;
	});
	
}]);