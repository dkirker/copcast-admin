;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.controller('HistoryCtrl', function ($scope, $q, userService) {

    initialize();

    function initialize() {
      $scope.user = {};
      $scope.map = {};
      $scope.filter = {};
      loadUsers();
      /*
      userService
        .getUserLocations(1, '2015-04-01', '2015-05-31')
        .then(function(locations) {
          console.log('locations', locations);
        });
      */
    }

    function loadUsers() {
      return userService
        .listUsers()
        .then(updateUsers, error);
    }

    function updateUsers(users) {
      $scope.users = users;
    }

    $scope.userChanged = function userChanged(selectedUser) {
      clearFilter();
      userService
        .getUser(selectedUser.id)
        .then(updateUser, error);
    };

    function updateUser(user) {
      $scope.user.active = user;
      $scope.filter = {};
      $scope.map.location = {
        lat: user.lastLat,
        lng: user.lastLng
      };
    }

    $scope.$watchCollection('filter', function() {
      var filter = $scope.filter;
      if($scope.user && filter.fromDate) {
        loadLocations();
      } else {
        clearLocation();
      }
    });

    function clearFilter() {
      $scope.filter = {};
    }

    function loadLocations() {
      var user = $scope.user.active;
      return userService
        .getUserLocations(user.id, $scope.filter.fromDate, $scope.filter.toDate)
        .then(function(locations) {
          updateLocations(locations);
          updateMarkers();
        }, error);
    }

    function clearLocation() {
      updateLocations([]);
    }

    function updateLocations(locations) {
      console.log('updateLocations', locations);
      $scope.user.locations = locations;
    }

    function updateMarkers() {
      var user = $scope.user;
      $scope.map.markers = [{
        location: user.locations[0],
        icon: user.active.profilePicture
      }];
    }

    function error(error) {
      console.log('error', error);
    }
  });

})(window.angular, window.moment);
