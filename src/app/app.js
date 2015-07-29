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
    'cgNotify',
    'ngFileUpload',
    'gettext'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/realtime.html',
        controller: 'RealtimeCtrl',
      })
      .when('/main', {
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/logout', {
        controller: 'LogoutCtrl',
        template: ''
      })
      .when('/history', {
        templateUrl: 'app/history/history.html',
        controller: 'HistoryCtrl'
      })

      .when('/group-list', {
        templateUrl: 'app/views/groups/group-list.html',
        controller: 'GroupsListCtrl'
      })
      .when('/group-detail/:id', {
        templateUrl: 'app/views/groups/group-detail.html',
        controller: 'GroupsDetailsCtrl'
      })
      .when('/group-creation', {
        templateUrl: 'app/views/groups/group-creation.html',
        controller: 'GroupsCreationCtrl'
      })
      .when('/group-destroy/:id', {
        templateUrl: 'app/views/groups/group-destroy.html',
        controller: 'GroupsDestroyCtrl'
      })
      .when('/user-list', {
        templateUrl: 'app/users/user-list.html',
        controller: 'UsersListCtrl'
      })
      .when('/user-detail/:id', {
        templateUrl: 'app/users/user-detail.html',
        controller: 'UsersDetailsCtrl'
      })
      .when('/user-creation', {
        templateUrl: 'app/users/user-creation.html',
        controller: 'UsersCreationCtrl'
      })
      .when('/user-destroy/:id', {
        templateUrl: 'app/users/user-destroy.html',
        controller: 'UsersDestroyCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }).run(function($rootScope, $location, loginService ) {

    $rootScope.$on('event:auth-loginRequired', function() {
      loginService.show();
    });

    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

  });

//insert the constant value ServerUrl
angular.module('copcastAdminApp').constant('ServerUrl', 'http://mogi-api.igarape.org');
//angular.module('copcastAdminApp').constant('ServerUrl', 'http://localhost:3000');


