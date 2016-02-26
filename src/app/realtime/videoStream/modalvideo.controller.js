'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $sce, $uibModalInstance, user, streamUrl, ServerUrl) {
    $scope.user = user;
    $scope.websocketServer = ServerUrl.replace('http', 'ws')+"/ws";

    //$scope.jwOptions = {
    //  file: streamUrl,
    //  height: 300,
    //  autostart: true,
    //  width: "100%",
    //  flashplayer: "/app/jwplayer/jwplayer.flash.swf"
    //};

    $scope.options = {
      height: 176,
      autostart: true,
      width: 144

    };

    $scope.streamPath = $sce.trustAsResourceUrl(streamUrl);

    console.log($('#video-wrapper').id);

    //// Optional: Catch ng-jwplayer event for when JWPlayer is ready
    //$scope.$on('ng-jwplayer-ready', function(event, args) {
    //
    //
    //  // Get player from service
    //  //var player = jwplayerService.myPlayer[args.playerId];
    //});

    $scope.ok = function () {
      $uibModalInstance.close();
      delete $scope.activeStreams[user.id];
    };
  }).directive('h264canvas', function() {

    var toUint8Array = function(parStr){
      var raw = window.atob(parStr);
      var rawLength = raw.length;
      var array = new Uint8Array(new ArrayBuffer(rawLength));

      var i;
      for(i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
      }
      return array;
    };

    return {
      restrict: 'E',
      templateUrl: 'app/realtime/videoStream/h264canvas.html',
      link: function (scope, iElement, iAttrs) {
        var p = new Player({
          useWorker: true,
          workerFile: "/vendor/Decoder.js"
        });

        iElement[0].appendChild(p.canvas);
        scope.player = p;

        console.log(scope.websocketServer+" <<<<<");
        var ws = new WebSocket(scope.websocketServer+"?id=1");

        ws.onopen = function(err) {
          console.log('OPENED:'+err);
        }

        ws.onerror = function(err) {
          console.log(">>"+err);
        }

        ws.onmessage = function(data) {
          var tmp;
          try {
            tmp = window.atob(data.data);
          } catch(err) {
            console.log(err);
            return;
          }
          console.log(tmp.length);
          var bin = toUint8Array(data.data);
          p.decode(bin);
        }
      }
    }
});
