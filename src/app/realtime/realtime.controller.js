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

  function RealtimeCtrl($scope, peerManager, $uibModal, socket, ServerUrl, notify, $window, $rootScope, mapService,
                        userService, streamService, $location, $timeout, HistoryManager, gettextCatalog) {

    $scope.windowHeight = window.innerHeight;
    $scope.windowWidth = window.innerWidth;
    $rootScope.selected = 'realtime';
    $scope.streamButtonText = gettextCatalog.getString('Livestream');
    $scope.waitingStreaming = false;
    $scope.searchString = '';
    $scope.alerts = [];

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

    $scope.filterUsers = filterUsers;

    $scope.loadUser = loadUser

    $scope.showUser = showUser;

    $scope.refreshMap = refreshMap;

    $scope.refreshUsers = refreshUsers;

    $scope.isStreaming = isStreaming;

    $scope.popNotification = function (user) {
      notify({
        messageTemplate: '<a ng-click="popModal(' + user.id + ')">' + user.userName + ' is streaming </a>',
        position: "right", scope: $scope
      });
    };

    $scope.popIncidentFlag = function (username) {
      notify({
        templateUrl: 'app/views/notifications/errorNotification.html',
        message: username + ' ' + gettextCatalog.getString('has flagged an incident'),
        position: "right"
      });
    };

    $scope.popModal = function (user) {
      showModal(user);
    }

    $scope.goToUser = function (user) {
      HistoryManager.setCurrentUserId(user.id);
      var path = '/history';
      $location.path(path);
    };

    $scope.isOnline = function (currentUser) {
      return currentUser != null && currentUser.marker.icon !== mapService.getGreyMarker(currentUser.userName);
    };


    $scope.myStyle = {
      'height': (window.innerHeight) + 'px',
      'width': '100%'
    };

    $scope.activeUsers = {};

    $scope.activeStreams = {};

    $scope.currentUser = null;
    //
    //$scope.$watch('selected', function () {
    //  window.setTimeout(function(){
    //    google.maps.event.trigger($scope.myMap, 'resize');
    //    if($scope.defaultPos){
    //      $scope.myMap.setCenter($scope.defaultPos);
    //    }
    //    $scope.refreshUsers();
    //  },10);
    //});


    angular.element($window).bind('resize', function () {
      $scope.myStyle.height = window.innerHeight + 'px';
      google.maps.event.trigger($scope.myMap, 'resize');
      $scope.refreshUsers();
    });

    function timeoutUser(user) {
      user.marker.setIcon(mapService.getGreyMarker(user.userName));
    };

    function removeUser(user) {
      user.marker.setMap(null);
      if (user.cityCircle) {
        user.cityCircle.setMap(null);
      }

    }

    function loadUser(data) {
      console.log("Socket: Location received for: "+data.username+ " @ "+data.location.lat+","+data.location.lng);
      var pos = null;
      if ($scope.activeUsers[data.id] && $scope.activeUsers[data.id] != 'none') {
        pos = new google.maps.LatLng(data.location.lat, data.location.lng);
        $scope.activeUsers[data.id].marker.setPosition(pos);
        $scope.activeUsers[data.id].accuracy = data.location.accuracy;
        if (data.battery)
          $scope.activeUsers[data.id].batteryPercentage = data.battery.batteryPercentage;
        if ($scope.activeUsers[data.id].marker.icon === mapService.getGreyMarker($scope.activeUsers[data.id].userName)) {
          $scope.activeUsers[data.id].marker.setIcon(mapService.getRedMarker($scope.activeUsers[data.id].userName));
        }
      } else if ($scope.activeUsers[data.id] == 'none') {
        pos = new google.maps.LatLng(data.location.lat, data.location.lng);

        var marker = mapService.createMarker($scope, pos, data);

        $scope.activeUsers[data.id] = {
          id: data.id,
          userName: data.name,
          login: data.username,
          deploymentGroup: data.group,
          marker: marker,
          groupId: data.groupId,
          accuracy: data.location.accuracy,
          picture: ServerUrl + data.profilePicture,
          timeoutPromisse: null,
          streamUrl: data.streamUrl
        };
        //TODO remove console.log afterwards
        console.log('loaded user with streamURL: '+data.streamUrl)
        mapService.fitBounds($scope, $scope.activeUsers);

      } else {
        console.error('retarded heartbeat data');
        return;
      }

      mapService.applyCircle($scope, $scope.activeUsers[data.id]);

    };


    socket.on('connect', function () {


      socket.on('frame', function(frame){
        var imgArray = new Uint8Array(frame.frame);
        console.log(imgArray.length);
        $rootScope.$emit("h264Frame", imgArray);
      });

      socket.on('userLeft', function(data) {
        console.log(data);
        //timeoutUser($scope.activeUsers[data.userLeft]);
        removeUser($scope.activeUsers[data.userId]);
        delete $scope.activeUsers[data.userId];
        mapService.closeBalloon();
      });

      socket.on('userEntered', function(data) {
        console.log(data);
        $scope.activeUsers[data.userId] = 'none';
      });

      socket.on('users:incidentFlag', function(data){
        console.log('incident!!');
        console.log(data);
        $scope.popIncidentFlag(data.username);
      });

      socket.on('users:heartbeat', loadUser);

      socket.on('streaming:start', function (data) {

        var user = $scope.activeUsers[data.id];
        if (!user) {
          return console.log('Unable to find user for streaming');
        }
        userService.getMyData().
          then(function (data) {
            if (data.length === 0) {
              return;
            }
            showStream(user);

            console.log(JSON.stringify($scope.activeStreams));

            $scope.popNotification(user);

          });
      });

      socket.on('streaming:stop', function (data) {
        stopStream($scope.activeUsers[data.id]);
        notify.closeAll();
        $scope.$apply();
      });
      socket.on('disconnect', function (socket) {
        console.log('Got disconnect!');
      });
      socket.on('streaming:failed', function (data) {
        if ($scope.activeStreams[data.id] && $scope.activeStreams[data.id].modal){
          $scope.activeStreams[data.id].modal.close();
        }
        //show notification error
        notify({
          templateUrl: 'app/views/notifications/errorNotification.html',
          message: gettextCatalog.getString('Can not start streaming now. Try again later.'),
          position: "right",
          scope: $scope
        });
      });
      socket.on('streaming:alreadyConnected', function (data) {
        //show message in balloon
        if ($scope.currentUser.id === data.id) {
          mapService.showErrorInBallon($scope);
        }
        if ($scope.activeStreams[$scope.currentUser.id] && $scope.activeStreams[$scope.currentUser.id].modal){
          $scope.activeStreams[$scope.currentUser.id].modal.close();
        }
        //show notification error
        notify({
          templateUrl: 'app/views/notifications/errorNotification.html',
          message: gettextCatalog.getString('Can not start streaming now. Try again later.'),
          position: "right",
          scope: $scope
        });
      });
    });


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
    };

    function showUser(userId) {
      $scope.currentUser = $scope.activeUsers[userId];
      $scope.streamButtonText = 'Begin stream';
      $scope.waitingStreaming = false;
      if ( $scope.currentUser ) {
        google.maps.event.trigger($scope.myMap, "resize");
        $scope.myMap.setCenter($scope.currentUser.marker.getPosition());


        mapService.showBalloon($scope);
      }
    };

    function isStreaming(user) {
      return $scope.activeStreams[user.id];
    }

    function requestStream(user) {

      socket.emit('watch', user.id);

      $scope.popModal(user);

      console.log('watch: '+user.id);

      $scope.waitingStreaming = true;
      if ($scope.isStreaming(user)){
        $scope.streamButtonText = 'streaming';
        showModal($scope.activeUsers[user.id]);
      } else {
        $scope.streamButtonText = 'Sending...';
      }
    };
    $scope.requestStream = requestStream;

    function stopStream(user) {
      if (!user || !$scope.activeStreams[user.id]) {
        return;
      }
      if ($scope.activeStreams[user.id] && $scope.activeStreams[user.id].modal != null) {
        $scope.activeStreams[user.id].modal.close();
      }
      delete $scope.activeStreams[user.id];
      user.marker.setIcon(mapService.getRedMarker(user.userName));
    };


    function refreshUsers() {
      userService.getOnlineUsers().then(function (data) {
        if (data.length === 0) {
          $scope.refreshMap();
          return;
        }
        var bounds = new google.maps.LatLngBounds();
        angular.forEach(data, function (user) {
          //$scope.loadUser(user);
          var coord = new google.maps.LatLng(user.location.lat, user.location.lng);
          bounds.extend(coord);
        });
        $scope.myMap.fitBounds(bounds);

        userService.getStreamingUsers().then(function (data) {
          angular.forEach(data, function (user) {
            showStream($scope.activeUsers[user.id]);
          });
        });
      });
    };


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
    };


    function changeMapPos(lat, lng) {
      var pos = new google.maps.LatLng(lat, lng);
      $scope.myMap.panTo(pos);
      $scope.defaultPos = pos;
    }

    function showModal(user) {
      mapService.closeBalloon();
      console.log('showModal with user=[' + user.id + ']');
      console.log(JSON.stringify($scope.activeStreams[user.id]));
      showStream(user);
      $uibModal.open({
        templateUrl: 'app/realtime/videoStream/player_h264.html',
        controller: 'ModalVideoCtrl',
        windowClass: 'modal-stream',
        backdrop: false,
        scope: $scope,
        resolve: {
          user: function () {
            return user;
          },
          streamUrl: function(){return user.streamUrl;},
          ServerUrl: function () {
            return ServerUrl;
          }
        }
      });
    }

    function showStream(user) {
      $scope.activeStreams[user.id] = {
        status: 'streaming',
        streamId: user.id,
        userName: user.userName,
        groupId: user.groupId,
        streamUrl: user.streamUrl,
        modal: null
      };

      user.marker.setIcon(mapService.getGreenMarker(user.userName));
    }

    $scope.refreshUsers();


  } //end-RealTimeCtrl
})();
