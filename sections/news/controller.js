"use strict";
var newsApp = app.components;

newsApp.controller('newsPageCtrl', ['$scope', '$http', function ($scope, $http) {
	var pageData = {
		title: "Releases",
		subTitle: ""
	};
	$scope.$parent.$emit('refreshPageTitle', pageData);

    $http.get("sections/home/repos.json").success(function(data) {
        $scope.repos = data;
    });

}]);
