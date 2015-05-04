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

      .when('/group-list', {
        templateUrl: 'views/groups/group-list.html',
        controller: 'GroupsListCtrl'
      })
      .when('/group-detail/:id', {
        templateUrl: 'views/groups/group-detail.html',
        controller: 'GroupsDetailsCtrl'
      })
      .when('/group-creation', {
        templateUrl: 'views/groups/group-creation.html',
        controller: 'GroupsCreationCtrl'
      })
      .when('/group-destroy/:id', {
        templateUrl: 'views/groups/group-destroy.html',
        controller: 'GroupsDestroyCtrl'
      })
      .when('/user-list', {
        templateUrl: 'views/users/user-list.html',
        controller: 'UsersListCtrl'
      })
      .when('/user-detail/:id', {
        templateUrl: 'views/users/user-detail.html',
        controller: 'UsersDetailsCtrl'
      })
      .when('/user-creation', {
        templateUrl: 'views/users/user-creation.html',
        controller: 'UsersCreationCtrl'
      })
      .when('/user-destroy/:id', {
        templateUrl: 'views/users/user-destroy.html',
        controller: 'UsersDestroyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, $location, loginService, socket) {

    $rootScope.$on("event:auth-loginRequired", function(data) {
      loginService.show();
    });

    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  });

//insert the constant value ServerUrl
//angular.module('copcastAdminApp').constant('ServerUrl', 'http://mogi-api.igarape.org');
angular.module('copcastAdminApp').constant('ServerUrl', 'http://localhost:3000');
