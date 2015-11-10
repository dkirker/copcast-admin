'use strict';

/**
 * @ngdoc loginService
 * @name copcastAdminApp.socket
 * @description
 * # loginService
 * Factory in the copcastAdminApp.
 */
var app = angular.module('copcastAdminApp');
app.service('loginService',function($rootScope, $cookies, $modal, $http, authService, socket) {

  var loginService = { isOpen: false};


  loginService.show = function() {
    if (!loginService.isOpen) {
      $modal.open({
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl',
        backdrop: 'static',
        windowClass: 'modal-login',
        keyboard: false
      });
      loginService.isOpen = true;
    }
  };

  loginService.getToken = function() {
    if ($rootScope.globals == null && !$cookies.getObject('globals')){
      return null;
    }
    if ($rootScope.globals == null){
      $rootScope.globals = $cookies.getObject('globals');
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
    //TODO removed for it was breaking the socket load
    $cookies.putObject('globals', $rootScope.globals);
    authService.loginConfirmed();
    socket.connect(accessToken);
    loginService.isOpen = false;
  };

  loginService.isAuthenticated = function() {
    return loginService.getToken() != null && loginService.getToken().length > 0;
  };

  loginService.getUserName = function(){
    return $rootScope.globals ? $rootScope.globals.currentUser.username : '';
  };

  loginService.logout = function(){
    $rootScope.globals = null;
    $cookies.remove('globals');
    loginService.show();
  };


  return loginService;
});
