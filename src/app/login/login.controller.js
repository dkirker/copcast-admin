'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')

  .controller('LoginCtrl', function ($scope, $uibModalInstance, $http, loginService, ServerUrl, gettext, userService, gettextCatalog, TranslateService) {

    $scope.user = {username: null, password: null};
    $scope.email = '';
    $scope.selected = 'login';

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
      },{ignoreAuthModule: true}).success(function(data) {
        loginService.setToken(data.userName, data.role, data.token);
        $uibModalInstance.close();

        //get user information
        userService.getMyData().then(
          function(data)
        {
          gettextCatalog.setCurrentLanguage(data.language);
          //change the flag
          TranslateService.setLanguage();


        });

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
  }).run(['$rootScope', '$location', '$cookies', '$http', 'socket',
    function ($rootScope, $location, $cookies, $http, socket) {
      $rootScope.globals = $cookies.getObject('globals');
      if ($rootScope.globals && $rootScope.globals.currentUser  ) {
        $http.defaults.headers.common.Authorization = 'Bearer ' + $rootScope.globals.currentUser.token;
        socket.connect($rootScope.globals.currentUser.token);
      }
    }])
  .directive('stopEvent', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.on(attr.stopEvent, function (e) {
          e.stopPropagation();
        });
      }
    };
  });
