'use strict';

/**
 * @ngdoc loginService
 * @name copcastAdminApp.socket
 * @description
 * # loginService
 * Factory in the copcastAdminApp.
 */
var app = angular.module('copcastAdminApp');
app.service('loginService', function($rootScope, $window, $cookies, $uibModal, $http, authService, socket, ServerUrl) {

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
    if (!$rootScope.globals && !$cookies.getObject('globals')){
      return null;
    }
    if (!$rootScope.globals){
      $rootScope.globals = $cookies.getObject('globals');
    }
    return $rootScope.globals.currentUser.token;
  };

  loginService.setToken = function(userName, role, accessToken, userId) {
    $rootScope.globals = {
      currentUser: {
        username: userName,
        role: role,
        token: accessToken,
        userId: userId,
        hideHistoryAlert: false
      }
    };

    // hack to let the browser parse the ServerUrl.
    var apiserver = $window.document.createElement('a');
    apiserver.href = ServerUrl;

    if (apiserver.hostname !== $window.location.hostname) {
      var commonDomain = [];
      var adminTokens = $window.location.hostname.split('.');
      var apiTokens = apiserver.hostname.split('.');
      adminTokens.reverse();
      apiTokens.reverse();

      $window.console.log(adminTokens);
      $window.console.log(apiTokens);

      for(var i=0; apiTokens[i] === adminTokens[i]; i++) {
        commonDomain.push(apiTokens[i]);
      }

      commonDomain.reverse();
      var cookieDom = '.'+commonDomain.join('.');
      $window.console.log('Cookie domain: '+cookieDom);
      $rootScope.cookieDomain = cookieDom;
      $cookies.putObject('globals', $rootScope.globals, {domain: cookieDom});
    } else {
      $window.console.log('cookies not mangled');
      $rootScope.cookieDomain = null;
      $cookies.putObject('globals', $rootScope.globals);
    }

    authService.loginConfirmed();
    socket.connect(accessToken);
    loginService.isOpen = false;
  };

  loginService.isAuthenticated = function() {
    return loginService.getToken() !== null && loginService.getToken().length > 0;
  };

  loginService.getUserName = function(){
    return $rootScope.globals ? $rootScope.globals.currentUser.username : '';
  };

  loginService.logout = function(){
    $rootScope.globals = null;

    try {
      $cookies.remove('globals', {domain: $rootScope.cookieDomain});
    } catch (err) {
      $cookies.remove('globals');
    }

    socket.disconnect();
    loginService.isOpen = true;
    $window.location.reload(false);
    // loginService.show();
  };

  return loginService;
});
