;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.controller('HistoryCtrl', function ($scope, userService) {

    loadUsers();

    $scope.userChanged = function userChanged(user) {
      console.log('user: ', user);
    };

    function loadUsers() {
      userService
        .listUsers()
        .then(function(users) {
          $scope.users = users;
        })
        .catch(function(data, status) {
          console.log('error', data, status);
        });
    }
  });

})(window.angular);
