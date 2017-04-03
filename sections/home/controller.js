"use strict";
var homeApp = app.components;
homeApp.controller('homePageCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.name = "Jamil";
    $scope.page = {
        "name": "Home",
        "bannerClass": "homeTop"
    };

}]);