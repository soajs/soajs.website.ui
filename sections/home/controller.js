"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.pageTitle = "Home";
    $scope.subTitle ="";
    var pageData = {
        title: "Complete enterprise open source",
        titleLine2: "platform as a service solution",
        subTitle: "Achieve with certainty: ROI, Speed, Quality, Standardization"
    };
    $scope.$parent.$emit('refreshPageTitle', pageData);


    $http.get("sections/home/repos.json").success(function(data) {
        $scope.repos = data;
    });


}]);