'use strict';
/* global google */

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:RealtimeCtrl
 * @description
 * # RealtimeCtrl
 * Controller of the copcastAdminApp
 */

angular.module('copcastAdminApp').
controller('RealtimeCtrl', function($scope, $uibModal, socket, ServerUrl, notify, $window, $timeout, $rootScope, mapService,
                                    userService, $location, HistoryManager, gettextCatalog) {

  $scope.windowHeight = $window.innerHeight;
  $scope.windowWidth = $window.innerWidth;
  $rootScope.selected = 'realtime';
  $scope.streamButtonText = gettextCatalog.getString('Livestream');
  $scope.waitingStreaming = false;
  $scope.searchString = '';
  $scope.alerts = [];
  $scope.$uibModalInstance = null;
  $scope.watchingUserId = -1;
  $scope.isPaused = {};
  $rootScope.isWatching = false;

  $scope.mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_TOP
    },
    panControl: true,
    panControlOptions: {
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    zoomControl: true,
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle.LARGE,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    scaleControl: true,
    streetViewControl: false
  };

  function getFilteredUsers() {
    var activeUserMap = $scope.getCurrentUsers().userDict;
    if (!$scope.searchString) {
      return activeUserMap;
    } else {
      //allows filter by regex
      var filteredUserMap = {};
      for (var id in activeUserMap) {
        var user = activeUserMap[id];
        //TODO add group so we can search for specific groups
        var lUserName = user.userName;
        var lUserLogin = user.login;
        var lGroupName = user.group || '';
        var reMatch = new RegExp($scope.searchString, 'gi');
        if (lUserName.match(reMatch) ||
          lUserLogin.match(reMatch) ||
          lGroupName.match(reMatch)) {
          filteredUserMap[id] = user;
        }
      }
      return filteredUserMap;
    }
  }

  function filterUsers() {
    var allActiveUsers = $scope.getCurrentUsers().userDict;
    var filteredUsers = getFilteredUsers();

    // Only show markers for filteredUsers
    for (var id in allActiveUsers) {
      var user = allActiveUsers[id];
      var map = filteredUsers[id] ? $scope.myMap : null;
      user.marker.setMap(map);
      if (user.cityCircle) {
        user.cityCircle.setMap(map);
      }
    }

    if (Object.keys(filteredUsers).length > 0) {
      // Show only filtered users.
      mapService.fitBounds($scope, filteredUsers);
    } else {
      // No users found, show map that will fit all users when they are back
      mapService.fitBounds($scope, allActiveUsers);
    }
  }

  function showUser(userId) {
    $scope.currentUser = $scope.getCurrentUsers().getUser(userId);
    $scope.streamButtonText = 'Begin stream';
    $scope.waitingStreaming = false;

    if ( $scope.currentUser ) {
      google.maps.event.trigger($scope.myMap, 'resize');
      $scope.myMap.setCenter($scope.currentUser.marker.getPosition());

      mapService.showBalloon($scope);
    }
  }

  function requestStream(user) {
    socket.emit('watch', user.id);

    if (!(user.id in $scope.isPaused) && !$rootScope.isWatching) {
      $scope.popModal(user);
      $rootScope.isWatching = true;
      $scope.watchingUserId = user.id;
      user.marker.setIcon(mapService.getGreenMarker(user.userName));
      $window.console.log('watch: ' + user.id);
    }

    //$scope.waitingStreaming = true;
    //if ($scope.isStreaming(user)){
    //  $scope.streamButtonText = 'streaming';
    //showModal($scope.activeUsers[user.id]);
    //} else {
    //  $scope.streamButtonText = 'Sending...';
    //}
  }

  function changeMapPos(lat, lng) {
    var pos = new google.maps.LatLng(lat, lng);
    $scope.myMap.panTo(pos);
    $scope.defaultPos = pos;
  }

  function refreshMap() {
    userService.getMyData().
    then(function (data) {
      if (data.length === 0) {
        return;
      }

      if (Object.keys($scope.getCurrentUsers().userDict).length === 0 && $scope.getCurrentUsers().userDict.constructor === Object) {
        if (data.lastPos && !isNaN(data.lastPos.lat) && !isNaN(data.lastPos.lng)) {
          changeMapPos(data.lastPos.lat, data.lastPos.lng);
        } else if (data.group.lat && data.group.lng && !isNaN(data.group.lat) && !isNaN(data.group.lat)) {
          changeMapPos(data.group.lat, data.group.lng);
        } else {
          changeMapPos(0, 0);
        }
      } else {
        mapService.fitBounds($scope, getFilteredUsers());
      }
    });
  }

  function refreshUsers() {
    var $faLoader = angular.element('#fetchUsers');
    $faLoader.addClass('active');
    $scope.refreshMap();

    $window.setTimeout(function() {
      $faLoader.removeClass('active');
    }, 1000);

    return null;

    // userService.getOnlineUsers().then(function (data) {
    //   $window.console.log('getOnlineUsers');
    //   $window.console.log(data);
    //
    //   var bounds = new google.maps.LatLngBounds();
    //
    //   angular.forEach(data, function (user) {
    //     //$scope.loadUser(user);
    //     var coord = new google.maps.LatLng(user.location.lat, user.location.lng);
    //     bounds.extend(coord);
    //   });
    //
    //   $scope.myMap.fitBounds(bounds);
    //
    //   userService.getStreamingUsers().then(function (data) {
    //     angular.forEach(data, function (user) {
    //       showStream($scope.activeUsers[user.id]);
    //     });
    //
    //   });
    // });
  }

  function showModal(user) {
    mapService.closeBalloon();
    $window.console.log('showModal with user=[' + user.id + ']');
    $scope.watchingUserId = user.id;
    //showStream(user);
    $scope.$uibModalInstance = $uibModal.open({
      templateUrl: 'app/realtime/videoStream/player.html',
      controller: 'ModalVideoCtrl',
      windowClass: 'realtimePlayer',
      backdrop: false,
      scope: $rootScope,
      resolve: {
        user: function () {
          return (user);
        }
      }
    });
  }

  var loadUser = function(data) {

    var user = $scope.getCurrentUsers().getUser(data.id);
    var isNew = false;

    if (!user) {
      $scope.getCurrentUsers().enterUser(data.id);
      var user = $scope.getCurrentUsers().getUser(data.id);
      isNew = true;
    }

    if (user.marker == undefined)
      isNew = true;

    $window.console.log('Socket: Location received for: ' + data.username + ' @ ' + data.location.lat + ',' + data.location.lng);

    var pos = new google.maps.LatLng(data.location.lat, data.location.lng);

    if (isNew) {
      console.log('new user')
      var userPicture = '/assets/images/anonuser.png';
      if (data.profilePicture) {
        userPicture = [ServerUrl, 'pictures', data.id, 'small', 'show'].join('/');
      }

      user = {
        id: data.id,
        userName: data.name,
        login: data.username,
        group: data.groupName,
        marker: mapService.createMarker($scope, pos, data),
        groupId: data.groupId,
        accuracy: data.location.accuracy,
        picture: userPicture
      };

      if (data.state == 'PAUSED') {
        $scope.isPaused[user.id] = user;
      }
    }

    user.marker.setPosition(pos);
    user.accuracy = data.location.accuracy;
    mapService.applyCircle($scope, user);

    if (data.battery) {
      user.batteryPercentage = data.battery.batteryPercentage;
    }

    user = $scope.getCurrentUsers().updateUser(user);
    if (isNew) {
      mapService.fitBounds($scope, $scope.getCurrentUsers().getAllUsers());
    }
    // }
  };

  $scope.currentUsers = {
    userDict: {},

    reset: function() {
      var self = this;
      Object.keys(this.userDict).forEach(function(k) {
        self.exitUser(k);
      });
    },

    enterUser: function(userId) {
      if (userId in this.userDict) {
        this.exitUser(userId);
      }

      this.userDict[userId] = {state: 0};
    },

    exitUser: function(userId) {
      var user = this.userDict[userId];

      if (!user) {
        return null;
      }

      if (user.marker) {
        user.marker.setIcon(mapService.getGreyMarker(user.userName));
        if (user.cityCircle) {
          user.cityCircle.setMap(null);
        }

        $window.setTimeout(function () {
          user.marker.setMap(null);
        }, 5000);
      }

      $window.console.log('clear user: '+userId);
      delete this.userDict[userId];
      return true;
    },

    updateUser: function(userData) {
      $window.console.log('update user: '+userData.id);

      if (!(userData.id in this.userDict)) {
        return null;
      }

      var tmp = angular.extend({}, userData);
      tmp.state = 1;
      this.userDict[userData.id] = tmp;
      return userData;
    },

    getUser: function(userId) {
      if (userId in this.userDict) {
        return this.userDict[userId];
      } else {
        return null;
      }
    },

    getAllUsers : function() {
      return this.userDict;
    }
  };

  if ($scope.getCurrentUsers === undefined) {
    $scope.getCurrentUsers = function() {

      // $window.console.warn($scope.currentUsers.userDict);
      return $scope.currentUsers;
    };
  }

  $scope.filterUsers = filterUsers;

  $scope.loadUser = loadUser;

  $scope.showUser = showUser;

  $scope.refreshMap = refreshMap;

  $scope.refreshUsers = refreshUsers;

  $scope.popIncidentFlag = function (username) {
    if (username) {
      notify({
        templateUrl: 'app/views/notifications/errorNotification.html',
        message: username + ' ' + gettextCatalog.getString('has flagged an incident'),
        position: 'right'
      });
    }
  };
  $scope.popStreamingDenied = function (username) {
    if (username) {
      notify({
        templateUrl: 'app/views/notifications/errorNotification.html',
        message: username + ' ' + gettextCatalog.getString('can not stream right now.'),
        position: 'right'
      });
    }
  };

  $scope.popModal = function (user) {
    showModal(user);
  };

  $scope.goToUser = function (user) {
    HistoryManager.setCurrentUserId(user.id);
    var path = '/history';
    $location.path(path);
  };

  $scope.myStyle = {
    'height': ($window.innerHeight) + 'px',
    'width': '100%'
  };

  angular.element($window).bind('resize', function () {
    $scope.myStyle.height = $window.innerHeight + 'px';
    google.maps.event.trigger($scope.myMap, 'resize');
    // $scope.refreshUsers();
  });

  var receiveBroadcastersList = function(data) {
    $window.console.log('listing');
    $window.console.log($scope.getCurrentUsers().userDict);
    $scope.getCurrentUsers().reset();
    $window.console.log(data);

    $window.console.log('=====');
    $window.console.log($scope.getCurrentUsers().userDict);
  };

  var prepareSocket = function(socket) {
    $window.console.log('PREPARING !!!! <<<<<<<<<<-----');

    socket.emit('getBroadcasters', receiveBroadcastersList);

    socket.off('frame');
    socket.on('frame', function(frame){
      var imgArray = new $window.Uint8Array(frame.frame);
      //$window.console.log(imgArray.length);
      $rootScope.$emit('h264Frame', imgArray);
    });


    socket.off('missionPaused');
    socket.on('missionPaused', function(data){
      var user = $scope.getCurrentUsers().getUser(data.userId);

      console.warn('Mission paused by: ', user.userName);

      mapService.closeBalloon();
      if ($scope.$uibModalInstance !== null) {
        $scope.$uibModalInstance.close();
        $scope.$uibModalInstance = null;
      }

      if (user.userName) {
        notify({
          templateUrl: 'app/views/notifications/warningNotification.html',
          message: user.userName + ' ' + gettextCatalog.getString('has paused the mission.'),
          position: 'right',
          duration: 5000
        });
      }

      $scope.isPaused[user.id] = user;
      $rootScope.isWatching = false;

      user.marker.setIcon(mapService.getGreyMarker(user.userName));
    });

    socket.off('missionResumed');
    socket.on('missionResumed', function(data){
      var user = $scope.getCurrentUsers().getUser(data.userId);

      console.warn('Mission resumed by: ', user.userName);

      if (user.userName) {
        notify({
          templateUrl: 'app/views/notifications/warningNotification.html',
          message: user.userName + ' ' + gettextCatalog.getString('has resumed the mission.'),
          position: 'right',
          duration: 5000
        });
      }

      delete $scope.isPaused[user.id];

      user.marker.setIcon(mapService.getBlueMarker(user.userName));
    });

    socket.off('startStreamingRequest');
    socket.on('startStreamingRequest', function(data){
      var user = $scope.getCurrentUsers().getUser(data.userId);

      console.warn('Streaming requested by: ', user.userName);

      if (user.userName) {
        notify({
          templateUrl: 'app/views/notifications/warningNotification.html',
          message: user.userName + ' ' + gettextCatalog.getString('is requesting livestream'),
          position: 'right',
          duration: 5000
        });
      }

      user.marker.setIcon(mapService.getYellowMarker(user.userName));
    });

    socket.off('stopStreamingRequest');
    socket.on('stopStreamingRequest', function(data){
      var user = $scope.getCurrentUsers().getUser(data.userId);

      console.warn('Streaming request cancelled by: ', user.userName);

      user.marker.setIcon(mapService.getBlueMarker(user.userName));
    });

    socket.off('streamStarted');
    socket.on('streamStarted', function(data){
      console.info('STREAM STARTED ', data);
      var user = $scope.getCurrentUsers().getUser(data.userId);
      user.marker.setIcon(mapService.getGreenMarker(user.userName));
    });

    socket.off('streamStopped');
    socket.on('streamStopped', function(data){
      console.info('STREAM STOPPED ', data);
      var user = $scope.getCurrentUsers().getUser(data.userId);
      user.marker.setIcon(mapService.getBlueMarker(user.userName));

      if (data.userId == $scope.watchingUserId) {
        $rootScope.$emit('streamStopped');
        mapService.closeBalloon();

        if ($scope.$uibModalInstance !== null) {
          $scope.$uibModalInstance.close();
          $scope.$uibModalInstance = null;
        }

        if (user.userName) {
          notify({
            templateUrl: 'app/views/notifications/warningNotification.html',
            message: user.userName + ' ' + gettextCatalog.getString('disabled live streaming.'),
            position: 'right',
            duration: 5000
          });
        }

        $scope.watchingUserId = -1;
        $rootScope.isWatching = false;
      }
    });

    socket.off('streamDenied');
    socket.on('streamDenied', function(data){
      if ($scope.currentUser && $scope.currentUser.id == data.id) {
        mapService.closeBalloon();
        if ($scope.$uibModalInstance !== null) {
          $scope.$uibModalInstance.close();
          $scope.$uibModalInstance = null;
        }

        $scope.popStreamingDenied(data.name);
        $scope.watchingUserId = -1;
        $rootScope.isWatching = false;

        var user = $scope.getCurrentUsers().getUser(data.id);

        if (!(user.id in $scope.isPaused)) {
          user.marker.setIcon(mapService.getBlueMarker(user.userName));
        }
      }
    });

    socket.off('userLeft');
    socket.on('userLeft', function(data) {
      $window.console.log('user left: '+data.userId);

      var user = $scope.getCurrentUsers().getUser(data.userId);

      if (! user) {
        $window.console.log('out of sync event. Ignoring');
        return;
      }

      //timeoutUser($scope.activeUsers[data.userLeft]);
      mapService.closeBalloon();
      if ($scope.$uibModalInstance !== null) {
        $scope.$uibModalInstance.close();
        $scope.$uibModalInstance = null;
      }

      if (user.userName) {
        notify({
          templateUrl: 'app/views/notifications/warningNotification.html',
          message: user.userName + ' ' + gettextCatalog.getString('is no longer connected'),
          position: 'right',
          duration: 5000
        });
      }

      $scope.watchingUserId = -1;
      $rootScope.isWatching = false;
      delete $scope.isPaused[user.id];
      $scope.getCurrentUsers().exitUser(data.userId);
    });

    socket.off('users:incidentFlag');
    socket.on('users:incidentFlag', function(data){
      $window.console.log('incident!!');
      $window.console.log(data);
      $scope.popIncidentFlag(data.name);

      var user = $scope.getCurrentUsers().getUser(data.id);
      user.marker.setIcon(mapService.getRedMarker(user.userName));

      $timeout(function(){
        if($scope.watchingUserId > 0) {
          user.marker.setIcon(mapService.getGreenMarker(user.userName));
        } else {
          user.marker.setIcon(mapService.getBlueMarker(user.userName));
        }
      }, 15000);
    });

    socket.off('users:heartbeat');
    socket.on('users:heartbeat', function(data) {
      loadUser(data);
    });

    socket.off('disconnect');
    socket.on('disconnect', function (/*socket*/) {
      $scope.getCurrentUsers().reset();

      // start dismiss livestream modal
      if ($rootScope.isAuthenticated()) {
        if ($scope.$uibModalInstance && $rootScope.deregFrame && $rootScope.deregStoppedStream) {
          $scope.$uibModalInstance.close();
          $rootScope.deregFrame();
          $rootScope.deregStoppedStream();
        }

        if (socket) {
          socket.emit('unwatch');
        }
      }
      // end dismiss livestream modal

      $scope.watchingUserId = -1;
      $rootScope.isWatching = false;
      $scope.isPaused = {};
      $window.console.log('Got disconnect!');
      angular.element('#realtimeMapConnectionBar').fadeIn();
    });

    socket.off('reconnect');
    socket.on('reconnect', function (/*socket*/) {
      $window.console.log('Got reconnected!');
      socket.emit('getBroadcasters', receiveBroadcastersList);
      angular.element('#realtimeMapConnectionBar').fadeOut();
    });

    socket.off('reconnect_attempt');
    socket.on('reconnect_attempt', function (err) {
      angular.element('#realtimeMapConnectionBarAttempts').text(err);
      $window.console.log('attempt!', err, new Date());
    });
  };

  $scope.requestStream = requestStream;

  // function stopStream(user) {
  //   if (!user) {
  //     return;
  //   }
  //   if ($scope.activeStreams[user.id] && $scope.activeStreams[user.id].modal !== null) {
  //     $scope.activeStreams[user.id].modal.close();
  //   }
  //   delete $scope.activeStreams[user.id];
  //   user.marker.setIcon(mapService.getRedMarker(user.userName));
  // }
  //

  // function showStream(user) {
  //   $scope.activeStreams[user.id] = {
  //     status: 'streaming',
  //     streamId: user.id,
  //     userName: user.userName,
  //     groupId: user.groupId,
  //     streamUrl: user.streamUrl,
  //     modal: null
  //   };
  //
  //   user.marker.setIcon(mapService.getGreenMarker(user.userName));
  // }

  $scope.refreshUsers();

  if (socket.isConnected()) {
    console.log('back to realtime');
    prepareSocket(socket);
    socket.emit('getBroadcasters', receiveBroadcastersList);
  }

  socket.on('connect', function() {
    prepareSocket(socket);
    socket.emit('getBroadcasters', receiveBroadcastersList);
  });

}); //end-RealTimeCtrl
