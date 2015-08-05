'use strict';

/**
 * @ngdoc service
 * @name copcastAdminApp.socket
 * @description
 * # socket
 * Factory in the copcastAdminApp.
 */
angular.module('copcastAdminApp')
  .factory('socket',function(ServerUrl) {

    // Loads the socket from the server
    var body = document.getElementsByTagName('body')[0],
      socket = {},
      socketIo = null,
      connected = false,
      onConnect = [],
      tag = document.createElement('script');

    tag.src = ServerUrl + '/socket.io/socket.io.js';
    tag.id = 'socket-io';
    body.appendChild(tag);

    var loadTimes = 0;
    var maxRetry = 3;
    var timeBetweenRetries = 500;

    var getRandomInt = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    socket.connect = function(token) {
      if(!token){
        console.log('socket.connect without token. returning.');
        return;
      }
      if ( typeof io === 'undefined' ) {
        if(loadTimes < maxRetry){
          loadTimes++;
          var timeUsed = timeBetweenRetries * getRandomInt(1, 3);
          setTimeout(function() {
            socket.connect(token);
          }, timeUsed)
        }
        console.log('socket.connect without io. retry.number=['+loadTimes+'], timeUsed=['+timeUsed+']');
        //TODO maybe raise a 401 error to show modal
        return;
      }

      socketIo = io.connect(ServerUrl, { query : 'token=' + token });
      socketIo.once('connect', function() {
        connected = true;
        console.log('socket connected!');
        angular.forEach(onConnect, function(cb) {
          cb();
        });
      });

      socketIo.once('error', function(err) {
        console.log('Socket Error:', err);
      });
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

    return socket;
  });
