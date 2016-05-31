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
  controller('RealtimeCtrl', function($scope, $uibModal, socket, ServerUrl, notify, $window, $rootScope, mapService,
                                      userService, $location, HistoryManager, gettextCatalog) {

    $scope.windowHeight = $window.innerHeight;
    $scope.windowWidth = $window.innerWidth;
    $rootScope.selected = 'realtime';
    $scope.streamButtonText = gettextCatalog.getString('Livestream');
    $scope.waitingStreaming = false;
    $scope.searchString = '';
    $scope.alerts = [];
    $scope.$uibModalInstance = null;

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

    function filterUsers() {
      if (!$scope.searchString) {
        //show all users
        angular.forEach($scope.activeUsers, function (user) {
          //TODO add group so we can search for specific groups
          user.marker.setMap($scope.myMap);
          if (user.cityCircle) {
            user.cityCircle.setMap($scope.myMap);
          }

        });
      } else {
        //allows filter by regex
        angular.forEach($scope.activeUsers, function (user) {
          //TODO add group so we can search for specific groups
          var lUserName = user.userName;
          var lUserLogin = user.login;
          var reMatch = new RegExp($scope.searchString, 'gi');

          if (lUserName.match(reMatch) || lUserLogin.match(reMatch)) {
            user.marker.setMap($scope.myMap);
            if (user.cityCircle) {
              user.cityCircle.setMap($scope.myMap);
            }
          } else {
            user.marker.setMap(null);
            if (user.cityCircle) {
              user.cityCircle.setMap(null);
            }
          }
        });
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

      $scope.popModal(user);
      $window.console.log('watch: '+user.id);

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

        if (data.lastPos && !isNaN(data.lastPos.lat) && !isNaN(data.lastPos.lng)) {
          changeMapPos(data.lastPos.lat, data.lastPos.lng);
        } else if (data.group.lat && data.group.lng && !isNaN(data.group.lat) && !isNaN(data.group.lat)) {
          changeMapPos(data.group.lat, data.group.lng);
        } else {
          changeMapPos(0, 0);
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

    $window.console.log('loaduser');

    var user = $scope.getCurrentUsers().getUser(data.id);

    if (user === null) { //user not in list

      // user not connected via socket. Ignoring
      $window.console.log('User not active yet. Registering now.');
      $scope.getCurrentUsers().enterUser(data.id);
    } else {

      user = angular.extend({}, user);

      $window.console.log('Socket: Location received for: ' + data.username + ' @ ' + data.location.lat + ',' + data.location.lng);

      var pos = new google.maps.LatLng(data.location.lat, data.location.lng);
      var isNew = (parseInt(user.state) === 0);

      if (isNew) {

        var marker = mapService.createMarker($scope, pos, data);

        var userPicture = '/assets/images/anonuser.png';

        if (data.profilePicture) {
          userPicture = [ServerUrl, 'pictures', data.id, 'small', 'show'].join('/');
        }

        var newUser = {
          id: data.id,
          userName: data.name,
          login: data.username,
          group: data.group,
          marker: marker,
          groupId: data.groupId,
          accuracy: data.location.accuracy,
          picture: userPicture
        };

        user = newUser;
        isNew = true;
      }

      user.marker.setPosition(pos);
      user.accuracy = data.location.accuracy;

      if (data.battery) {
        user.batteryPercentage = data.battery.batteryPercentage;
      }

      user = $scope.getCurrentUsers().updateUser(user);
      if (isNew) {
        mapService.fitBounds($scope, $scope.getCurrentUsers().getAllUsers());
      }
    }
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
      notify({
        templateUrl: 'app/views/notifications/errorNotification.html',
        message: username + ' ' + gettextCatalog.getString('has flagged an incident'),
        position: 'right'
      });
    };
    $scope.popStreamingDenied = function (username) {
      notify({
        templateUrl: 'app/views/notifications/errorNotification.html',
        message: username + ' ' + gettextCatalog.getString('can not stream right now.'),
        position: 'right'
      });
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

      data.broadcasters.forEach(function (e) {
        $scope.getCurrentUsers().enterUser(e);
      });

      $window.console.log('=====');
      $window.console.log($scope.getCurrentUsers().userDict);
    };

    var prepareSocket = function(socket) {
      $window.console.log('PREPARING !!!! <<<<<<<<<<-----');

      socket.emit('getBroadcasters', receiveBroadcastersList);

      socket.on('frame', function(frame){
        var imgArray = new $window.Uint8Array(frame.frame);
        //$window.console.log(imgArray.length);
        $rootScope.$emit('h264Frame', imgArray);
      });

      socket.on('streamStopped', function(){
        $rootScope.$emit('streamStopped');
      });

      socket.on('streamDenied', function(data){
        if ($scope.currentUser && $scope.currentUser.id == data.id) {
          mapService.closeBalloon();
          if ($scope.$uibModalInstance !== null) {
            $scope.$uibModalInstance.close();
            $scope.$uibModalInstance = null;
          }
          $scope.popStreamingDenied(data.name);
        }
      });

      socket.on('userLeft', function(data) {
        $window.console.log('user left: '+data.userId);

        if (! $scope.getCurrentUsers().exitUser(data.userId)) {
          $window.console.log('out of sync event. Ignoring');
          return;
        }

        //timeoutUser($scope.activeUsers[data.userLeft]);
        mapService.closeBalloon();
        if ($scope.$uibModalInstance !== null) {
          $scope.$uibModalInstance.close();
          $scope.$uibModalInstance = null;
        }

        $scope.getCurrentUsers().exitUser(data.userId);
      });

      socket.on('userEntered', function(data) {
        $window.console.log('userEntered');
        $window.console.log(data);
        // $scope.activeUsers[data.userId] = {};
        $scope.getCurrentUsers().enterUser(data.userId);
      });

      socket.on('users:incidentFlag', function(data){
        $window.console.log('incident!!');
        $window.console.log(data);
        $scope.popIncidentFlag(data.username);
      });

      socket.on('users:heartbeat', function(data) {
        loadUser(data);
      });

      socket.on('disconnect', function (/*socket*/) {

        $scope.getCurrentUsers().reset();
        $window.console.log('Got disconnect!');
        angular.element('#realtimeMapConnectionBar').fadeIn();
      });

      socket.on('reconnect', function (/*socket*/) {
        $window.console.log('Got reconnected!');
        angular.element('#realtimeMapConnectionBar').fadeOut();
      });

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

    socket.on('connect', function() { prepareSocket(socket); });

    if (socket.isConnected()) {
      socket.off('users:heartbeat');
      socket.on('users:heartbeat', loadUser);
      socket.emit('getBroadcasters', receiveBroadcastersList);
    }
  }); //end-RealTimeCtrl
