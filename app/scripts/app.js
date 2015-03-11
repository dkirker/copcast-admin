'use strict';

/**
 * @ngdoc overview
 * @name copcastAdminApp
 * @description
 * # copcastAdminApp
 *
 * Main module of the application.
 */
angular
  .module('copcastAdminApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.map',
    'ui.bootstrap',
    'http-auth-interceptor',
    'ngCookies'
  ])
  .constant('ServerUrl', 'http://mogi-api.igarape.org')

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/realtime.html',
        controller: 'RealtimeCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, loginService, socket) {

    $rootScope.$on("event:auth-loginRequired", function(data) {
      loginService.show();
    });

    if ( !loginService.isAuthenticated() ) {
      loginService.show();
    } else {
      socket.connect(loginService.getToken());
    }
  });
