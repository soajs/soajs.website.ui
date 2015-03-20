"use strict";
var featuresApp = app.components;

featuresApp.controller('FeaturesPageCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	$scope.featureList = [];
	$http.get('sections/features/data/features.json').success(function(data) {
		$scope.featureList = data;

		if($routeParams && $routeParams.anchor && $routeParams.anchor !== '' && jQuery) {
			setTimeout(function() {

				var elId = jQuery('#'+ $routeParams.anchor);
				jQuery("html body").animate({
					scrollTop: elId.offset().top - 50
				}, 500);

			}, 500);
		}


	});
}]);