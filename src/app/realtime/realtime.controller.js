(function () {
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
  controller('RealtimeCtrl', RealtimeCtrl);

  function RealtimeCtrl($scope, $uibModal, socket, ServerUrl, notify, $window, $rootScope, mapService,
                        userService, $location, HistoryManager, gettextCatalog) {

    $scope.windowHeight = window.innerHeight;
    $scope.windowWidth = window.innerWidth;
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

    $scope.currentUsers = {

      userDict: {},

      reset: function() {
        var self = this;
        Object.keys(this.userDict).forEach(function(k) {
          self.exitUser(k);
        });
      },

      enterUser: function(userId) {

        if (userId in this.userDict)
          this.exitUser(userId);

        this.userDict[userId] = {state: 0};
      },

      exitUser: function(userId) {
        var user = this.userDict[userId];

        if (!user)
          return null;

        if (user.marker) {
          user.marker.setIcon(mapService.getGreyMarker(user.userName));
          if (user.cityCircle)
            user.cityCircle.setMap(null);

          setTimeout(function () {
            user.marker.setMap(null);
          }, 5000);
        }

        console.log('clear user: '+userId);
        delete this.userDict[userId];
        return true;
      },

      updateUser: function(userData) {

        console.log('update user: '+userData.id);

        if (!(userData.id in this.userDict))
          return null;

        var tmp = jQuery.extend({}, userData);
        tmp.state = 1;
        this.userDict[userData.id] = tmp;
        return userData;
      },

      getUser: function(userId) {
        if (userId in this.userDict)
          return this.userDict[userId];
        else
          return null;
      },

      getAllUsers : function() {
        return this.userDict;
      }
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
        position: "right"
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
      'height': (window.innerHeight) + 'px',
      'width': '100%'
    };

    //$scope.activeUsers = {};

    $scope.currentUser = null;

    angular.element($window).bind('resize', function () {
      $scope.myStyle.height = window.innerHeight + 'px';
      google.maps.event.trigger($scope.myMap, 'resize');
      // $scope.refreshUsers();
    });

    function removeUser(user) {

    }

    function loadUser(data) {

      console.log('loaduser');
      console.log($scope.currentUsers.getUser(3));

      var user = $scope.currentUsers.getUser(data.id);

      if (user == null) { //user not in list

        // user not connected via socket. Ignoring
        console.log('ignored location data');

      } else {

        user = jQuery.extend({}, user);

        console.log("Socket: Location received for: " + data.username + " @ " + data.location.lat + "," + data.location.lng);

        var pos = new google.maps.LatLng(data.location.lat, data.location.lng);

        if (user.state == 0) {

          console.log("It's new brand new user");

          var marker = mapService.createMarker($scope, pos, data);

          var newUser = {
            id: data.id,
            userName: data.name,
            login: data.username,
            group: data.group,
            marker: marker,
            groupId: data.groupId,
            accuracy: data.location.accuracy,
            picture: ServerUrl + data.profilePicture
          };

          user = newUser;
        }

        user.marker.setPosition(pos);
        user.accuracy = data.location.accuracy;
        if (data.battery)
          user.batteryPercentage = data.battery.batteryPercentage;

        user = $scope.currentUsers.updateUser(user);
        mapService.fitBounds($scope, $scope.currentUsers.getAllUsers());

      }
    }

    var receiveBroadcastersList = function(data) {
      console.log($scope.currentUsers.userDict);
      $scope.currentUsers.reset();
      console.log(data);
      console.log($scope.currentUsers.getUser(3));
      data.broadcasters.forEach(function (e) {
        $scope.currentUsers.enterUser(e);
      });

      console.log("=====");
      console.log($scope.currentUsers.userDict);
    }

    var prepareSocket = function(socket) {
      console.log("PREPARING !!!! <<<<<<<<<<-----");

      socket.emit('getBroadcasters', receiveBroadcastersList);

      socket.on('frame', function(frame){
        var imgArray = new Uint8Array(frame.frame);
        //console.log(imgArray.length);
        $rootScope.$emit("h264Frame", imgArray);
      });

      socket.on('streamStopped', function(){
        $rootScope.$emit("streamStopped");
      });

      socket.on('userLeft', function(data) {
        console.log('user left: '+data.userId);

        if (! $scope.currentUsers.exitUser(data.userId)) {
          console.log('out of sync event. Ignoring');
          return;
        }

        //timeoutUser($scope.activeUsers[data.userLeft]);
        mapService.closeBalloon();
        if ($scope.$uibModalInstance != null) {
          $scope.$uibModalInstance.close();
          $scope.$uibModalInstance = null;
        }
        $scope.currentUsers.exitUser(data.userId);
      });

      socket.on('userEntered', function(data) {
        console.log('userEntered');
        console.log(data);
        // $scope.activeUsers[data.userId] = {};
        $scope.currentUsers.enterUser(data.userId);
      });

      socket.on('users:incidentFlag', function(data){
        console.log('incident!!');
        console.log(data);
        $scope.popIncidentFlag(data.username);
      });

      socket.on('users:heartbeat', loadUser);

      socket.on('disconnect', function (socket) {

        $scope.currentUsers.reset();
        console.log('Got disconnect!');
        jQuery('#realtimeMapConnectionBar').fadeIn();
      });

      socket.on('reconnect', function (socket) {
        console.log('Got reconnected!');
        jQuery('#realtimeMapConnectionBar').fadeOut();
      });

      socket.on('reconnect_attempt', function (err) {
        jQuery('#realtimeMapConnectionBarAttempts').text(err);
        console.log('attempt!', err, new Date());
      });
    }

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
      $scope.currentUser = $scope.currentUsers.getUser(userId);
      $scope.streamButtonText = 'Begin stream';
      $scope.waitingStreaming = false;
      if ( $scope.currentUser ) {
        google.maps.event.trigger($scope.myMap, "resize");
        $scope.myMap.setCenter($scope.currentUser.marker.getPosition());

        mapService.showBalloon($scope);
      }
    }

    function requestStream(user) {

      socket.emit('watch', user.id);

      $scope.popModal(user);

      console.log('watch: '+user.id);

      //$scope.waitingStreaming = true;
      //if ($scope.isStreaming(user)){
      //  $scope.streamButtonText = 'streaming';
      //showModal($scope.activeUsers[user.id]);
      //} else {
      //  $scope.streamButtonText = 'Sending...';
      //}
    }

    $scope.requestStream = requestStream;

    // function stopStream(user) {
    //   if (!user) {
    //     return;
    //   }
    //   if ($scope.activeStreams[user.id] && $scope.activeStreams[user.id].modal != null) {
    //     $scope.activeStreams[user.id].modal.close();
    //   }
    //   delete $scope.activeStreams[user.id];
    //   user.marker.setIcon(mapService.getRedMarker(user.userName));
    // }
    //

    function refreshUsers() {

      var $faLoader = jQuery('#fetchUsers .fa-refresh');
      $faLoader.addClass('fa-spin');
      $scope.refreshMap();
      setTimeout(function() {
        $faLoader.removeClass('fa-spin');
      }, 1000);

      return null;

      // userService.getOnlineUsers().then(function (data) {
      //   console.log('getOnlineUsers');
      //   console.log(data);
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

    function changeMapPos(lat, lng) {
      var pos = new google.maps.LatLng(lat, lng);
      $scope.myMap.panTo(pos);
      $scope.defaultPos = pos;
    }

    function showModal(user) {
      mapService.closeBalloon();
      console.log('showModal with user=[' + user.id + ']');
      //showStream(user);
      $scope.$uibModalInstance = $uibModal.open({
        templateUrl: 'app/realtime/videoStream/player_h264.html',
        controller: 'ModalVideoCtrl',
        windowClass: 'modal-stream',
        backdrop: false,
        scope: $rootScope,
        resolve: {
          user: function () {
            return (user);
          }
        }
      });
    }

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

    console.log('before');
    if (socket.isConnected()) {
      prepareSocket(socket);
      // socket.emit('getBroadcasters', receiveBroadcastersList);
    } else {
      socket.on('connect', function () {
        prepareSocket(socket);
      });
    }

  } //end-RealTimeCtrl
})();
