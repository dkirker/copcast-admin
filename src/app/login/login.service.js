'use strict';

/**
 * @ngdoc loginService
 * @name copcastAdminApp.socket
 * @description
 * # loginService
 * Factory in the copcastAdminApp.
 */
var app = angular.module('copcastAdminApp');
app.service('loginService', function($rootScope, $cookies, $uibModal, $http, authService, socket, ServerUrl) {

  var loginService = { isOpen: false};

  loginService.show = function() {
    if (!loginService.isOpen) {
      $uibModal.open({
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

  loginService.setToken = function(userName, role, accessToken) {
    $rootScope.globals = {
      currentUser: {
        username: userName,
        role: role,
        token: accessToken
      }
    };

    // hack to let the browser parse the ServerUrl.
    var apiserver = document.createElement('a');
    apiserver.href = ServerUrl;

    if (apiserver.hostname != window.location.hostname) {
      var common_domain = [];
      var adminTokens = window.location.hostname.split('.');
      var apiTokens = apiserver.hostname.split('.');
      adminTokens.reverse();
      apiTokens.reverse();
      console.log(adminTokens);
      console.log(apiTokens);
      for(var i=0; apiTokens[i]==adminTokens[i]; i++)
        common_domain.push(apiTokens[i]);

      common_domain.reverse();
      var cookie_dom = '.'+common_domain.join('.');
      console.log('Cookie domain: '+cookie_dom);
      $cookies.putObject('globals', $rootScope.globals, {domain: cookie_dom});
    } else {
        console.log('cookies not mangled');
        $cookies.putObject('globals', $rootScope.globals);
    }
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
