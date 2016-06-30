'use strict';

/**
 * @ngdoc loginService
 * @name copcastAdminApp.socket
 * @description
 * # loginService
 * Factory in the copcastAdminApp.
 */
var app = angular.module('copcastAdminApp');
app.service('loginService', function($rootScope, $window, $cookies,gettextCatalog, TranslateService, $uibModal, $http, authService, socket, ServerUrl) {

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
    if (loginService.getUser() == null){
      return null;
    }
    return loginService.getUser().token;
  };

  loginService.getUser = function() {
    if (!$rootScope.globals && !$cookies.getObject('globals')){
      return null;
    }
    if (!$rootScope.globals){
      $rootScope.globals = $cookies.getObject('globals');
    }
    if ($rootScope.globals && $rootScope.globals.currentUser && $rootScope.globals.currentUser.language &&
      gettextCatalog.getCurrentLanguage() != $rootScope.globals.currentUser.language) {
      //change the flag
      gettextCatalog.setCurrentLanguage($rootScope.globals.currentUser.language);
      TranslateService.setLanguage();
    }
    return $rootScope.globals.currentUser;
  };

  loginService.setToken = function(user) {
    $rootScope.globals = {
      currentUser: {
        username: user.userName,
        role: user.role,
        userId: user.userId,
        token: user.token,
        language: user.language,
        hideHistoryAlert: false
      }
    };

    $cookies.putObject('globals', $rootScope.globals);

    authService.loginConfirmed();
    socket.connect(user.token);
    loginService.isOpen = false;
  };

  loginService.isAuthenticated = function() {
    return loginService.getToken() && loginService.getToken().length > 0;
  };

  loginService.getUserName = function(){
    return $rootScope.globals ? $rootScope.globals.currentUser.username : '';
  };
  
  loginService.logout = function(){
    delete $rootScope["globals"];
    $cookies.remove('globals');

    if (socket) {
      socket.disconnect();
    }
    loginService.isOpen = true;
    $window.location.reload(false);
  };

  return loginService;
});
