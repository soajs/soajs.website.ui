'use strict';
var app = angular.module('mainWebsite', ['ui.bootstrap', 'ngRoute', 'ngSanitize']);

app.config([
	'$routeProvider',
	'$controllerProvider',
	'$compileProvider',
	'$filterProvider',
	'$provide',
	'$sceDelegateProvider',
	function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $sceDelegateProvider) {

		app.compileProvider = $compileProvider;
		navigation.forEach(function (navigationEntry) {
			if (navigationEntry.scripts && navigationEntry.scripts.length > 0) {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath,
					resolve: {
						load: ['$q', '$rootScope', function ($q, $rootScope) {
							var deferred = $q.defer();
							require(navigationEntry.scripts, function () {
								$rootScope.$apply(function () {
									deferred.resolve();
								});
							});
							return deferred.promise;
						}]
					}
				});
			}
			else {
				if (navigationEntry.tplPath && navigationEntry.tplPath !== '') {
					$routeProvider.when(navigationEntry.url.replace('#', ''), {
						templateUrl: navigationEntry.tplPath
					});
				}
			}
		});

		$routeProvider.otherwise({
			redirectTo: navigation[0].url.replace('#', '')
		});

		app.components = {
			controller: $controllerProvider.register,
			service: $provide.service
		};
	}
]);

app.controller('mainCtrl', ['$scope', '$location', '$routeParams', function ($scope, $location, $routeParams) {

	$scope.today = new Date().getTime();

	$scope.goToAnchor = function (section, anchor) {
		//console.log("goToAnchor: /" + section + "/" + anchor);
		$location.path("/" + section + "/" + anchor);
	};

	$scope.$on('$routeChangeSuccess', function (event, current, previous) {
		$scope.currentLocation = $location.path();
		for (var entry = 0; entry < navigation.length; entry++) {
			var urlOnly = navigation[entry].url.replace('/:anchor?', '').replace("/:section?", '');
			if (urlOnly === '#' + $scope.currentLocation) {
				if (navigation[entry].title && navigation[entry].title !== '') {
					jQuery('head title').html(navigation[entry].title);
				}

				if (navigation[entry].keywords && navigation[entry].keywords !== '') {
					jQuery('head meta[name=keywords]').attr('content', navigation[entry].keywords);
				}

				if (navigation[entry].description && navigation[entry].description !== '') {
					jQuery('head meta[name=description]').attr('content', navigation[entry].description);
				}
			}
		}

		var subPagesDetection = $scope.currentLocation.match(/\//g);
		if (subPagesDetection.length > 1) {
			var p = $location.path().split(/\//);
			$scope.currentLocation = "/" + p[1];
		}

		if ($routeParams.anchor) {
			var sp = '/' + $routeParams.anchor;
			var p = $location.path().split(sp);
			$scope.currentLocation = p[0];
		}
		
	});
	/*
	 if($routeParams && $routeParams.anchor && $routeParams.anchor !== '' && jQuery) {
	 setTimeout(function() {

	 var elId = jQuery('#'+ $routeParams.anchor);
	 jQuery("html body").animate({
	 scrollTop: elId.offset().top - 50
	 }, 500);

	 }, 500);
	 }*/

	$scope.copyrightYear = "2015";
	var thisYear = new Date().getFullYear();
	$scope.copyrightYear = 2015 + " - " + thisYear;

}]);

app.directive('topMenu', function () {
	return {
		restrict: 'E',
		templateUrl: 'app/templates/topMenu.html'
	}
});

app.filter('toTrustedHtml', ['$sce', function ($sce) {
	return function (text) {
		return $sce.trustAsHtml(text);
	};
}]);

app.filter('trustAsResourceUrl', ['$sce', function ($sce) {
	return function (val) {
		return $sce.trustAsResourceUrl(val);
	};
}]);

app.service('loadFileContent', ['$http', '$timeout', '$compile', function ($http, $timeout, $compile) {
	return function (context, path, elId) {
		var att = "jsCode_" + elId;
		$http.get(path).success(function (data) {
			context[att] = data.trim();
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="javascript">' + context[att] + '</code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function () {
				renderCodeSnippets(att);
			}, 1000);

		}).error(function () {
			console.log('Error Loading JS Snippet.');
		});
	}
}]);

app.service('loadJsonFileContent', ['$http', '$timeout', '$compile', function ($http, $timeout, $compile) {
	return function (context, path, elId) {
		var att = "jsonCode_" + elId;
		$http.get(path).success(function (data) {
			context[att] = data;
			context[att] = JSON.stringify(context[att], null, "\t");
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="json">' + context[att] + '</code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function () {
				renderCodeSnippets(att);
			}, 1000);

		}).error(function () {
			console.log('Error Loading JSON Snippet: ' + path);
		});
	}
}]);

app.service('loadHTMLContent', ['$http', '$timeout', '$compile', '$sce', function ($http, $timeout, $compile, $sce) {

	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	return function (context, path, elId) {
		var att = "htmlCode_" + elId;
		$http.get(path).success(function (data) {
			context[att] = $sce.trustAsHtml(htmlEntities(data));
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="html" ng-bind-html="' + att + '"></code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function () {
				renderCodeSnippets(att);
			}, 100);

		}).error(function () {
			console.log('Error Loading HTML Snippet.');
		});
	}
}]);

app.service('loadBASHContent', ['$http', '$timeout', '$compile', '$sce', function ($http, $timeout, $compile, $sce) {

	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	return function (context, path, elId) {
		var att = "htmlCode_" + elId;
		$http.get(path).success(function (data) {
			context[att] = $sce.trustAsHtml(htmlEntities(data));
			var htmlData = '<pre id="' + att + '"><code class="bash" ng-bind-html="' + att + '"></code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function () {
				renderCodeSnippets(att);
			}, 100);

		}).error(function () {
			console.log('Error Loading HTML Snippet.');
		});
	}
}]);

function setCodeSnipet(context, snippet) {
	context.htmlCode = snippet;
}

var preBasket = [];
function renderCodeSnippets(preId) {
	hljs.configure({"tabReplace": "    "});
	if (!preId) {
		setTimeout(function () {
			jQuery('pre code').each(function (i, block) {
				var parentId = jQuery(block).parent().attr('id');
				if (preBasket.indexOf(parentId) === -1) {
					hljs.highlightBlock(block);
				}
			});
		}, 200);
	}
	else {
		preBasket.push(preId);
		jQuery('pre#' + preId + ' code').each(function (i, block) {
			hljs.highlightBlock(block);
		});
	}
}

function collapseExpand(el) {
	var codeEl = jQuery(el).parent().parent().children('code');

	if (jQuery(el).html() == "[ - ]") {
		codeEl.slideUp();
		jQuery(el).parent().css("background-color", "#f0f0f0");
		jQuery(el).html("[ + ]");
	}
	else {
		codeEl.slideDown();
		jQuery(el).parent().css("background-color", "#ffffff");
		jQuery(el).html("[ - ]");
	}
	return false;
}