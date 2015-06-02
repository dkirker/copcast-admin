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



    socket.connect = function(token) {
      if ( typeof io === 'undefined' ) {
        return;
      }

      socketIo = io.connect(ServerUrl, { query : 'token=' + token });
      socketIo.once('connect', function() {
        connected = true;
        console.log("socket connected!");
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

      socketIo.once(ev,cb);
    };

    socket.emit = function(action, data){
      socketIo.emit(action, data);
    }

    return socket;
  });
