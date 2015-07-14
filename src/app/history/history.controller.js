;(function(angular, moment) {
  'use strict';

  var app = angular.module('copcastAdminApp');

  var DEFAULT_ACCURACY = 10;

  app.controller('HistoryCtrl', function ($scope, $q, userService, groupService) {

    var indexedUsers = {};

    /*
     * Watchers
    */
    $scope.$watchCollection('filter', function() {
      loadCurrentGroupLocationsAndVideos();
    });

    $scope.$watch('currentGroup', function() {
      loadCurrentGroupLocationsAndVideos();
    }, true);

    $scope.$watch('currentUser', function() {
      updateCurrentUserLocations();
    }, true);

    $scope.$watch('currentLocation', function() {
      updateUserMapMarkers();
      updateCurrentVideo();
    }, true);

    $scope.$watch('groupLocations', function() {
      updateCurrentUserLocations();
      updateUserMapMarkers();
    }, true);

    $scope.$watch('userLocations', function() {
      updateUserMapLocations();
    }, true);

    /*
     * Initialize
     */
    initialize();
    function initialize() {
      $scope.filter = {};
      $scope.filter.fromDate = moment('2014-08-01').toDate();
      $scope.filter.toDate = moment('2014-10-30').toDate();
      $scope.filter.period = true;
      loadUsersAndGroups();
    }


    /*
     * Scope functions called by view
     */
    $scope.setCurrentGroup = function setCurrentGroup(userOrGroup) {
      var group = userOrGroup.isGroup ? userOrGroup : createUserGroup(userOrGroup);
      $scope.currentGroup = group;
      console.log('CurrentGroup', $scope.currentGroup);
    };

    $scope.setCurrentUser = function setCurrentUser(user) {
      $scope.currentUser = user;
      console.log('CurrentUser', $scope.currentUser);
    };

    $scope.setCurrentLocation = function setCurrentLocation(location) {
      $scope.currentLocation = location;
      console.log('CurrentLocation', $scope.currentLocation);
    };


    /*
     * Scope update functions
     */
    function updateCurrentUserLocations() {
      var userLocations;
      var user = $scope.currentUser;
      if(user) {
        userLocations = $scope.groupLocations[user.id];
      }
      $scope.userLocations = userLocations || [];
      console.log('UserLocations', $scope.userLocations);
    }

    function updateUserMapMarkers() {
      var date = $scope.currentLocation && $scope.currentLocation.date;
      var userMapMarkers = [];
      var groupLocations = $scope.groupLocations;

      angular.forEach(groupLocations, function(locations, key) {
        var user = indexedUsers[key];
        var location = date
          ? getNearestLocation(locations, date)
          : locations.length > 0 && locations[0];

        if(user && Map.isValidlocation(location)) {
          this.push(Map.createMarker(user, location));
        }
      }, userMapMarkers);
      $scope.userMapMarkers = userMapMarkers;
      console.log('UserMapMarkers', $scope.userMapMarkers);
    }

    function updateCurrentVideo() {
      var currentVideo;
      var userId = $scope.currentUser && $scope.currentUser.id;
      var date = $scope.currentLocation && moment($scope.currentLocation.date);
      var videos = $scope.groupVideos;

      if(userId && date) {
        for(var i = 0, length = videos.length; i < length; i++) {
          var video = videos[i];
          if(video.userId === userId) {
            var fromDate = video.from;
            var toDate = video.to;
            if(date.isSame(fromDate, 'minute') ||
               date.isSame(toDate, 'minute') ||
               date.isBetween(fromDate, toDate, 'minute')) {
              currentVideo = video;
              break;
            }
          }
        }
      }
      $scope.currentVideo = currentVideo;
      console.log('CurrentVideo', $scope.currentVideo);
    }

    function updateUserMapLocations() {
      var user = $scope.currentUser;
      var userLocations = $scope.userLocations;
      var userMapLocations;
      if(user) {
        userMapLocations = $scope.groupMapLocations[user.id];
        if(!userMapLocations) {
          userMapLocations = Map.transformLocationsToLatLngPoints(userLocations);
          $scope.groupMapLocations[user.id] = userMapLocations;
        }
      }
      $scope.userMapLocations = userMapLocations || [];
      console.log('UserMapLocations', $scope.userMapLocations);
    }


    /*
     * Load users and groups
     */
    function loadUsersAndGroups() {
      var promises = [];
      promises.push(userService.listUsers());
      promises.push(groupService.listGroups());

      $q.all(promises)
        .then(
          function updateUsersAndGroups(usersAndGroups) {
            var users = usersAndGroups[0];
            var groups = usersAndGroups[1];
            indexUsers(users);
            $scope.usersAndGroups = groups.concat(users);
          }, error
        );
    }

    function indexUsers(users) {
      for(var i = 0, len = users.length; i < len; i++) {
        var user = users[i];
        indexedUsers[user.id] = user;
      }
    }

    function createUserGroup(user) {
      return {
        id: user.id,
        profilePicture: user.profilePicture,
        name: user.name,
        isUser: true,
        users: [ user ]
      };
    }

    /*
     * Load locations and videos
     */
    function loadCurrentGroupLocationsAndVideos() {
        if(isPreparedToLoadLocations()) {
          var group = $scope.currentGroup;
          group.isUser
            ? loadUserLocationsAndVideos($scope.currentUser)
            : loadGroupLocationsAndVideos(group);
        } else {
          setGroupLocations();
        }
    }

    function isPreparedToLoadLocations() {
      var filter = $scope.filter;
      var group = $scope.currentGroup;
      return group && filter && filter.fromDate && moment(filter.fromDate).isAfter('2010-01-01');
    }

    /*
     * Load user locations and videos
     */
    function loadUserLocationsAndVideos(user) {
      if(!user) {
        return;
      }
      var promisses = [];
      var filter = $scope.filter;
      promisses.push(userService.getUserLocations(user.id, filter.fromDate, filter.toDate, DEFAULT_ACCURACY));
      promisses.push(userService.getUserVideos(user.id, filter.fromDate, filter.toDate));

      $q.all(promisses)
      .then(function(data) {
        var locations = data[0];
        var videos = data[1];
        var groupLocations = {};
        groupLocations[user.id] = locations;
        setGroupLocations(groupLocations);
        setGroupVideos(videos);
      }, error);
    }

    /*
     * Load group locations and videos
     */
    function loadGroupLocationsAndVideos(group) {
      var promisses = [];
      var filter = $scope.filter;
      promisses.push(groupService.getGroupLocations(group.id, filter.fromDate, filter.toDate, DEFAULT_ACCURACY));
      promisses.push(groupService.getGroupVideos(group.id, filter.fromDate, filter.toDate));

      $q.all(promisses)
        .then(function(data) {
          var locationsByUser = data[0];
          var videos = data[1];
          var keys = locationsByUser ? Object.keys(locationsByUser) : [];
          addUsersToGroup(group, keys);
          setGroupLocations(locationsByUser);
          setGroupVideos(videos);
        }, error);
    }

    function addUsersToGroup(group, userKeys) {
      group.users = [];
      if(userKeys && userKeys.length > 0) {
        for(var i = 0, len = userKeys.length; i < len; i++) {
          var key = userKeys[i];
          group.users.push(indexedUsers[key]);
        }
      }
    }

    function setGroupLocations(groupLocations) {
      $scope.groupLocations = groupLocations || {};
      $scope.groupMapLocations = {};
      console.log('GroupLocations', $scope.groupLocations);
    }

    function getNearestLocation(locations, date) {
      var prevLocation;
      var targetDate = moment(date);
      for(var i = 0, length = locations.length; i < length; i++) {
        var location = locations[i];
        var locationDate = moment(location.date);
        if(targetDate.isSame(locationDate, 'minute')) {
          return location;
        }
        if(targetDate.isBefore(locationDate, 'minute')) {
          return prevLocation || locations[0];
        }
        prevLocation = location;
      }
      return locations[locations.length - 1];
    }

    function setGroupVideos(groupVideos) {
      $scope.groupVideos = groupVideos || {};
      console.log('GroupVideos', $scope.groupVideos);
    }
  });

  /*
   * Map util functions
   */
  function Map() {}

  Map.createMarker = function createMarker(user, location) {
    var latLngPoints = Map.transformLocationsToLatLngPoints([ location ]);
    return new google.maps.Marker({
      userId: user.id,
      position: latLngPoints[0],
      icon: {
        url: user.profilePicture,
        scaledSize: new google.maps.Size(32, 32)
      }
    });
  };

  Map.transformLocationsToLatLngPoints = function transformLocationsToLatLngPoints(locations) {
    var latLngPoints = [];
    for(var i = 0, length = locations.length; i < length; i++) {
      var location = locations[i];
      if(Map.isValidlocation(location)) {
        latLngPoints.push(new google.maps.LatLng(location.lat, location.lng));
      }
    }
    return latLngPoints;
  };

  Map.isValidlocation = function isValidlocation(location) {
    return location &&
           location.lat &&
           location.lng;
  };

  function error(error) {
    console.log('error', error);
  }

})(window.angular, window.moment);
