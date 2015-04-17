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
    'angular-jwplayer' ,
    'toaster',
    'angularFileUpload'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/realtime.html',
        controller: 'RealtimeCtrl',
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/logout', {
        controller: 'LogoutCtrl',
        template: ""
      })
      .when('/history', {
        templateUrl: 'views/history.html',
        controller: 'HistoryCtrl'
      })
      .when('/user-list', {
        templateUrl: 'views/users/user-list.html',
        controller: 'UserListCtrl'
      })
      .when('/user-detail/:id', {
        templateUrl: 'views/users/user-detail.html',
        controller: 'UserDetailCtrl'
      })
      .when('/user-creation', {
        templateUrl: 'views/users/user-creation.html',
        controller: 'UserCreationCtrl'
      })
      .when('/user-destroy/:id', {
        templateUrl: 'views/users/user-destroy.html',
        controller: 'UserDestroyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, loginService, socket) {

    $rootScope.$on("event:auth-loginRequired", function(data) {
      loginService.show();
    });

  });

//insert the constant value ServerUrl
//angular.module('copcastAdminApp').constant('ServerUrl', 'http://mogi-api.igarape.org');
angular.module('copcastAdminApp').constant('ServerUrl', 'http://localhost:3000');
