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
    };

    var PeerManager = function (socket) {

      var localId,
        config = {
          peerConnectionConfig: {
            iceServers: [
              {url:'stun:stun01.sipphone.com'},
              {url:'stun:stun.ekiga.net'},
              {url:'stun:stun.fwdnet.net'},
              {url:'stun:stun.ideasip.com'},
              {url:'stun:stun.iptel.org'},
              {url:'stun:stun.rixtelecom.se'},
              {url:'stun:stun.schlund.de'},
              {url:'stun:stun.l.google.com:19302'},
              {url:'stun:stun1.l.google.com:19302'},
              {url:'stun:stun2.l.google.com:19302'},
              {url:'stun:stun3.l.google.com:19302'},
              {url:'stun:stun4.l.google.com:19302'},
              {url:'stun:stunserver.org'},
              {url:'stun:stun.softjoys.com'},
              {url:'stun:stun.voiparound.com'},
              {url:'stun:stun.voipbuster.com'},
              {url:'stun:stun.voipstunt.com'},
              {url:'stun:stun.voxgratia.org'},
              {url:'stun:stun.xten.com'}
            ]
          },
          peerConnectionConstraints: {
            optional: [
              {'DtlsSrtpKeyAgreement': true}
            ]
          }
        },
        peerDatabase = {},
        localStream,
        socketIO = socket;



      function addPeer(remoteId, diconnectListener) {
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
          var videoElement = document.getElementById('video-wrapper');
          videoElement.innerHTML = '';
          videoElement.appendChild(peer.remoteVideoEl);
          videoElement.className = videoElement.className + ' watermark-wrapper';
        };
        peer.pc.onremovestream = function(event) {
          peer.remoteVideoEl.src = '';
          //remoteVideosContainer.removeChild(peer.remoteVideoEl);
        };
        peer.pc.oniceconnectionstatechange = function(event) {
          switch(
            (  event.srcElement || event.target   ) //Chrome or Firefox
              .iceConnectionState) {
            case 'disconnected':
              if (diconnectListener) {
                diconnectListener();
              }
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
          client: 'admin',
          payload: payload
        });
      }
      function toggleLocalStream(pc) {
        if(localStream) {
          if (!!pc.getLocalStreams().length) {
            pc.removeStream(localStream);
          } else {
            pc.addStream(localStream);
          }
        }
      }
      function error(err){
        console.log(err);
      }

      return {
        getId: function() {
          return localId;
        },

        peerInit: function(remoteId, disconnectListener) {
          var peer = peerDatabase[remoteId] || addPeer(remoteId, disconnectListener);
          send('init', remoteId, null);
        },

        start: function() {
          socketIO.once('message', handleMessage);
          socketIO.once('id', function (id) {
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

    };

    return new PeerManager(socket);
  });
