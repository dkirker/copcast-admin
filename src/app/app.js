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
    'gettext',
    'angularUtils.directives.dirPagination'
  ])
  .config(function ($routeProvider, $cookiesProvider, $windowProvider, ServerUrl) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/realtime/realtime.html',
        controller: 'RealtimeCtrl'
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
        templateUrl: 'app/groups/group-list.html',
        controller: 'GroupsListCtrl'
      })
      .when('/group-detail/:id', {
        templateUrl: 'app/groups/group-detail.html',
        controller: 'GroupsDetailsCtrl'
      })
      .when('/group-creation', {
        templateUrl: 'app/groups/group-creation.html',
        controller: 'GroupsCreationCtrl'
      })
      .when('/group-destroy/:id', {
        templateUrl: 'app/groups/group-destroy.html',
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
      .when('/log-report-list', {
        templateUrl: 'app/logreport/logreport-list.html',
        controller: 'LogReportListCtrl'
      })
      .when('/log-report-view/:id', {
        templateUrl: 'app/logreport/logreport-view.html',
        controller: 'LogReportViewCtrl'
      })
      .when('/report', {
        templateUrl: 'app/report/report.html',
        controller: 'ReportCtrl'
      })
      .when('/incidentForm-list', {
        templateUrl: 'app/incidentForms/incidentForm-list.html',
        controller: 'IncidentsListCtrl'
      })
      .when('/incidentForm-view/:id', {
        templateUrl: 'app/incidentForms/incidentForm-view.html',
        controller: 'IncidentsViewCtrl'
      })
      .when('/reset-password/:token', {
        templateUrl: 'app/resetPasswords/reset.html',
        controller: 'ResetPasswordCtrl'
      })
      .when('/exports', {
        templateUrl: 'app/exports/list.html',
        controller: 'ExportsListCtrl'
      })
      .when('/exports/creation', {
        templateUrl: 'app/exports/creation.html',
        controller: 'ExportsCreationCtrl'
      })
      .when('/exports/:id', {
        templateUrl: 'app/exports/detail.html',
        controller: 'ExportsDetailCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    var $window = $windowProvider.$get();
    var apiserver = $window.document.createElement('a');
    apiserver.href = ServerUrl;
    if (apiserver.hostname === $window.location.hostname) {
      return null;
    }
    var commonDomain = [];
    var adminTokens = $window.location.hostname.split('.');
    var apiTokens = apiserver.hostname.split('.');
    adminTokens.reverse();
    apiTokens.reverse();

    for(var i=0; apiTokens[i] === adminTokens[i]; i++) {
      commonDomain.push(apiTokens[i]);
    }

    commonDomain.reverse();

    $cookiesProvider.defaults.domain = '.'+commonDomain.join('.');
    $window.console.log("domain: "+$cookiesProvider.defaults.domain);

  }).run(function($rootScope, $location, loginService ) {
    $rootScope.$on('event:auth-loginRequired', function() {
      loginService.show();
    });

    $rootScope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $rootScope.isAuthenticated = function () {
      return loginService.isAuthenticated();
    };
  });
