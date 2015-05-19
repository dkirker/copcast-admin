'use strict';

/**
 * @ngdoc function
 * @name copcastAdminApp.controller:ModalvideoctrlCtrl
 * @description
 * # ModalvideoctrlCtrl
 * Controller of the copcastAdminApp
 */
angular.module('copcastAdminApp')
  .controller('ModalVideoCtrl', function ($scope, $http, ServerUrl, user, streamUrl) {
    $scope.user = user;
    $scope.jwOptions = {
      file: streamUrl,
      height: 300,
      autostart: true,
      width: "100%",
      flashplayer: "/jwplayer/jwplayer.flash.swf"
    };

    $scope.ok = function () {
      $scope.activeStreams[user.id].modal.close();
      $http.post(ServerUrl + '/streams/' + user.id + '/stop')
        .success(function (data) {
          if (data.success) {

            delete $scope.activeStreams[user.id];
          }
        }).error(function (data) {

        });
    };
  });
