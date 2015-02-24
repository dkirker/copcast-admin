'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LoginCtrl', ["$scope", "$window", "$http", "$location", function ($scope, $window, $http, $location) {
    $scope.user = {username: 'john.doe',
      password: 'foobar',
      scope: ''
    };
    $scope.message = '';
    $scope.isLogged = $window.sessionStorage.token != null;
    $scope.user.scope = 'admin';
    $scope.submit = function () {
      $http
        .post('http://localhost:3000/token', $scope.user)
        .success(function (data, status, headers, config) {
          $window.sessionStorage.token = data.token;
          $scope.isLogged = true;
          $scope.message = 'Welcome';
          $scope.userName = data.userName;
        })
        .error(function (data, status, headers, config) {
          // Erase the token if the user fails to log in
          delete $window.sessionStorage.token;
          $scope.isLogged = false;
          // Handle login errors here
          $scope.message = 'Error: Invalid user or password';
        });
    };

    $scope.logout = function(){
      $window.sessionStorage.token = null;
      $scope.isLogged = false;
      $scope.message = '';
      $scope.userName = null;
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    }

  }]);
