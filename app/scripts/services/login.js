'use strict';

/**
 * @ngdoc loginService
 * @name copcastAdminApp.socket
 * @description
 * # loginService
 * Factory in the copcastAdminApp.
 */
angular.module('copcastAdminApp')
.service('loginService',function($rootScope, $cookieStore, $modal, $http, authService, socket) {

  var loginService = {},
    modal = null;

  loginService.show = function() {
    if ( !modal ) {
      modal = $modal.open({
        templateUrl : 'views/login.html',
        controller : 'LoginCtrl',
        backdrop : 'static'
      });
    }
  };

  loginService.getToken = function() {
    if ($rootScope.globals == null && !$cookieStore.get('globals')){
      return null;
    }
    if ($rootScope.globals == null){
      $rootScope.globals = $cookieStore.get('globals');
    }
    return $rootScope.globals.currentUser.token;
  };

  loginService.setToken = function(userName, accessToken) {
    $rootScope.globals = {
      currentUser: {
        username: userName,
        token: accessToken
      }
    };
    $cookieStore.put('globals', $rootScope.globals);
    authService.loginConfirmed();
    socket.connect($rootScope.globals.currentUser.token);
    console.log("socket connected");
  };

  loginService.isAuthenticated = function() {
    return loginService.getToken() != null && loginService.getToken().length > 0;
  };

  return loginService;
});
