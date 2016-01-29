'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $uibModalInstance, user) {
    $scope.user = user;

    $scope.jwOptions = {
      file: streamUrl,
      height: 300,
      autostart: true,
      width: "100%",
      flashplayer: "/jwplayer/jwplayer.flash.swf"
    };

    $scope.ok = function () {
      $uibModalInstance.close();
      delete $scope.activeStreams[user.id];
    };
  });
