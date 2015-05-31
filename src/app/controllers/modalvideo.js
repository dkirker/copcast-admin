'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, user, peerManager) {
    $scope.user = user;

    peerManager.start();
    peerManager.peerInit(user.id);


    $scope.ok = function () {
      peerManager.clearPeers();
      $scope.activeStreams[user.id].modal.close();
      //TODO      delete $scope.activeStreams[user.id];

    };
  });
