'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('LoginCtrl', ["$scope", "$window", "$http", function ($scope, $window, $http) {
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
        })
        .error(function (data, status, headers, config) {
          // Erase the token if the user fails to log in
          delete $window.sessionStorage.token;
          $scope.isLogged = false;
          // Handle login errors here
          $scope.message = 'Error: Invalid user or password';
        });
    };

  }]);
