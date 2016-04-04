'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $rootScope, $sce, $uibModalInstance, user, streamUrl, ServerUrl, socket) {
    $scope.user = user;

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


    $scope.ok = function () {
      $uibModalInstance.close();
      console.log(socket.id+ " is leaving");
      socket.emit('leave');
    };
  }).directive('h264canvas', function($rootScope) {

    var toUint8Array = function(parStr){
      var raw = atob(parStr);
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

        console.log("DONE");

        iElement[0].appendChild(p.canvas);
        scope.player = p;

        //console.log(scope.websocketServer+" <<<<<");
        //var ws = new WebSocket(scope.websocketServer+"?id=1");
        //
        //ws.onopen = function(err) {
        //  console.log('OPENED:'+err);
        //}
        //
        //ws.onerror = function(err) {
        //  console.log(">>"+err);
        //}
        //
        //ws.onmessage = function(data) {

        $rootScope.$on('h264Frame', function(event, data) {
          p.decode(data);

        });
      }
    }
});
