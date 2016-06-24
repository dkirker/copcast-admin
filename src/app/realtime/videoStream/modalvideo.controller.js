'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $window, $rootScope, $sce, $uibModalInstance, user, socket, mapService) {
    $scope.user = user;

    $scope.options = {
      height: 176,
      autostart: true,
      width: 144

    };

    $scope.dismiss = function () {
      $window.console.log(user);
      $uibModalInstance.close();
      $rootScope.deregFrame();
      $rootScope.deregStoppedStream();

      $window.console.log(user.userName+ ' is leaving watch list');
      socket.emit('unwatch');

      // var user = $scope.getCurrentUsers().getUser(data.id);
      // user.marker.setIcon(mapService.getBlueMarker(user.userName));
    };

  }).directive('h264canvas', function($rootScope, $window) {

    return {
      restrict: 'E',
      templateUrl: 'app/realtime/videoStream/h264canvas.html',
      link: function (scope, iElement/*, iAttrs*/) {
        var p = new $window.Player({
          useWorker: true,
          workerFile: '/vendor/Decoder.js'
        });

        iElement[0].appendChild(p.canvas);
        scope.player = p;

        $rootScope.deregFrame = $rootScope.$on('h264Frame', function(event, data) {
          p.decode(data);
        });

        $rootScope.deregStoppedStream = $rootScope.$on('streamStopped', function(/*event*/) {
          $window.console.log('no stream');
          scope.dismiss();
        });
      }
    };
});
