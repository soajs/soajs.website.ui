'use strict';
var app = angular.module('mainWebsite', ['ui.bootstrap', 'ngRoute', 'ngSanitize']);

app.config([
	'$routeProvider',
	'$controllerProvider',
	'$compileProvider',
	'$filterProvider',
	'$provide',
	'$sceDelegateProvider',
	function($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $sceDelegateProvider) {

		app.compileProvider = $compileProvider;
		navigation.forEach(function(navigationEntry) {
			if(navigationEntry.scripts && navigationEntry.scripts.length > 0) {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath,
					resolve: {
						load: ['$q', '$rootScope', function($q, $rootScope) {
							var deferred = $q.defer();
							require(navigationEntry.scripts, function() {
								$rootScope.$apply(function() {
									deferred.resolve();
								});
							});
							return deferred.promise;
						}]
					}
				});
			}
			else {
				$routeProvider.when(navigationEntry.url.replace('#', ''), {
					templateUrl: navigationEntry.tplPath
				});
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

app.controller('mainCtrl', ['$scope', '$location', '$routeParams', '$anchorScroll', '$timeout', '$compile', '$route', function($scope, $location, $routeParams, $anchorScroll, $timeout, $compile, $route) {

	$scope.today = new Date().getTime();

	$scope.goToAnchor = function(section, anchor) {
		$location.path("/" + section + "/" + anchor);
	};

	$scope.$on('$routeChangeSuccess', function() {
		$scope.scrollToAnchor = function() {
			if($routeParams && $routeParams.anchor) {
				$timeout(function() {
					$location.hash($routeParams.anchor);
					var padEl = angular.element(document.getElementById($routeParams.anchor));
					padEl.html("<br/> <br/> <br/>");
					$compile(padEl.contents())($scope);
					$anchorScroll();
				}, 100, false);
			}
		};
		$scope.scrollToAnchor();
		// TODO make generic
		$scope.currentLocation = '#/' + $location.path().split("/")[1];
	});

}]);

app.directive('topMenu', function() {
	return {
		restrict: 'E',
		templateUrl: 'app/templates/topMenu.html'
	}
});

app.filter('toTrustedHtml', ['$sce', function($sce) {
	return function(text) {
		return $sce.trustAsHtml(text);
	};
}]);

app.service('loadFileContent', ['$http', '$timeout', '$compile', function($http, $timeout, $compile) {
	return function(context, path, elId) {
		var att = "jsCode_" + elId;
		$http.get(path).success(function(data) {
			context[att] = data.trim();
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="javascript">' + context[att] + '</code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function() {
				renderCodeSnippets(att);
			}, 1000);

		}).error(function() {
			console.log('Error Loading JS Snippet.');
		});
	}
}]);

app.service('loadJsonFileContent', ['$http', '$timeout', '$compile', function($http, $timeout, $compile) {
	return function(context, path, elId) {
		var att = "jsonCode_" + elId;
		$http.get(path).success(function(data) {
			context[att] = data;
			context[att] = JSON.stringify(context[att], null, "\t");
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="json">' + context[att] + '</code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function() {
				renderCodeSnippets(att);
			}, 1000);

		}).error(function() {
			console.log('Error Loading JSON Snippet: ' + path);
		});
	}
}]);

app.service('loadHTMLContent', ['$http', '$timeout', '$compile', '$sce', function($http, $timeout, $compile, $sce) {

	function htmlEntities(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	return function(context, path, elId) {
		var att = "htmlCode_" + elId;
		$http.get(path).success(function(data) {
			context[att] = $sce.trustAsHtml(htmlEntities(data));
			var htmlData = '<pre id="' + att + '"><div style="text-align:right;"><a href="" onclick="collapseExpand(this);">[ - ]</a></div><code class="html" ng-bind-html="' + att + '"></code></pre>';
			var el = angular.element(document.getElementById(elId));
			el.html(htmlData);
			$compile(el.contents())(context);

			$timeout(function() {
				renderCodeSnippets(att);
			}, 100);

		}).error(function() {
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
	if(!preId) {
		setTimeout(function() {
			jQuery('pre code').each(function(i, block) {
				var parentId = jQuery(block).parent().attr('id');
				if(preBasket.indexOf(parentId) === -1) {
					hljs.highlightBlock(block);
				}
			});
		}, 200);
	}
	else {
		preBasket.push(preId);
		jQuery('pre#' + preId + ' code').each(function(i, block) {
			hljs.highlightBlock(block);
		});
	}
}

function collapseExpand(el) {
	var codeEl = jQuery(el).parent().parent().children('code');

	if(jQuery(el).html() == "[ - ]") {
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