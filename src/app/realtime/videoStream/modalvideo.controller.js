'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $rootScope, $sce, $uibModalInstance, user, socket) {
    $scope.user = user;

    $scope.options = {
      height: 176,
      autostart: true,
      width: 144

    };

    $scope.dismiss = function () {
      console.log(user);
      $uibModalInstance.close();
      $rootScope.deregFrame();
      $rootScope.deregStoppedStream();

      console.log(user.userName+ " is leaving watch list");
      socket.emit('unwatch');
    };

  }).directive('h264canvas', function($rootScope) {

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

        $rootScope.deregFrame = $rootScope.$on('h264Frame', function(event, data) {
          p.decode(data);
        });

        $rootScope.deregStoppedStream = $rootScope.$on('streamStopped', function(event) {
          console.log('no stream');
          scope.dismiss();
        });
      }
    }
});
