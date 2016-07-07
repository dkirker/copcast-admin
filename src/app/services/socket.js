'use strict';

/**
 * @ngdoc service
 * @name copcastAdminApp.socket
 * @description
 * # socket
 * Factory in the copcastAdminApp.
 */
angular.module('copcastAdminApp')
  .factory('socket',function(ServerUrl, userService, $rootScope, $window) {
    // Loads the socket from the server
    var body = $window.document.getElementsByTagName('body')[0],
      socket = {},
      socketIo = null,
      connected = false,
      onConnect = [],
      tag = $window.document.createElement('script');

    tag.src = ServerUrl + '/socket.io/socket.io.js';
    tag.id = 'socket-io';
    body.appendChild(tag);

    var loadTimes = 0;
    var maxRetry = 1000;
    var timeBetweenRetries = 2000;

    var getRandomInt = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    socket.connect = function(token) {
      var timeUsed = 0;

      if(!token || !$rootScope.globals || !$rootScope.globals.currentUser){
        $window.console.log('socket.connect without token or user. returning.');
        return;
      }

      if ( typeof io === 'undefined' ) {
        if(loadTimes < maxRetry){
          loadTimes++;
          timeUsed = timeBetweenRetries * getRandomInt(1, 3);
          $window.setTimeout(function() {
            socket.connect(token);
          }, timeUsed);
        }

        $window.console.log('socket.connect without io. retry.number=['+loadTimes+'], timeUsed=['+timeUsed+']');
        //TODO maybe raise a 401 error to show modal
        return;
      }

      socketIo = $window.io.connect(ServerUrl, { query : 'token=' + token +'&clientType=admin&userId='+$rootScope.globals.currentUser.userId,
        forceNew: true,
        reconnection: true,
        reconnectionDelay: 5000,
        reconnectionDelayMax: 10000,
        transports : ['websocket'],
        timeout: 20000
      }); // OBS: the time between successive connection attemps will be DelayMax + timeout = 5s (1000ms + 4000ms)

      socketIo.once('connect', function() {
        connected = true;
        //onConnect.length = 0;
        $window.console.log('socket connected!');
        $window.console.log('CallBack length: '+onConnect.length);
        angular.forEach(onConnect, function(cb) {
          cb();
        });
      });

      socketIo.on('disconnect', function() {
        $window.console.log('SOCKET.IO CONNECTION LOST!');
        socket.connect(token);
      });

      socketIo.on('error', function(err) {
        $window.console.log('Socket Error:', err);
      });

    };

    socket.disconnect = function() {
      //socketIo.disconnect();
      $window.console.log('should disconnect');
      socketIo.disconnect();
      //$window.console.log(socketIo.close());
    };

    socket.on = function(ev, cb) {
      if ( !connected ) {
        if ( ev !== 'connect' ) {
          throw new Error('Socket not connected');
        } else {
          return onConnect.push(cb);
        }
      }

      socketIo.on(ev,cb);
    };

    socket.once = function(ev, cb) {
      if ( !connected ) {
        if ( ev !== 'connect' ) {
          throw new Error('Socket not connected');
        } else {
          return onConnect.push(cb);
        }
      }

      socketIo.once(ev,cb);
    };

    socket.emit = function(action, data){
      socketIo.emit(action, data);
    };

    socket.isConnected = function() {
      return connected;
    };

    socket.off = function(evt) {
      socketIo.off(evt);
    };

    return socket;
  });
