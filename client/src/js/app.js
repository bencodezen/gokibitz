var bulk = require('bulk-require');
var angular = require('angular');

// WGo
require('./lib/wgo/src/wgo.js');
require('./lib/wgo/src/kifu.js');
require('./lib/wgo/src/sgfparser.js');
require('./lib/wgo/src/player.js');
require('./lib/wgo/src/basicplayer.js');
require('./lib/wgo/src/basicplayer.component.js');
require('./lib/wgo/src/basicplayer.infobox.js');
require('./lib/wgo/src/basicplayer.commentbox.js');
require('./lib/wgo/src/basicplayer.control.js');
require('./lib/wgo/src/player.editable.js');
require('./lib/wgo/src/scoremode.js');
require('./lib/wgo/src/player.permalink.js');

var gokibitz = angular.module('gokibitz', [
	'gokibitz.controllers',
	'gokibitz.directives',
	'gokibitz.services',
	'gokibitz.filters',
	'ui.router',
	'ui.bootstrap',
	'ui.bootstrap.tpls',
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ngAnimate',
	'ngTouch',
	'http-auth-interceptor',
	'angularFileUpload',
	'ui.utils',
	'ngStorage',
	'720kb.socialshare'
]);

require('angular-ui-router');
require('angular-animate');
require('angular-route');
require('angular-file-upload');
require('angular-cookies');
require('angular-resource');
require('angular-sanitize');
require('angular-touch');
require('http-auth-interceptor');
require('ui-bootstrap-tpls');
require('ui-bootstrap');
require('ui-utils');
require('ngStorage');

// Third-party share button directive
// @see https://github.com/720kb/angular-socialshare
require('./lib/angular-socialshare.js');

angular.module('gokibitz.controllers', []);
angular.module('gokibitz.directives', []);
angular.module('gokibitz.services', []);
angular.module('gokibitz.filters', []);
bulk(__dirname, [
	'./controllers/**/*.js',
	'./directives/**/*.js',
	'./services/**/*.js',
	'./filters/**/*.js'
]);

gokibitz.config([
	'$routeProvider',
	'$locationProvider',
	function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '/partials/index',
				controller: 'IndexController',
				resolve: {
					//  Just for old-times sake: we're no longer using a kifu on the homepage
					//kifu: function ($http) {
					//	return $http.get('/api/kifu', {
					//		params: {
					//			limit: 1
					//		}
					//	});
					//}
				}
			})
			//.when('/login', {
				//templateUrl: '/partials/login',
				//controller: 'LoginController'
			//})
			//.when('/signup', {
				//templateUrl: '/partials/signup',
				//controller: 'SignupController'
			//})
			.when('/profile', {
				templateUrl: '/partials/profile',
				controller: 'ProfileController'
			})
			.when('/admin', {
				templateUrl: '/partials/admin',
				controller: 'AdminController'
			})
			.when('/upload', {
				templateUrl: '/partials/upload',
				controller: 'UploadController'
			})
			.when('/kifu', {
				templateUrl: '/partials/list-kifu',
				controller: 'ListKifuController'
			})
			.when('/kifu/:shortid', {
				templateUrl: '/partials/kifu',
				controller: 'KifuController',
				reloadOnSearch: false
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	}
]);

//gokibitz.config([
	//'$httpProvider',
	//function ($httpProvider) {
		//$httpProvider.interceptors.push([
			//'$injector',
			//function ($injector) {
				//return $injector.get('AuthInterceptor');
			//}
		//]);
	//}
//]);

gokibitz.run([
	'$rootScope',
	'$location',
	'Auth',
	function ($rootScope, $location, Auth) {

		//console.log('resizing from run');
		//resize();

		//watching the value of the currentUser variable.
		$rootScope.$watch('currentUser', function(currentUser) {
			// if no currentUser and on a page that requires authorization then try to update it
			// will trigger 401s if user does not have a valid session
			//console.log('$location.path()', $location.path());
			var path = $location.path().split('/');
			path = '/' +  path[1];
			console.log('path', path);
			if (
				!currentUser &&
				!~['/', '/login', '/logout', '/signup', '/kifu'].indexOf(path)
			) {
				console.log('redirect to auth!');
				Auth.currentUser();
			}
		});

		// On catching 401 errors, redirect to the login page.
		$rootScope.$on('event:auth-loginRequired', function () {
			$location.path('/');
			return false;
		});
	}
]);
