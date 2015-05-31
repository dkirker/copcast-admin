'use strict';

/**
 * @ngdoc service
 * @name copcastAdminApp.peerManager
 * @description
 * # peerManager
 * Service in the copcastAdminApp.
 */
angular.module('copcastAdminApp')
  .factory('peerManager', function (socket) {
    var Peer = function (pcConfig, pcConstraints) {
      this.pc = new RTCPeerConnection(pcConfig, pcConstraints);
      this.remoteVideoEl = document.createElement('video');
      this.remoteVideoEl.controls = true;
      this.remoteVideoEl.autoplay = true;

    }

    var PeerManager = (function (socket) {

      var localId,
        config = {
          peerConnectionConfig: {
            iceServers: [
              {"url": "stun:23.21.150.121"},
              {"url": "stun:stun.l.google.com:19302"}
            ]
          },
          peerConnectionConstraints: {
            optional: [
              {"DtlsSrtpKeyAgreement": true}
            ]
          }
        },
        peerDatabase = {},
        localStream,
        socketIO = socket;



      function addPeer(remoteId) {
        var peer = new Peer(config.peerConnectionConfig, config.peerConnectionConstraints);
        peer.pc.onicecandidate = function(event) {
          if (event.candidate) {
            send('candidate', remoteId, {
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
            });
          }
        };
        peer.pc.onaddstream = function(event) {
          attachMediaStream(peer.remoteVideoEl, event.stream);
          document.getElementById('remoteVideosContainer').appendChild(peer.remoteVideoEl);
          //remoteVideosContainer.appendChild(peer.remoteVideoEl);
        };
        peer.pc.onremovestream = function(event) {
          peer.remoteVideoEl.src = '';
          remoteVideosContainer.removeChild(peer.remoteVideoEl);
        };
        peer.pc.oniceconnectionstatechange = function(event) {
          switch(
            (  event.srcElement // Chrome
            || event.target   ) // Firefox
              .iceConnectionState) {
            case 'disconnected':
              remoteVideosContainer.removeChild(peer.remoteVideoEl);
              break;
          }
        };
        peerDatabase[remoteId] = peer;

        return peer;
      }
      function answer(remoteId) {
        var pc = peerDatabase[remoteId].pc;
        pc.createAnswer(
          function(sessionDescription) {
            pc.setLocalDescription(sessionDescription);
            send('answer', remoteId, sessionDescription);
          },
          error
        );
      }
      function offer(remoteId) {
        var pc = peerDatabase[remoteId].pc;
        pc.createOffer(
          function(sessionDescription) {
            pc.setLocalDescription(sessionDescription);
            send('offer', remoteId, sessionDescription);
          },
          error
        );
      }
      function handleMessage(message) {
        var type = message.type,
          from = message.from,
          pc = (peerDatabase[from] || addPeer(from)).pc;

        console.log('received ' + type + ' from ' + from);

        switch (type) {
          case 'init':
            toggleLocalStream(pc);
            offer(from);
            break;
          case 'offer':
            pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
            answer(from);
            break;
          case 'answer':
            pc.setRemoteDescription(new RTCSessionDescription(message.payload), function(){}, error);
            break;
          case 'candidate':
            if(pc.remoteDescription) {
              pc.addIceCandidate(new RTCIceCandidate({
                sdpMLineIndex: message.payload.label,
                sdpMid: message.payload.id,
                candidate: message.payload.candidate
              }), function(){}, error);
            }
            break;
        }
      }
      function send(type, to, payload) {
        console.log('sending ' + type + ' to ' + to);

        socketIO.emit('message', {
          to: to,
          type: type,
          payload: payload
        });
      }
      function toggleLocalStream(pc) {
        if(localStream) {
          (!!pc.getLocalStreams().length) ? pc.removeStream(localStream) : pc.addStream(localStream);
        }
      }
      function error(err){
        console.log(err);
      }

      return {
        getId: function() {
          return localId;
        },

        peerInit: function(remoteId) {
          var peer = peerDatabase[remoteId] || addPeer(remoteId);
          send('init', remoteId, null);
        },

        start: function() {
          socketIO.on('message', handleMessage);
          socketIO.on('id', function (id) {
            localId = id;
          });
        },
        clearPeers: function(){
          for (var i in peerDatabase) {
            peerDatabase[i].pc.close();
          }
          peerDatabase = {};
        }
      };

    });

    return new PeerManager(socket);
  });
