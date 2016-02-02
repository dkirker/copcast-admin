'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope,$sce, $uibModalInstance, user, streamUrl) {
    $scope.user = user;

    //$scope.jwOptions = {
    //  file: streamUrl,
    //  height: 300,
    //  autostart: true,
    //  width: "100%",
    //  flashplayer: "/app/jwplayer/jwplayer.flash.swf"
    //};

    $scope.options = {
        height: 300,
        autostart: true,
        width: "100%",

    };

    $scope.streamPath = $sce.trustAsResourceUrl(streamUrl);

    // Optional: Catch ng-jwplayer event for when JWPlayer is ready
    $scope.$on('ng-jwplayer-ready', function(event, args) {


      // Get player from service
      //var player = jwplayerService.myPlayer[args.playerId];
    });

    $scope.ok = function () {
      $uibModalInstance.close();
      delete $scope.activeStreams[user.id];
    };
  });
