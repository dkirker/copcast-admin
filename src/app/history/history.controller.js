;(function(angular) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.controller('HistoryCtrl', function ($scope, userService) {

    initialize();

    $scope.userChanged = function userChanged(selectedUser) {
      loadUser(selectedUser);
    };

    function initialize() {
      loadUsers();
      $scope.user = {};
      $scope.map = {};
    }

    function loadUsers() {
      return userService
        .listUsers()
        .then(function(users) {
          $scope.users = users;
        })
        .catch(function(data, status) {
          console.log('error', data, status);
        });
    }

    function loadUser(user) {
      userService
        .getUser(user.id)
        .then(updateUser)
        .catch(function(data, status) {
          console.log('error', data, status);
        });
    }

    function updateUser(user) {
      $scope.user.active = user;
      $scope.map.position = {
        lat: user.lastLat,
        lng: user.lastLng
      };
    }
  });

})(window.angular);
