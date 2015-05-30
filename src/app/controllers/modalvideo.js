'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, user, socket) {
    $scope.user = user;
    var client = new PeerManager(socket);
    client.peerInit(user.id);

    $scope.ok = function () {
      $scope.activeStreams[user.id].modal.close();
      //TODO      delete $scope.activeStreams[user.id];

    };
  });
