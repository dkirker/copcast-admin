'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')

  .controller('LoginCtrl', function ($scope, $modalInstance, $http, loginService, ServerUrl, gettext) {

    $scope.user = {username: '', password: ''};
    $scope.email = '';
    $scope.selected = 'login';
    $scope.$on("401_error", function(event, mass) {
      $scope.errorMessage = gettext('The email and password you entered don\'t match.');
    });

    $scope.forgotPass = function(){
      $scope.selected = 'forgotPass';
      $scope.errorMessage = '';
      $scope.emailMessage = '';
    };

    $scope.sendEmail = function(){
      $scope.errorMessage = '';
      $scope.emailMessage = '';
      if(!$scope.email || $scope.email === ''){
        $scope.errorMessage = gettext('Type an valid email address');
        return;
      }
      $scope.emailMessage = gettext('Trying to send email...');
      $http.post(ServerUrl + '/users/'+$scope.email+'/reset_password', {
        email:$scope.email
      }).success(function(data) {
        $scope.emailMessage = gettext('Email sent successfully');
        $scope.selected = 'login';
        $scope.email='';
      }).error(function (data){
        $scope.emailMessage = '';
        $scope.errorMessage = data;
        $scope.email='';
      });
    };

    $scope.login = function() {
      $http.post(ServerUrl + '/token', {
        username : $scope.user.username,
        password : $scope.user.password,
        scope : 'admin'
      }).success(function(token) {
        loginService.setToken($scope.user.username, token.token);
        $modalInstance.close();
      }).error(function (data, status, headers, config) {
        $scope.errorMessage = gettext('The email and password you entered don\'t match.');
        $scope.emailMessage = '';
      });
    };

  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push(['$injector', function($injector) {
      return {
        request : function(config) {

          var loginService = $injector.get('loginService');
          var serverUrl = $injector.get('ServerUrl');
          if ( config.url.indexOf(serverUrl) > -1  && loginService.getToken() ) {
            config.headers.Authorization = 'Bearer ' + loginService.getToken();
          }
          return config;
        }
      };
    }]);
  }).run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
      $rootScope.globals = $cookieStore.get('globals');
      if ($rootScope.globals && $rootScope.globals.currentUser  ) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.globals.currentUser.token;
      }
    }]);
