;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  app.controller('HistoryCtrl', function ($scope, $q, userService) {

    initialize();

    $scope.userChanged = function userChanged(selectedUser) {
      userService
        .getUser(selectedUser.id)
        .then(updateUser, error);
    };

    $scope.$watchCollection('filter', function() {
      var filter = $scope.filter;
      var hasAtiveUser = $scope.user && $scope.user.active;
      if(hasAtiveUser && filter.fromDate) {
        loadLocations();
      } else {
        clearLocation();
      }
    });

    $scope.$watchCollection('selectedEvent', function() {
      if($scope.selectedEvent) {
        var event = $scope.selectedEvent;
        $scope.user.selectedLocation = event.locations[0];
        updateMarkers();
        loadUserVideos(event.date);
      }
    });

    function loadUserVideos(date) {
      if($scope.user.active) {
        var userId = $scope.user.active.id;
        userService
          .getUserVideos(userId, date)
          . then(function(videos) {
            console.log('videos', videos);
          }, error);

      } else {
        $scope.video.options = options;
      }
    }

    function initialize() {
      $scope.user = {};
      $scope.map = {};
      $scope.filter = {};
      loadUsers();
    }

    function loadUsers() {
      return userService
        .listUsers()
        .then(updateUsers, error);
    }

    function updateUsers(users) {
      $scope.users = users;
    }


    function updateUser(user) {
      $scope.user.active = user;
      $scope.map.location = {
        lat: user.lastLat,
        lng: user.lastLng
      };
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
      $scope.user.locations = locations;
      var hasLocations = locations && locations.length > 0;
      $scope.user.selectedLocation = hasLocations ? locations[0] : undefined;
    }

    function updateMarkers() {
      var user = $scope.user;
      var hasActiveUser = user && user.active;
      var markers = [];
      if(hasActiveUser) {
        markers.push({
          location: user.selectedLocation,
          icon: user.active.profilePicture
        });
      }
      $scope.map.markers = markers;
    }

    function error(error) {
      console.log('error', error);
    }
  });

})(window.angular, window.moment);
